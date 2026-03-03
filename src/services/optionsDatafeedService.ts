// Options Datafeed Service — Twelve Data
// Fetches live options chain + expiration dates, and retrieves stored historical snapshots.
// Usage: provide a ticker (e.g. "AAPL") and an expiration/strike date (e.g. "2026-03-20").

const API_BASE = '/.netlify/functions/options-chain';

// ── Types ────────────────────────────────────────────────────────────────

export interface OptionContract {
  contract_name: string;
  option_id: string;
  last_price: number;
  strike: number;
  change: number;
  percent_change: number;
  volume: number;
  open_interest: number;
  implied_volatility: number;
  in_the_money: boolean;
}

export interface OptionsChain {
  calls: OptionContract[];
  puts: OptionContract[];
}

export interface OptionsExpiration {
  dates: string[];
}

export interface OptionsSnapshot {
  symbol: string;
  expiration_date: string;
  snapshot_date: string;
  snapshot_timestamp: string;
  calls?: OptionContract[];
  puts?: OptionContract[];
}

export interface OptionsHistory {
  symbol: string;
  expiration_date: string;
  days: number;
  snapshots: OptionsSnapshot[];
}

/** Summary stats derived from an options chain snapshot. */
export interface OptionsChainSummary {
  symbol: string;
  expirationDate: string;
  totalCallVolume: number;
  totalPutVolume: number;
  putCallRatio: number;
  totalCallOI: number;
  totalPutOI: number;
  maxPainStrike: number | null;
  avgCallIV: number | null;
  avgPutIV: number | null;
  atmStrike: number | null;
}

/** A single strike's historical IV trajectory across snapshots. */
export interface StrikeIVHistory {
  strike: number;
  side: 'call' | 'put';
  series: { date: string; iv: number }[];
}

// ── Fetch helpers ────────────────────────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((err as { error?: string }).error || `Request failed: ${response.status}`);
  }

  return response.json();
}

// ── Live data fetchers ───────────────────────────────────────────────────

/**
 * Get all available expiration dates for a ticker.
 */
export async function getOptionsExpirations(symbol: string): Promise<string[]> {
  const params = new URLSearchParams({ action: 'expiration', symbol });
  const data = await fetchJson<OptionsExpiration>(`${API_BASE}?${params}`);
  return data.dates || [];
}

/**
 * Get the live options chain for a ticker + expiration date.
 * Optionally filter by side ("call" | "put").
 */
export async function getOptionsChain(
  symbol: string,
  expirationDate: string,
  side?: 'call' | 'put',
): Promise<OptionsChain> {
  const params = new URLSearchParams({
    action: 'chain',
    symbol,
    expiration_date: expirationDate,
    dp: '4',
  });
  if (side) params.set('side', side);

  const data = await fetchJson<{ calls?: Record<string, unknown>[]; puts?: Record<string, unknown>[] }>(`${API_BASE}?${params}`);

  return {
    calls: (data.calls || []).map(normalizeContract),
    puts: (data.puts || []).map(normalizeContract),
  };
}

/**
 * Get a single contract by option_id.
 */
export async function getOptionById(
  symbol: string,
  optionId: string,
): Promise<OptionsChain> {
  const params = new URLSearchParams({
    action: 'chain',
    symbol,
    option_id: optionId,
    dp: '4',
  });

  return fetchJson<OptionsChain>(`${API_BASE}?${params}`);
}

// ── Historical data fetchers ─────────────────────────────────────────────

/**
 * Retrieve stored historical snapshots for a ticker + expiration date.
 * Each snapshot represents the full options chain captured on a given day.
 */
export async function getOptionsHistory(
  symbol: string,
  expirationDate: string,
  days: number = 30,
): Promise<OptionsSnapshot[]> {
  const params = new URLSearchParams({
    action: 'history',
    symbol,
    expiration_date: expirationDate,
    days: days.toString(),
  });

  const data = await fetchJson<OptionsHistory>(`${API_BASE}?${params}`);
  return data.snapshots || [];
}

// ── Analytics ────────────────────────────────────────────────────────────

/**
 * Compute summary statistics from a live or snapshot chain.
 */
export function summarizeChain(
  symbol: string,
  expirationDate: string,
  chain: OptionsChain,
): OptionsChainSummary {
  const calls = chain.calls || [];
  const puts = chain.puts || [];

  const totalCallVolume = calls.reduce((s, c) => s + c.volume, 0);
  const totalPutVolume = puts.reduce((s, c) => s + c.volume, 0);
  const totalCallOI = calls.reduce((s, c) => s + c.open_interest, 0);
  const totalPutOI = puts.reduce((s, c) => s + c.open_interest, 0);

  const callIVs = calls.filter((c) => c.implied_volatility > 0).map((c) => c.implied_volatility);
  const putIVs = puts.filter((c) => c.implied_volatility > 0).map((c) => c.implied_volatility);

  return {
    symbol,
    expirationDate,
    totalCallVolume,
    totalPutVolume,
    putCallRatio: totalCallVolume > 0 ? totalPutVolume / totalCallVolume : 0,
    totalCallOI,
    totalPutOI,
    maxPainStrike: calcMaxPain(calls, puts),
    avgCallIV: callIVs.length > 0 ? avg(callIVs) : null,
    avgPutIV: putIVs.length > 0 ? avg(putIVs) : null,
    atmStrike: findATMStrike(calls, puts),
  };
}

