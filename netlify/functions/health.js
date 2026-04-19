import { getDb } from '../../src/db/client.ts';
import { routes } from '../../src/db/schema.ts';
import { count } from 'drizzle-orm';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const db = getDb();
    const result = await db.select({ total: count() }).from(routes);

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'ok',
        database: 'connected',
        routeCount: result[0].total,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'error', error: error.message }),
    };
  }
};
