// Debug function to inspect Netlify Blob Storage for news articles
// Usage:
//   GET /.netlify/functions/debug-blobs?action=list
//   GET /.netlify/functions/debug-blobs?action=get&key=index:coindesk
//   GET /.netlify/functions/debug-blobs?action=get&key=article:coindesk:<id>

const STORE_NAME = 'news-articles';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore(STORE_NAME);

    const params = event.queryStringParameters || {};
    const action = params.action || 'list';

    if (action === 'list') {
      const prefix = params.prefix || '';
      const { blobs } = await store.list({ prefix });
      const keys = blobs.map((b) => b.key);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ store: STORE_NAME, count: keys.length, keys }),
      };
    }

    if (action === 'get') {
      const key = params.key;
      if (!key) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Missing "key" query parameter' }),
        };
      }

      const value = await store.get(key, { type: 'json' });
      if (value === null) {
        return {
          statusCode: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Key not found', key }),
        };
      }

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      };
    }

    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unknown action. Use "list" or "get".' }),
    };
  } catch (error) {
    console.error('[DEBUG_BLOBS] Error:', error.message);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
