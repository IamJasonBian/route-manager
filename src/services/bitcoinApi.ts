export interface SpotPrice {
  amount: string;
  currency: string;
}

export interface HistoricPricePoint {
  price: number;
  recorded_at: string;
}

type HistoricPeriod = 'day' | 'week' | 'month' | 'year';

const API_BASE_URL = 'https://api.coinbase.com/v2';

const buildHeaders = () => {
  const headers: HeadersInit = {
    Accept: 'application/json'
  };

  const token = import.meta.env.VITE_BITCOIN_DATA_TOKEN as string | undefined;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: buildHeaders()
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

interface SpotPriceResponse {
  data: {
    amount: string;
    currency: string;
  };
}

interface HistoricPriceResponse {
  data: {
    prices: Array<{ price: string; time: string }>;
  };
}

export const getSpotPrice = async (currency: string): Promise<SpotPrice> => {
  const response = await fetchJson<SpotPriceResponse>(`/prices/BTC-${currency}/spot`);
  return response.data;
};

export const getHistoricPrices = async (period: HistoricPeriod): Promise<HistoricPricePoint[]> => {
  const response = await fetchJson<HistoricPriceResponse>(`/prices/BTC-USD/historic?period=${period}`);

  return response.data.prices
    .map((point) => ({
      price: Number(point.price),
      recorded_at: point.time
    }))
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
};
