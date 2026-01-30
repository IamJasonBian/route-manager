// News Storage using Netlify Blobs (production) or file system (local dev)
// Stores news articles fetched from external APIs for persistence

const fs = require('fs');
const path = require('path');
const os = require('os');

const STORE_NAME = 'news-articles';
const LOCAL_NEWS_FILE = path.join(os.homedir(), '.tokens', 'news-blobs.json');

function isNetlifyProduction() {
  return !!(process.env.DEPLOY_ID && process.env.SITE_ID);
}

/**
 * Get the Netlify Blobs store for news.
 * Falls back to local file storage when not in Netlify environment.
 */
async function getStore() {
  if (!isNetlifyProduction()) {
    return {
      async get(key, options) {
        try {
          if (!fs.existsSync(LOCAL_NEWS_FILE)) return null;
          const data = JSON.parse(fs.readFileSync(LOCAL_NEWS_FILE, 'utf8'));
          const value = data[key];
          if (!value) return null;
          return options?.type === 'json' ? value : JSON.stringify(value);
        } catch (e) {
          console.error('[NEWS_STORE] Error reading:', e.message);
          return null;
        }
      },
      async setJSON(key, value) {
        try {
          const dir = path.dirname(LOCAL_NEWS_FILE);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          let data = {};
          if (fs.existsSync(LOCAL_NEWS_FILE)) {
            data = JSON.parse(fs.readFileSync(LOCAL_NEWS_FILE, 'utf8'));
          }
          data[key] = value;
          fs.writeFileSync(LOCAL_NEWS_FILE, JSON.stringify(data, null, 2));
        } catch (e) {
          console.error('[NEWS_STORE] Error writing:', e.message);
        }
      },
    };
  }

  const { getStore } = await import('@netlify/blobs');
  return getStore(STORE_NAME);
}

/**
 * Store news articles to blob storage.
 * Each article is stored individually by its ID, plus a source-specific index.
 *
 * @param {string} source - The news source identifier (e.g. 'coindesk', 'polygon')
 * @param {string|null} ticker - Optional ticker filter used in the request
 * @param {Array} articles - Array of normalized article objects
 */
async function storeNewsArticles(source, ticker, articles) {
  if (!articles || articles.length === 0) return;

  try {
    const store = await getStore();

    // Build an index key for this source+ticker combination
    const indexKey = ticker
      ? `index:${source}:${ticker.toLowerCase()}`
      : `index:${source}`;

    // Load existing index to merge with new articles
    const existingIndex = await store.get(indexKey, { type: 'json' }) || { articleIds: [] };
    const existingIds = new Set(existingIndex.articleIds);

    // Store each article individually keyed by source:id
    for (const article of articles) {
      if (!article.id) continue;
      const articleKey = `article:${source}:${article.id}`;
      await store.setJSON(articleKey, {
        ...article,
        _source: source,
        _storedAt: new Date().toISOString(),
      });
      existingIds.add(article.id);
    }

    // Update the index with merged article IDs (cap at 200 most recent)
    const allIds = Array.from(existingIds).slice(-200);
    await store.setJSON(indexKey, {
      articleIds: allIds,
      lastUpdated: new Date().toISOString(),
      source,
      ticker: ticker || null,
    });

    console.log(`[NEWS_STORE] Stored ${articles.length} articles from ${source}${ticker ? ` (${ticker})` : ''}`);
  } catch (error) {
    // Don't fail the request if storage fails — just log
    console.error('[NEWS_STORE] Error storing articles:', error.message);
  }
}

module.exports = { storeNewsArticles };
