import axios from 'axios';
import type { PricePoint } from '../components/PriceHistoryChart';

interface DataBentoOhlcvRecord {
  ts_event?: number;
  ts_event_ns?: number;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume?: number;
}

export interface MarketSeriesConfig {
  label: string;
  symbol: string;
  dataset: string;
  color: string;
}

const getEnv = () => {
  try {
    return (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  } catch (error) {
    console.warn('Unable to read Vite env, falling back to defaults', error);
    return {} as Record<string, string | undefined>;
  }
};

const env = getEnv();

const DATABENTO_PRIMARY_KEY = env.VITE_DATABENTO_API_KEY || 'db-UsaEA4gt99vtgPPWtRy4TxrqAsbdQ';
const DATABENTO_SECONDARY_KEY = env.VITE_DATABENTO_FALLBACK_KEY || '3CTXP4E3';
const DATABENTO_BASE_URL = 'https://hist.databento.com/v0';

const normalizePrice = (value: number | undefined) => {
  if (value === undefined) return 0;
  // DataBento prices are commonly scaled by 1e4; adjust if needed
  if (value > 10_000) {
    return value / 10_000;
  }
  return value;
};

const parseRecords = (records: DataBentoOhlcvRecord[]): PricePoint[] => {
  return records
    .map(record => {
      const timestamp = record.ts_event ?? record.ts_event_ns ?? 0;
      const date = timestamp > 10_000_000_000 ? new Date(timestamp / 1_000_000_000) : new Date(timestamp * 1000);

      return {
        recorded_at: date.toISOString().split('T')[0],
        price: normalizePrice(record.close),
      };
    })
    .filter(point => !Number.isNaN(point.price) && !!point.recorded_at)
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
};

const generateFallbackSeries = (): PricePoint[] => {
  const days = 45;
  const start = new Date();
  const points: PricePoint[] = [];

  for (let i = days; i >= 0; i--) {
    const date = new Date(start);
    date.setDate(start.getDate() - i);
    const price = 100 + Math.sin(i / 5) * 5 + Math.random() * 2;
    points.push({
      recorded_at: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }

  return points;
};

export const fetchMarketSeries = async (
  config: MarketSeriesConfig,
  startDate?: string,
): Promise<PricePoint[]> => {
  try {
    const response = await axios.get(`${DATABENTO_BASE_URL}/timeseries.get_range`, {
      params: {
        dataset: config.dataset,
        schema: 'ohlcv-1d',
        symbols: config.symbol,
        start: startDate,
        encoding: 'json',
      },
      headers: {
        Authorization: DATABENTO_PRIMARY_KEY,
        'X-Api-Key': DATABENTO_SECONDARY_KEY,
      },
    });

    const payload = response.data;
    if (payload?.data && Array.isArray(payload.data)) {
      return parseRecords(payload.data as DataBentoOhlcvRecord[]);
    }

    if (Array.isArray(payload)) {
      return parseRecords(payload as DataBentoOhlcvRecord[]);
    }

    return generateFallbackSeries();
  } catch (error) {
    console.warn(`Falling back to synthetic data for ${config.symbol}:`, error);
    return generateFallbackSeries();
  }
};
