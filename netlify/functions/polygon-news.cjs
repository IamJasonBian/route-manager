// Polygon.io News Netlify Function
// Proxies market news requests to Polygon.io API

const { storeNewsArticles } = require('./lib/newsStore.cjs');

const POLYGON_API = 'https://api.polygon.io/v2/reference/news';
const API_KEY = process.env.POLYGON_API_KEY;

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
      body: JSON.stringify({ error: 'POLYGON_API_KEY not configured' }),
    };
  }

  try {
    const params = event.queryStringParameters || {};
    const ticker = params.ticker || '';
    const limit = params.limit || '10';

    const url = new URL(POLYGON_API);
    if (ticker) url.searchParams.set('ticker', ticker);
    url.searchParams.set('limit', limit);
    url.searchParams.set('order', 'desc');
    url.searchParams.set('sort', 'published_utc');
    url.searchParams.set('apiKey', API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorCode = `${response.status} ${response.statusText}`;
      console.error(`Polygon.io returned ${errorCode}`);
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: errorCode, results: [] }),
      };
    }

    const data = await response.json();

    const articles = (data.results || []).map((article) => ({
      id: article.id,
      title: article.title,
      author: article.author,
      published_utc: article.published_utc,
      article_url: article.article_url,
      image_url: article.image_url,
      description: article.description,
      tickers: article.tickers || [],
      publisher: article.publisher ? {
        name: article.publisher.name,
        logo_url: article.publisher.logo_url,
        favicon_url: article.publisher.favicon_url,
      } : null,
    }));

    // Store articles to blob storage (fire-and-forget, don't block response)
    storeNewsArticles('polygon', ticker || null, articles).catch(() => {});

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ results: articles, count: articles.length }),
    };
  } catch (error) {
    console.error('Polygon.io news API error:', error);
    return {
      statusCode: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: '502 Bad Gateway', results: [] }),
    };
  }
};
