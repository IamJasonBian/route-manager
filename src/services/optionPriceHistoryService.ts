// Option Price History Service
// Fetches option positions from the order book, then pulls underlying
// price history from Twelve Data for charting.

const TWELVE_DATA_API = 'https://api.twelvedata.com';

// ── Types ────────────────────────────────────────────────────────────────

export interface OptionPositionMeta {
  chain_symbol: string;
  option_type: string;
  strike: number;
  expiration: string;
  mark_price: number;
  avg_price: number;
  iv: number | null;
  quantity: number;
  position_type: string;
  underlying_price: number;
}

export interface UnderlyingPricePoint {
  timestamp: number;
  price: number;
}

export interface OptionChartSeries {
  key: string;
  label: string;
  chain_symbol: string;
  option_type: string;
  strike: number;
  expiration: string;
  quantity: number;
  position_type: string;
  mark_price: number;
  avg_price: number;
  iv: number | null;
  underlying_price: number;
  priceHistory: UnderlyingPricePoint[];
}

export interface OptionPriceHistoryData {
  series: OptionChartSeries[];
}

// ── Twelve Data config per range ─────────────────────────────────────────

const RANGE_CONFIG: Record<number, { outputsize: number; interval: string }> = {
  7: { outputsize: 168, interval: '1h' },
  30: { outputsize: 30, interval: '1day' },
  90: { outputsize: 90, interval: '1day' },
  365: { outputsize: 252, interval: '1day' },
  1095: { outputsize: 780, interval: '1day' },
};

// Map chain_symbol to Twelve Data symbol
function toTwelveDataSymbol(chainSymbol: string): string {
  const upper = chainSymbol.toUpperCase();
  if (upper === 'BTC' || upper === 'BTCUSD') return 'BTC/USD';
  if (upper === 'ETH' || upper === 'ETHUSD') return 'ETH/USD';
  return upper;
}

// ── Fetchers ─────────────────────────────────────────────────────────────

async function fetchOptionPositions(): Promise<OptionPositionMeta[]> {
  const res = await fetch('/.netlify/functions/option-price-history');
  if (!res.ok) throw new Error(`Failed to fetch option positions: ${res.status}`);
  const { options } = (await res.json()) as { options: OptionPositionMeta[] };
  return options || [];
}

async function fetchUnderlyingHistory(
  symbol: string,
  days: number
): Promise<UnderlyingPricePoint[]> {
  const config = RANGE_CONFIG[days] || RANGE_CONFIG[30];
  const apiKey = import.meta.env.VITE_TWELVE_DATA_API_KEY;
  if (!apiKey) throw new Error('VITE_TWELVE_DATA_API_KEY not set');

  const url = new URL(`${TWELVE_DATA_API}/time_series`);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('interval', config.interval);
  url.searchParams.set('outputsize', config.outputsize.toString());
  url.searchParams.set('apikey', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch ${symbol}: ${res.status}`);

  const data = await res.json();
  if (data.status === 'error') throw new Error(data.message || `API error for ${symbol}`);
  if (!data.values || !Array.isArray(data.values)) return [];

  return data.values
    .map((item: Record<string, string>) => ({
      timestamp: new Date(item.datetime).getTime(),
      price: parseFloat(item.close),
    }))
    .reverse();
}

// ── Main API ─────────────────────────────────────────────────────────────

export async function getOptionPriceHistory(
  days: number
): Promise<OptionPriceHistoryData> {
  const positions = await fetchOptionPositions();
  if (positions.length === 0) return { series: [] };

  // Deduplicate underlying symbols
  const uniqueSymbols = [...new Set(positions.map((p) => p.chain_symbol))];
  const tdSymbols = uniqueSymbols.map(toTwelveDataSymbol);

  // Fetch underlying price histories in parallel
  const historyResults = await Promise.allSettled(
    tdSymbols.map((sym) => fetchUnderlyingHistory(sym, days))
  );

  const historyMap = new Map<string, UnderlyingPricePoint[]>();
  uniqueSymbols.forEach((chainSym, i) => {
    const result = historyResults[i];
    if (result.status === 'fulfilled') {
      historyMap.set(chainSym, result.value);
    }
  });

  // Build a series for each option position
  const series: OptionChartSeries[] = positions.map((pos) => {
    const expDate = new Date(pos.expiration + 'T00:00:00');
    const expLabel = expDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const key = `${pos.chain_symbol}-${pos.option_type}-${pos.strike}-${pos.expiration}`;

    return {
      key,
      label: `${pos.chain_symbol} $${pos.strike} ${pos.option_type === 'call' ? 'Call' : 'Put'} (${expLabel})`,
      chain_symbol: pos.chain_symbol,
      option_type: pos.option_type,
      strike: pos.strike,
      expiration: pos.expiration,
      quantity: pos.quantity,
      position_type: pos.position_type,
      mark_price: pos.mark_price,
      avg_price: pos.avg_price,
      iv: pos.iv,
      underlying_price: pos.underlying_price,
      priceHistory: historyMap.get(pos.chain_symbol) || [],
    };
  });

  return { series };
}
