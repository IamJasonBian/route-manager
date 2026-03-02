// Option Positions Netlify Function
// Returns current option positions from the latest order-book snapshot.
// The frontend uses this metadata to fetch underlying price history
// from Twelve Data (or similar) for charting.
//
// GET /.netlify/functions/option-price-history

const ORDER_BOOK_SITE_ID = '3d014fc3-e919-4b4d-b374-e8606dee50df';
const BLOBS_API_BASE = 'https://api.netlify.com/api/v1/blobs';

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
    const token = process.env.NETLIFY_AUTH_TOKEN;
    if (!token) {
      throw new Error('NETLIFY_AUTH_TOKEN not configured');
    }

    // List blobs and grab the latest snapshot
    const listRes = await fetch(
      `${BLOBS_API_BASE}/${ORDER_BOOK_SITE_ID}/order-book`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!listRes.ok) {
      throw new Error(`Failed to list blobs: ${listRes.status}`);
    }

    const { blobs } = await listRes.json();
    if (!blobs || blobs.length === 0) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ options: [] }),
      };
    }

    // Keys are timestamps — sort descending, pick latest
    const latestKey = blobs.map((b) => b.key).sort().reverse()[0];

    const blobRes = await fetch(
      `${BLOBS_API_BASE}/${ORDER_BOOK_SITE_ID}/order-book/${encodeURIComponent(latestKey)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!blobRes.ok) {
      throw new Error(`Failed to fetch snapshot ${latestKey}: ${blobRes.status}`);
    }

    const snapshot = await blobRes.json();
    const opts = snapshot?.portfolio?.options || [];

    // Return compact option position metadata
    const options = opts.map((o) => ({
      chain_symbol: o.chain_symbol,
      option_type: o.option_type,
      strike: o.strike,
      expiration: o.expiration,
      mark_price: o.mark_price,
      avg_price: o.avg_price,
      iv: o.greeks?.iv ?? null,
      quantity: o.quantity,
      position_type: o.position_type,
      underlying_price: o.underlying_price,
    }));

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ options }),
    };
  } catch (error) {
    console.error('Option positions error:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Failed to fetch option positions' }),
    };
  }
};