/**
 * Build IV history across stored snapshots for a specific strike price.
 * Useful for tracking how implied volatility evolves as expiration approaches.
 */
export function buildStrikeIVHistory(
  snapshots: OptionsSnapshot[],
  strike: number,
  side: 'call' | 'put' = 'call',
): StrikeIVHistory {
  const series: { date: string; iv: number }[] = [];

  for (const snap of snapshots) {
    const contracts = side === 'call' ? snap.calls : snap.puts;
    if (!contracts) continue;

    const match = contracts.find((c) => c.strike === strike);
    if (match && match.implied_volatility > 0) {
      series.push({ date: snap.snapshot_date, iv: match.implied_volatility });
    }
  }

  return { strike, side, series };
}

/**
 * Build a volatility surface from a single chain snapshot.
 * Returns IV mapped by strike for both calls and puts.
 */
export function buildVolSurface(chain: OptionsChain): {
  calls: { strike: number; iv: number }[];
  puts: { strike: number; iv: number }[];
} {
  return {
    calls: (chain.calls || [])
      .filter((c) => c.implied_volatility > 0)
      .map((c) => ({ strike: c.strike, iv: c.implied_volatility }))
      .sort((a, b) => a.strike - b.strike),
    puts: (chain.puts || [])
      .filter((c) => c.implied_volatility > 0)
      .map((c) => ({ strike: c.strike, iv: c.implied_volatility }))
      .sort((a, b) => a.strike - b.strike),
  };
}

/**
 * Convenience: fetch live chain, compute summary, and build vol surface in one call.
 */
export async function getOptionsOverview(
  symbol: string,
  expirationDate: string,
): Promise<{
  chain: OptionsChain;
  summary: OptionsChainSummary;
  volSurface: ReturnType<typeof buildVolSurface>;
}> {
  const chain = await getOptionsChain(symbol, expirationDate);
  const summary = summarizeChain(symbol, expirationDate, chain);
  const volSurface = buildVolSurface(chain);
  return { chain, summary, volSurface };
}

// ── Internal helpers ─────────────────────────────────────────────────────

function normalizeContract(raw: Record<string, unknown>): OptionContract {
  return {
    contract_name: String(raw.contract_name || ''),
    option_id: String(raw.option_id || ''),
    last_price: toNum(raw.last_price),
    strike: toNum(raw.strike),
    change: toNum(raw.change),
    percent_change: toNum(raw.percent_change),
    volume: toNum(raw.volume),
    open_interest: toNum(raw.open_interest),
    implied_volatility: toNum(raw.implied_volatility),
    in_the_money: Boolean(raw.in_the_money),
  };
}

function toNum(v: unknown): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseFloat(v) || 0;
  return 0;
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Max-pain: the strike where total option holder losses are maximized
 * (i.e., the strike where total intrinsic value of ITM options is minimized).
 */
function calcMaxPain(
  calls: OptionContract[],
  puts: OptionContract[],
): number | null {
  const allStrikes = new Set([
    ...calls.map((c) => c.strike),
    ...puts.map((c) => c.strike),
  ]);

  if (allStrikes.size === 0) return null;

  let minPain = Infinity;
  let maxPainStrike = 0;

  for (const strike of allStrikes) {
    let pain = 0;

    for (const call of calls) {
      if (strike > call.strike) {
        pain += (strike - call.strike) * call.open_interest;
      }
    }

    for (const put of puts) {
      if (strike < put.strike) {
        pain += (put.strike - strike) * put.open_interest;
      }
    }

    if (pain < minPain) {
      minPain = pain;
      maxPainStrike = strike;
    }
  }

  return maxPainStrike;
}

/**
 * Find the ATM strike — the strike closest to the underlying price.
 * Inferred from the call with the smallest |change| or highest volume near mid-chain.
 */
function findATMStrike(
  calls: OptionContract[],
  puts: OptionContract[],
): number | null {
  // Heuristic: ATM is the strike where call and put last_price are closest
  const callMap = new Map(calls.map((c) => [c.strike, c.last_price]));
  let minDiff = Infinity;
  let atm: number | null = null;

  for (const put of puts) {
    const callPrice = callMap.get(put.strike);
    if (callPrice === undefined) continue;
    const diff = Math.abs(callPrice - put.last_price);
    if (diff < minDiff) {
      minDiff = diff;
      atm = put.strike;
    }
  }

  return atm;
}
