// Weekend Momentum Strategy Service
// Fetches BTC/USD daily history and computes weekend metrics

const TWELVE_DATA_API = 'https://api.twelvedata.com';

interface DailyBar {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface WeekendData {
  fridayDate: string;
  fridayClose: number;
  saturdayLow: number | null;
  sundayClose: number | null;
  sundayLow: number | null;
  mondayOpen: number;
  mondayClose: number;
  monBelowFri: boolean;
  friToSunDrift: number | null;
  weekendDrawdown: number;
  mondayRecoveryPositive: boolean;
}

export interface WeekendMetrics {
  totalWeekends: number;
  monBelowFriPct: number;
  avgFriSunDrift: number;
  avgWeekendDrawdown: number;
  worstWeekendDrawdown: number;
  mondayRecoveryPositivePct: number;
}

const getApiKey = (): string => {
  const key = import.meta.env.VITE_TWELVE_DATA_API_KEY;
  if (!key) {
    throw new Error('VITE_TWELVE_DATA_API_KEY environment variable is not set');
  }
  return key;
};

function getDayOfWeek(dateStr: string): number {
  const d = new Date(dateStr + 'T00:00:00');
  return d.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
}

async function fetchDailyBars(symbol: string, outputsize: number): Promise<DailyBar[]> {
  const apiKey = getApiKey();
  const url = new URL(`${TWELVE_DATA_API}/time_series`);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('interval', '1day');
  url.searchParams.set('outputsize', outputsize.toString());
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch ${symbol}: ${response.status}`);
  }

  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || `API error for ${symbol}`);
  }

  return data.values
    .map((v: { datetime: string; open: string; high: string; low: string; close: string }) => ({
      datetime: v.datetime,
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
    }))
    .reverse(); // oldest first
}

function buildWeekendData(bars: DailyBar[]): WeekendData[] {
  // Index bars by date for quick lookup
  const byDate = new Map<string, DailyBar>();
  for (const bar of bars) {
    byDate.set(bar.datetime, bar);
  }

  const weekends: WeekendData[] = [];

  for (const bar of bars) {
    const dow = getDayOfWeek(bar.datetime);
    if (dow !== 5) continue; // Only process Fridays

    const friday = bar;
    const fridayDate = new Date(friday.datetime + 'T00:00:00');

    // Find Saturday (day+1), Sunday (day+2), Monday (day+3)
    const satDate = new Date(fridayDate);
    satDate.setDate(satDate.getDate() + 1);
    const sunDate = new Date(fridayDate);
    sunDate.setDate(sunDate.getDate() + 2);
    const monDate = new Date(fridayDate);
    monDate.setDate(monDate.getDate() + 3);

    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const saturday = byDate.get(fmt(satDate));
    const sunday = byDate.get(fmt(sunDate));
    const monday = byDate.get(fmt(monDate));

    if (!monday) continue; // Need at least Monday data

    const satLow = saturday ? saturday.low : null;
    const sunClose = sunday ? sunday.close : null;
    const sunLow = sunday ? sunday.low : null;

    // Fri→Sun drift: % change from Friday close to Sunday close
    const friToSunDrift = sunClose !== null
      ? ((sunClose - friday.close) / friday.close) * 100
      : null;

    // Weekend drawdown: worst low during Sat/Sun relative to Friday close
    const lows: number[] = [];
    if (satLow !== null) lows.push(satLow);
    if (sunLow !== null) lows.push(sunLow);
    const weekendMin = lows.length > 0 ? Math.min(...lows) : monday.open;
    const weekendDrawdown = ((weekendMin - friday.close) / friday.close) * 100;

    // Monday recovery positive: Monday close > Friday close
    const mondayRecoveryPositive = monday.close > friday.close;

    weekends.push({
      fridayDate: friday.datetime,
      fridayClose: friday.close,
      saturdayLow: satLow,
      sundayClose: sunClose,
      sundayLow: sunLow,
      mondayOpen: monday.open,
      mondayClose: monday.close,
      monBelowFri: monday.open < friday.close,
      friToSunDrift,
      weekendDrawdown,
      mondayRecoveryPositive,
    });
  }

  return weekends;
}

function computeMetrics(weekends: WeekendData[]): WeekendMetrics {
  if (weekends.length === 0) {
    return {
      totalWeekends: 0,
      monBelowFriPct: 0,
      avgFriSunDrift: 0,
      avgWeekendDrawdown: 0,
      worstWeekendDrawdown: 0,
      mondayRecoveryPositivePct: 0,
    };
  }

  const monBelowCount = weekends.filter((w) => w.monBelowFri).length;

  const drifts = weekends.filter((w) => w.friToSunDrift !== null).map((w) => w.friToSunDrift!);
  const avgDrift = drifts.length > 0 ? drifts.reduce((a, b) => a + b, 0) / drifts.length : 0;

  const drawdowns = weekends.map((w) => w.weekendDrawdown);
  const avgDrawdown = drawdowns.reduce((a, b) => a + b, 0) / drawdowns.length;
  const worstDrawdown = Math.min(...drawdowns);

  const recoveryCount = weekends.filter((w) => w.mondayRecoveryPositive).length;

  return {
    totalWeekends: weekends.length,
    monBelowFriPct: (monBelowCount / weekends.length) * 100,
    avgFriSunDrift: avgDrift,
    avgWeekendDrawdown: avgDrawdown,
    worstWeekendDrawdown: worstDrawdown,
    mondayRecoveryPositivePct: (recoveryCount / weekends.length) * 100,
  };
}

export interface WeekendMomentumResult {
  allHistory: {
    metrics: WeekendMetrics;
    weekends: WeekendData[];
  };
  gbtcEra: {
    metrics: WeekendMetrics;
    weekends: WeekendData[];
    startDate: string;
  };
}

export async function fetchWeekendMomentumData(): Promise<WeekendMomentumResult> {
  // Fetch BTC/USD daily data (max history) and GBTC data to find its start date
  const [btcBars, gbtcBars] = await Promise.all([
    fetchDailyBars('BTC/USD', 5000),
    fetchDailyBars('GBTC', 5000),
  ]);

  const allWeekends = buildWeekendData(btcBars);
  const allMetrics = computeMetrics(allWeekends);

  // GBTC-era: filter weekends to only those on/after GBTC's earliest data point
  const gbtcStartDate = gbtcBars.length > 0 ? gbtcBars[0].datetime : '';
  const gbtcWeekends = gbtcStartDate
    ? allWeekends.filter((w) => w.fridayDate >= gbtcStartDate)
    : [];
  const gbtcMetrics = computeMetrics(gbtcWeekends);

  return {
    allHistory: { metrics: allMetrics, weekends: allWeekends },
    gbtcEra: { metrics: gbtcMetrics, weekends: gbtcWeekends, startDate: gbtcStartDate },
  };
}
