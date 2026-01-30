// News service - fetches market news via Netlify function proxies
// Polygon.io for general market news, CoinDesk for BTC-specific news

export interface NewsPublisher {
  name: string;
  logo_url: string | null;
  favicon_url: string | null;
}

export interface NewsArticle {
  id: string;
  title: string;
  author: string;
  published_utc: string;
  article_url: string;
  image_url: string | null;
  description: string;
  tickers: string[];
  publisher: NewsPublisher | null;
}

export interface NewsResponse {
  results: NewsArticle[];
  count: number;
  error?: string;
}

export async function getMarketNews(
  ticker?: string,
  limit = 10
): Promise<NewsResponse> {
  const params = new URLSearchParams();
  if (ticker) params.set('ticker', ticker);
  params.set('limit', String(limit));

  const response = await fetch(
    `/.netlify/functions/polygon-news?${params.toString()}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Failed to fetch news: ${response.status}`);
  }

  return response.json();
}

export async function getBtcNews(limit = 10): Promise<NewsResponse> {
  const params = new URLSearchParams();
  params.set('limit', String(limit));

  const response = await fetch(
    `/.netlify/functions/coindesk-news?${params.toString()}`
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Failed to fetch BTC news: ${response.status}`);
  }

  return response.json();
}
