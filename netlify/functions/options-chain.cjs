// Options Chain & Expiration — Twelve Data API proxy
// Supports: expiration dates, live chain, and historical snapshot storage

const TWELVE_DATA_API = 'https://api.twelvedata.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

// ── In-memory cache ──────────────────────────────────────────────────────
const cache = new Map();
const CACHE_TTL_MS = 60_000; // 1 minute for live options data
const MAX_CACHE_ENTRIES = 50;

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp < CACHE_TTL_MS) return entry;
  return null; // expired but keep for stale fallback
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  if (cache.size > MAX_CACHE_ENTRIES) {
    const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
    cache.delete(oldest[0]);
  }
}

function getStale(key) {
  const entry = cache.get(key);
  return entry ? entry : null;
}

// ── Blob storage helpers (for historical snapshots) ──────────────────────

let blobStore = null;

async function getBlobStore() {
  if (blobStore) return blobStore;
  try {
    const { getStore } = await import('@netlify/blobs');
    blobStore = getStore('options-snapshots');
    return blobStore;
  } catch {
    return null;
  }
}

async function saveSnapshot(symbol, expirationDate, chain) {
  const store = await getBlobStore();
  if (!store) return;
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10);
  const key = `${symbol}/${expirationDate}/${dateKey}`;
  try {
    await store.setJSON(key, {
      symbol,
      expiration_date: expirationDate,
      snapshot_date: dateKey,
      snapshot_timestamp: now.toISOString(),
      ...chain,
    });
  } catch (err) {
    console.error('Failed to save options snapshot:', err.message);
  }
}

async function loadSnapshots(symbol, expirationDate, days) {
  const store = await getBlobStore();
  if (!store) return [];

  const snapshots = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const key = `${symbol}/${expirationDate}/${dateKey}`;
    try {
      const data = await store.get(key, { type: 'json' });
      if (data) snapshots.push(data);
    } catch {
      // snapshot not available for this date
    }
  }

  return snapshots.reverse(); // chronological order
}

// ── API Fetchers ─────────────────────────────────────────────────────────

async function fetchExpirations(apiKey, symbol) {
  const url = new URL(`${TWELVE_DATA_API}/options/expiration`);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('apikey', apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Twelve Data options/expiration: ${response.status}`);
  }

  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'API error fetching options expirations');
  }

  return data;
}

async function fetchChain(apiKey, symbol, params) {
  const url = new URL(`${TWELVE_DATA_API}/options/chain`);
  url.searchParams.set('symbol', symbol);
  url.searchParams.set('apikey', apiKey);

  if (params.expiration_date) url.searchParams.set('expiration_date', params.expiration_date);
  if (params.side) url.searchParams.set('side', params.side);
  if (params.option_id) url.searchParams.set('option_id', params.option_id);
  if (params.dp) url.searchParams.set('dp', params.dp);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Twelve Data options/chain: ${response.status}`);
  }

  const data = await response.json();
  if (data.status === 'error') {
    throw new Error(data.message || 'API error fetching options chain');
  }

  return data;
}

// ── Handler ──────────────────────────────────────────────────────────────

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  const qs = event.queryStringParameters || {};
  const action = qs.action || 'chain';
  const symbol = qs.symbol;
  const apiKey = process.env.TWELVE_DATA_API_KEY || process.env.VITE_TWELVE_DATA_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'TWELVE_DATA_API_KEY not configured' }),
    };
  }

  if (!symbol) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'symbol parameter is required' }),
    };
  }

  try {
    // ── Action: expiration ──────────────────────────────────────────────
    if (action === 'expiration') {
      const cacheKey = `exp|${symbol}`;
      const cached = getCached(cacheKey);
      if (cached) {
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
          body: JSON.stringify(cached.data),
        };
      }

      const data = await fetchExpirations(apiKey, symbol);
      setCache(cacheKey, data);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
        body: JSON.stringify(data),
      };
    }

    // ── Action: chain (live) ────────────────────────────────────────────
    if (action === 'chain') {
      const expirationDate = qs.expiration_date;
      const side = qs.side;
      const cacheKey = `chain|${symbol}|${expirationDate || 'all'}|${side || 'both'}`;

      const cached = getCached(cacheKey);
      if (cached) {
        return {
          statusCode: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
          body: JSON.stringify(cached.data),
        };
      }

      const data = await fetchChain(apiKey, symbol, {
        expiration_date: expirationDate,
        side,
        option_id: qs.option_id,
        dp: qs.dp || '4',
      });

      setCache(cacheKey, data);

      // Fire-and-forget: persist snapshot for historical tracking
      if (expirationDate) {
        saveSnapshot(symbol, expirationDate, data).catch(() => {});
      }

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
        body: JSON.stringify(data),
      };
    }

    // ── Action: history (stored snapshots) ──────────────────────────────
    if (action === 'history') {
      const expirationDate = qs.expiration_date;
      if (!expirationDate) {
        return {
          statusCode: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'expiration_date is required for history action' }),
        };
      }

      const days = parseInt(qs.days || '30', 10);
      const snapshots = await loadSnapshots(symbol, expirationDate, days);

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, expiration_date: expirationDate, days, snapshots }),
      };
    }

    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Unknown action: ${action}. Use expiration, chain, or history.` }),
    };
  } catch (error) {
    console.error('Options chain error:', error);

    // Stale cache fallback
    const fallbackKey = action === 'expiration'
      ? `exp|${symbol}`
      : `chain|${symbol}|${qs.expiration_date || 'all'}|${qs.side || 'both'}`;
    const stale = getStale(fallbackKey);
    if (stale) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'STALE' },
        body: JSON.stringify(stale.data),
      };
    }

    return {
      statusCode: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || '502 Bad Gateway' }),
    };
  }
};
