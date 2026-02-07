// Twelve Data API Service
// Documentation: https://twelvedata.com/docs

const TWELVE_DATA_API = 'https://api.twelvedata.com';

export interface TimeSeriesData {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface TimeSeriesResponse {
  meta: {
    symbol: string;
    interval: string;
    currency: string;
    exchange: string;
    type: string;
  };
  values: TimeSeriesData[];
  status?: string;
  message?: string;
}

export interface NormalizedPriceData {
  date: string;
  timestamp: number;
  price: number;
}

export interface PortfolioAsset {
  symbol: string;
  displayName: string;
  color: string;
  data: NormalizedPriceData[];
}

const getApiKey = (): string => {
  const key = import.meta.env.VITE_TWELVE_DATA_API_KEY;
  if (!key) {
    throw new Error('VITE_TWELVE_DATA_API_KEY environment variable is not set');
  }
  return key;
};

// Map time ranges to output sizes and intervals
const RANGE_CONFIG: Record<string, { outputsize: number; interval: string }> = {
  '1W': { outputsize: 7, interval: '1day' },
  '1M': { outputsize: 22, interval: '1day' },
  '3M': { outputsize: 66, interval: '1day' },
  '6M': { outputsize: 130, interval: '1day' },
  '1Y': { outputsize: 252, interval: '1day' },
  '5Y': { outputsize: 260, interval: '1week' },
};

export async function getTimeSeries(
  symbol: string,
  range: string = '1Y'
): Promise<NormalizedPriceData[]> {
  const config = RANGE_CONFIG[range] || RANGE_CONFIG['1Y'];
  const apiKey = getApiKey();

  const url = new URL(`${TWELVE_DATA_API}/time_series`);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('interval', config.interval);
  url.searchParams.set('outputsize', config.outputsize.toString());
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch ${symbol}: ${response.status}`);
  }

  const data: TimeSeriesResponse = await response.json();

  if (data.status === 'error') {
    throw new Error(data.message || `API error for ${symbol}`);
  }

  // Normalize and reverse to chronological order (oldest first)
  return data.values
    .map((item) => ({
      date: item.datetime,
      timestamp: new Date(item.datetime).getTime(),
      price: parseFloat(item.close),
    }))
    .reverse();
}

// Portfolio assets configuration
export const PORTFOLIO_ASSETS = [
  { symbol: 'BTC/USD', displayName: 'Bitcoin', color: '#F7931A' },
  { symbol: 'MSTR', displayName: 'MicroStrategy', color: '#D9232E' },
  { symbol: 'GBTC', displayName: 'Grayscale BTC Trust', color: '#6B21A8' },
  { symbol: 'BTC', displayName: 'Grayscale BTC Mini ETF', color: '#9333EA' },
  { symbol: 'QQQ', displayName: 'QQQ (Nasdaq)', color: '#8B5CF6' },
  { symbol: 'SPY', displayName: 'S&P 500', color: '#3B82F6' },
  { symbol: 'AAPL', displayName: 'Apple', color: '#A2AAAD' },
  { symbol: 'MSFT', displayName: 'Microsoft', color: '#00A4EF' },
  { symbol: 'AMZN', displayName: 'Amazon', color: '#FF9900' },
  { symbol: 'GOOGL', displayName: 'Alphabet', color: '#4285F4' },
  { symbol: 'META', displayName: 'Meta', color: '#0668E1' },
  { symbol: 'NVDA', displayName: 'Nvidia', color: '#76B900' },
  { symbol: 'TSLA', displayName: 'Tesla', color: '#E31937' },
  { symbol: 'GLD', displayName: 'Gold (GLD)', color: '#FFD700' },
];

export async function getPortfolioData(
  range: string = '1Y'
): Promise<PortfolioAsset[]> {
  const results = await Promise.all(
    PORTFOLIO_ASSETS.map(async (asset) => {
      const data = await getTimeSeries(asset.symbol, range);
      return {
        ...asset,
        data,
      };
    })
  );

  return results;
}

// --- CoinGecko supplemental data (market cap + volume) via Netlify proxy ---

export interface CoinGeckoMarketData {
  market_cap: number | null;
  total_volume: number | null;
  error?: string;
}

export async function getCoinGeckoMarketData(): Promise<CoinGeckoMarketData> {
  try {
    const response = await fetch('/.netlify/functions/coingecko-market');

    const data = await response.json();

    if (!response.ok) {
      return {
        market_cap: null,
        total_volume: null,
        error: data.error || `${response.status} ${response.statusText}`,
      };
    }

    return {
      market_cap: data.market_cap ?? null,
      total_volume: data.total_volume ?? null,
    };
  } catch {
    return { market_cap: null, total_volume: null, error: '503 Service Unavailable' };
  }
}

// --- Bitcoin Dashboard functions ---

export interface BitcoinQuote {
  symbol: string;
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previous_close: number;
  change: number;
  percent_change: number;
  datetime: string;
}

export async function getBitcoinQuote(): Promise<BitcoinQuote> {
  const apiKey = getApiKey();
  const url = new URL(`${TWELVE_DATA_API}/quote`);
  url.searchParams.set('symbol', 'BTC/USD');
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch BTC quote: ${response.status}`);
  }

  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'API error fetching BTC quote');
  }

  return {
    symbol: data.symbol,
    name: data.name || 'Bitcoin',
    open: parseFloat(data.open),
    high: parseFloat(data.high),
    low: parseFloat(data.low),
    close: parseFloat(data.close),
    volume: parseFloat(data.volume || '0'),
    previous_close: parseFloat(data.previous_close),
    change: parseFloat(data.change),
    percent_change: parseFloat(data.percent_change),
    datetime: data.datetime,
  };
}

