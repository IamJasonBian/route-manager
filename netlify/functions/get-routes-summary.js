import { getDb } from '../../src/db/client.ts';
import { routes, priceHistory } from '../../src/db/schema.ts';
import { eq } from 'drizzle-orm';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const db = getDb();
    const allRoutes = await db.select().from(routes);

    const routesWithPrices = await Promise.all(
      allRoutes.map(async (route) => {
        const prices = await db
          .select()
          .from(priceHistory)
          .where(eq(priceHistory.routeId, route.id))
          .orderBy(priceHistory.recordedAt);

        return {
          route_id: route.id,
          origin: route.origin,
          destination: route.destination,
          prices: prices.map((p) => ({
            price: p.price,
            recorded_at: p.recordedAt,
          })),
        };
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: JSON.stringify({
        routes: routesWithPrices.filter((r) => r.prices.length > 0),
      }),
    };
  } catch (error) {
    console.error('Database query error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Failed to fetch route data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
    };
  }
};
