// Unified Asset Service for Bitcoin and S&P 500
// Bitcoin: CoinGecko API (free, no key)
// S&P 500: Alpha Vantage API (free key required)

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const ALPHA_VANTAGE_API = 'https://www.alphavantage.co/query';

export interface PricePoint {
  timestamp: number;
  price: number;
  date: string;
}

export interface AssetData {
  id: string;
  symbol: string;
  name: string;
  type: 'crypto' | 'index';
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  priceChangePercent7d: number | null;
  priceChangePercent30d: number | null;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number | null;
  volatility30d: number | null;  // 30-day annualized volatility
  sparkline7d: number[] | null;
  lastUpdated: string;
}

// Calculate annualized volatility from price data
export function calculateVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;

  // Calculate daily returns
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const dailyReturn = (prices[i] - prices[i - 1]) / prices[i - 1];
    returns.push(dailyReturn);
  }

  // Calculate standard deviation of returns
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(variance);

  // Annualize (assuming 365 days for crypto, using sqrt of trading days)
  const annualizedVolatility = stdDev * Math.sqrt(365) * 100;

  return annualizedVolatility;
}

// Get Bitcoin data with volatility
export async function getBitcoinData(): Promise<AssetData> {
  const [marketResponse, historyResponse] = await Promise.all([
    fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin&sparkline=true&price_change_percentage=24h,7d,30d`),
    fetch(`${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=30`),
  ]);

  if (!marketResponse.ok || !historyResponse.ok) {
    throw new Error('Failed to fetch Bitcoin data');
  }

  const [marketData] = await marketResponse.json();
  const historyData = await historyResponse.json();

  // Extract daily prices for volatility calculation
  const dailyPrices = historyData.prices.map(([, price]: [number, number]) => price);
  const volatility = calculateVolatility(dailyPrices);

  return {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    currentPrice: marketData.current_price,
    priceChange24h: marketData.price_change_24h,
    priceChangePercent24h: marketData.price_change_percentage_24h,
    priceChangePercent7d: marketData.price_change_percentage_7d_in_currency,
    priceChangePercent30d: marketData.price_change_percentage_30d_in_currency,
    high24h: marketData.high_24h,
    low24h: marketData.low_24h,
    volume24h: marketData.total_volume,
    marketCap: marketData.market_cap,
    volatility30d: volatility,
    sparkline7d: marketData.sparkline_in_7d?.price || null,
    lastUpdated: marketData.last_updated,
  };
}

// Get Bitcoin price history
export async function getBitcoinHistory(days: number = 30): Promise<PricePoint[]> {
  const response = await fetch(
    `${COINGECKO_API}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Bitcoin history');
  }

  const data = await response.json();
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toISOString(),
  }));
}

// Get S&P 500 data (requires Alpha Vantage API key)
export async function getSP500Data(apiKey: string): Promise<AssetData> {
  // Fetch daily data for S&P 500 ETF (SPY) as proxy
  const response = await fetch(
    `${ALPHA_VANTAGE_API}?function=TIME_SERIES_DAILY&symbol=SPY&outputsize=compact&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch S&P 500 data');
  }

  const data = await response.json();

  if (data['Error Message'] || data['Note']) {
    throw new Error(data['Error Message'] || 'API rate limit exceeded. Try again later.');
  }

  const timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) {
    throw new Error('Invalid API response');
  }

  const dates = Object.keys(timeSeries).sort().reverse();
  const today = dates[0];
  const yesterday = dates[1];
  const weekAgo = dates[5] || dates[dates.length - 1];
  const monthAgo = dates[21] || dates[dates.length - 1];

  const currentPrice = parseFloat(timeSeries[today]['4. close']);
  const yesterdayPrice = parseFloat(timeSeries[yesterday]['4. close']);
  const weekAgoPrice = parseFloat(timeSeries[weekAgo]['4. close']);
  const monthAgoPrice = parseFloat(timeSeries[monthAgo]['4. close']);

  const priceChange24h = currentPrice - yesterdayPrice;
  const priceChangePercent24h = (priceChange24h / yesterdayPrice) * 100;
  const priceChangePercent7d = ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100;
  const priceChangePercent30d = ((currentPrice - monthAgoPrice) / monthAgoPrice) * 100;

  // Calculate volatility from last 30 days
  const last30Days = dates.slice(0, 30);
  const prices = last30Days.map(d => parseFloat(timeSeries[d]['4. close'])).reverse();
  const volatility = calculateVolatility(prices);

  // Build 7-day sparkline
  const last7Days = dates.slice(0, 7);
  const sparkline = last7Days.map(d => parseFloat(timeSeries[d]['4. close'])).reverse();

  return {
    id: 'sp500',
    symbol: 'SPY',
    name: 'S&P 500',
    type: 'index',
    currentPrice,
    priceChange24h,
    priceChangePercent24h,
    priceChangePercent7d,
    priceChangePercent30d,
    high24h: parseFloat(timeSeries[today]['2. high']),
    low24h: parseFloat(timeSeries[today]['3. low']),
    volume24h: parseFloat(timeSeries[today]['5. volume']),
    marketCap: null, // Not applicable for index
    volatility30d: volatility,
    sparkline7d: sparkline,
    lastUpdated: new Date().toISOString(),
  };
}

// Get S&P 500 price history
export async function getSP500History(apiKey: string, days: number = 30): Promise<PricePoint[]> {
  const response = await fetch(
    `${ALPHA_VANTAGE_API}?function=TIME_SERIES_DAILY&symbol=SPY&outputsize=${days > 30 ? 'full' : 'compact'}&apikey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch S&P 500 history');
  }

  const data = await response.json();
  const timeSeries = data['Time Series (Daily)'];

  if (!timeSeries) {
    throw new Error('Invalid API response');
  }

  const dates = Object.keys(timeSeries).sort().reverse().slice(0, days);

  return dates.map(date => ({
    timestamp: new Date(date).getTime(),
    price: parseFloat(timeSeries[date]['4. close']),
    date: new Date(date).toISOString(),
  })).reverse();
}

// API Key management
const API_KEY_STORAGE = 'alpha_vantage_api_key';

export function getStoredApiKey(): string | null {
  return localStorage.getItem(API_KEY_STORAGE);
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function clearStoredApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE);
}

// Format helpers
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return formatCurrency(value);
}

export function formatPercentage(value: number | null): string {
  if (value === null) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatVolatility(value: number | null): string {
  if (value === null) return 'N/A';
  return `${value.toFixed(1)}%`;
}