// --- Grayscale BTC Mini Trust ETF projection ---

export interface EtfQuote {
  symbol: string;
  name: string;
  close: number;
  previous_close: number;
  change: number;
  percent_change: number;
  datetime: string;
}

export interface GrayscaleProjection {
  etfLastClose: number;
  etfDatetime: string;
  btcAtEtfClose: number;
  btcCurrent: number;
  btcChangePercent: number;
  projectedEtfPrice: number;
  projectedChange: number;
  projectedChangePercent: number;
  marketOpen: boolean;
}

export async function getEtfQuote(symbol: string): Promise<EtfQuote> {
  const apiKey = getApiKey();
  const url = new URL(`${TWELVE_DATA_API}/quote`);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch ${symbol} quote: ${response.status}`);
  }

  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || `API error fetching ${symbol} quote`);
  }

  return {
    symbol: data.symbol,
    name: data.name || symbol,
    close: parseFloat(data.close),
    previous_close: parseFloat(data.previous_close),
    change: parseFloat(data.change),
    percent_change: parseFloat(data.percent_change),
    datetime: data.datetime,
  };
}

function isUsMarketOpen(): boolean {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const day = et.getDay();
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const timeInMinutes = hours * 60 + minutes;
  // Market open: Mon-Fri, 9:30 AM - 4:00 PM ET
  return day >= 1 && day <= 5 && timeInMinutes >= 570 && timeInMinutes < 960;
}

export async function getGrayscaleProjection(): Promise<GrayscaleProjection> {
  const [etfQuote, btcQuote] = await Promise.all([
    getEtfQuote('BTC'),
    getBitcoinQuote(),
  ]);

  const marketOpen = isUsMarketOpen();

  // Derive the ETF-to-BTC ratio from previous close values.
  // ratio = etfPrevClose / btcPrevClose (stable BTC-per-share factor).
  // Project: projectedEtf = ratio * btcCurrentPrice
  const ratio = etfQuote.previous_close / btcQuote.previous_close;
  const projectedEtfPrice = ratio * btcQuote.close;
  const projectedChange = projectedEtfPrice - etfQuote.close;
  const projectedChangePercent = (projectedChange / etfQuote.close) * 100;
  const btcChangePercent = ((btcQuote.close - btcQuote.previous_close) / btcQuote.previous_close) * 100;

  return {
    etfLastClose: etfQuote.close,
    etfDatetime: etfQuote.datetime,
    btcAtEtfClose: btcQuote.previous_close,
    btcCurrent: btcQuote.close,
    btcChangePercent,
    projectedEtfPrice,
    projectedChange,
    projectedChangePercent,
    marketOpen,
  };
}

// Map days-based ranges to TwelveData config (including intraday for short ranges)
const BTC_RANGE_CONFIG: Record<number, { outputsize: number; interval: string }> = {
  1: { outputsize: 96, interval: '15min' },
  7: { outputsize: 168, interval: '1h' },
  30: { outputsize: 30, interval: '1day' },
  90: { outputsize: 90, interval: '1day' },
  365: { outputsize: 252, interval: '1day' },
};

export async function getBitcoinPriceHistory(
  days: number = 30
): Promise<NormalizedPriceData[]> {
  const config = BTC_RANGE_CONFIG[days] || BTC_RANGE_CONFIG[30];
  const apiKey = getApiKey();

  const url = new URL(`${TWELVE_DATA_API}/time_series`);
  url.searchParams.set('symbol', 'BTC/USD');
  url.searchParams.set('interval', config.interval);
  url.searchParams.set('outputsize', config.outputsize.toString());
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch BTC price history: ${response.status}`);
  }

  const data: TimeSeriesResponse = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'API error fetching BTC history');
  }

  return data.values
    .map((item) => ({
      date: item.datetime,
      timestamp: new Date(item.datetime).getTime(),
      price: parseFloat(item.close),
    }))
    .reverse();
}
