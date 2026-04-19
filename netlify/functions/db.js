import { getDb } from '../../src/db/client.ts';
import { sql } from 'drizzle-orm';

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const db = getDb();
    const { query, params = [] } = JSON.parse(event.body);

    // Execute raw SQL via Drizzle
    const result = db.run(sql.raw(query));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        rows: result.changes !== undefined ? [] : [],
        rowCount: result.changes || 0,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
