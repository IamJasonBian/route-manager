// CoinDesk News Netlify Function
// Proxies BTC news requests to CoinDesk data API

const COINDESK_API = 'https://data-api.coindesk.com/news/v1/article/list';
const BLOB_STORE = 'news-articles';
const API_KEY = process.env.COINDESK_API_KEY;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'COINDESK_API_KEY not configured' }),
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const limit = params.limit || '10';

    const url = new URL(COINDESK_API);
    url.searchParams.set('lang', 'EN');
    url.searchParams.set('limit', limit);
    url.searchParams.set('categories', 'BTC');
    url.searchParams.set('api_key', API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorCode = `${response.status} ${response.statusText}`;
      console.error(`CoinDesk returned ${errorCode}`);
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorCode, results: [] }),
      };
    }

    const data = await response.json();
    const items = data.Data || data.data || data.results || [];

    const articles = items.map((article) => ({
      id: String(article.ID || article.id || ''),
      title: article.TITLE || article.title || '',
      author: article.AUTHOR || article.author || '',
      published_utc: article.PUBLISHED_ON
        ? new Date(article.PUBLISHED_ON * 1000).toISOString()
        : article.published_on || article.published_utc || '',
      article_url: article.URL || article.url || '',
      image_url: article.IMAGE_URL || article.image_url || null,
      description: article.SUBTITLE || article.subtitle || article.BODY?.slice(0, 200) || '',
      tickers: ['BTC'],
      publisher: {
        name: article.SOURCE_DATA?.NAME || article.source_info?.name || 'CoinDesk',
        logo_url: null,
        favicon_url: null,
      },
    }));

    // Store articles to blob storage (fire-and-forget, don't block response)
    (async () => {
      try {
        const { getStore } = await import('@netlify/blobs');
        const store = getStore({
          name: BLOB_STORE,
          siteID: process.env.NETLIFY_SITE_ID,
          token: process.env.NETLIFY_AUTH_TOKEN,
        });
        const indexKey = 'index:coindesk:btc';

        const existingIndex = await store.get(indexKey, { type: 'json' }) || { articleIds: [] };
        const existingIds = new Set(existingIndex.articleIds);

        for (const article of articles) {
          if (!article.id) continue;
          await store.setJSON(`article:coindesk:${article.id}`, {
            ...article,
            _source: 'coindesk',
            _storedAt: new Date().toISOString(),
          });
          existingIds.add(article.id);
        }

        const allIds = Array.from(existingIds).slice(-200);
        await store.setJSON(indexKey, {
          articleIds: allIds,
          lastUpdated: new Date().toISOString(),
          source: 'coindesk',
          ticker: 'btc',
        });

        console.log(`[COINDESK] Stored ${articles.length} articles to blobs`);
      } catch (err) {
        console.error('[COINDESK] Blob storage error:', err.message);
      }
    })();

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ results: articles, count: articles.length }),
    };
  } catch (error) {
    console.error('CoinDesk news API error:', error);
    return {
      statusCode: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '502 Bad Gateway', results: [] }),
    };
  }
};
