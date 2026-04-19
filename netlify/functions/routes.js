import { getDb } from '../../src/db/client.ts';
import { routes, priceHistory } from '../../src/db/schema.pg.ts';
import { eq, and, desc, sql, count } from 'drizzle-orm';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const db = getDb();

  try {
    if (event.httpMethod === 'GET') {
      const params = event.queryStringParameters || {};

      if (params.action === 'summary') {
        // Get routes with price history
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
          headers,
          body: JSON.stringify({ routes: routesWithPrices.filter((r) => r.prices.length > 0) }),
        };
      }

      if (params.action === 'exists') {
        const result = await db.select({ total: count() }).from(routes);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ exists: result[0].total > 0 }),
        };
      }

      // List routes with optional filters
      const conditions = [];
      if (params.origin) conditions.push(eq(routes.origin, params.origin));
      if (params.destination) conditions.push(eq(routes.destination, params.destination));

      const result = conditions.length > 0
        ? await db.select().from(routes).where(and(...conditions)).orderBy(desc(routes.createdAt))
        : await db.select().from(routes).orderBy(desc(routes.createdAt));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ rows: result, rowCount: result.length }),
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);

      if (body.action === 'bulk') {
        // Bulk insert
        const saved = [];
        for (const route of body.routes) {
          const result = await db
            .insert(routes)
            .values({
              origin: route.origin,
              destination: route.destination,
              price: route.price,
              departureDate: route.departure_date,
              returnDate: route.return_date,
              airline: route.airline,
              flightNumber: route.flight_number,
            })
            .returning();
          saved.push(result[0]);
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ rows: saved, rowCount: saved.length }),
        };
      }

      // Upsert single route
      const existing = await db
        .select()
        .from(routes)
        .where(
          and(
            eq(routes.origin, body.origin),
            eq(routes.destination, body.destination),
            body.departure_date ? eq(routes.departureDate, body.departure_date) : sql`1=1`,
            body.flight_number ? eq(routes.flightNumber, body.flight_number) : sql`1=1`
          )
        );

      let result;
      if (existing.length > 0) {
        result = await db
          .update(routes)
          .set({
            price: body.price,
            returnDate: body.return_date,
            airline: body.airline,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(routes.id, existing[0].id))
          .returning();
      } else {
        result = await db
          .insert(routes)
          .values({
            origin: body.origin,
            destination: body.destination,
            price: body.price,
            departureDate: body.departure_date,
            returnDate: body.return_date,
            airline: body.airline,
            flightNumber: body.flight_number,
          })
          .returning();
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ rows: result, rowCount: result.length }),
      };
    }

    if (event.httpMethod === 'DELETE') {
      const params = event.queryStringParameters || {};
      if (!params.id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id parameter' }) };
      }
      await db.delete(routes).where(eq(routes.id, parseInt(params.id)));
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (error) {
    console.error('Routes function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
