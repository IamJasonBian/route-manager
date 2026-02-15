// Order Book Snapshot Netlify Function
// Reads the latest order-book blob from the 5thstreetcapital site
// Data is written every ~5 minutes by an external trading system

// 5thstreetcapital Netlify site ID
const ORDER_BOOK_SITE_ID = '3d014fc3-e919-4b4d-b374-e8606dee50df';
const BLOBS_API_BASE = 'https://api.netlify.com/api/v1/blobs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

async function fetchLatestSnapshot() {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  if (!token) {
    throw new Error('NETLIFY_AUTH_TOKEN not configured');
  }

  // List all blobs in the order-book store
  const listRes = await fetch(
    `${BLOBS_API_BASE}/${ORDER_BOOK_SITE_ID}/order-book`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  if (!listRes.ok) {
    throw new Error(`Failed to list order-book blobs: ${listRes.status}`);
  }

  const { blobs } = await listRes.json();
  if (!blobs || blobs.length === 0) {
    throw new Error('No order-book snapshots found');
  }

  // Keys are timestamps (e.g. "2026-02-15T02-07-07"), sort to get latest
  const latestKey = blobs.map(b => b.key).sort().pop();

  // Fetch the latest blob content
  const getRes = await fetch(
    `${BLOBS_API_BASE}/${ORDER_BOOK_SITE_ID}/order-book/${encodeURIComponent(latestKey)}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  if (!getRes.ok) {
    throw new Error(`Failed to fetch snapshot ${latestKey}: ${getRes.status}`);
  }

  return getRes.json();
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const data = await fetchLatestSnapshot();

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Order book snapshot error:', error);

    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Failed to fetch snapshot' }),
    };
  }
};
