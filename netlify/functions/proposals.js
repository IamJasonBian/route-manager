import { getDb } from '../../src/db/client.ts';
import { proposals } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

      if (params.id) {
        const result = await db.select().from(proposals).where(eq(proposals.id, params.id));
        if (result.length === 0) {
          return { statusCode: 404, headers, body: JSON.stringify({ error: 'Proposal not found' }) };
        }
        return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
      }

      const result = await db.select().from(proposals).orderBy(desc(proposals.createdAt));
      return { statusCode: 200, headers, body: JSON.stringify(result) };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const result = await db
        .insert(proposals)
        .values({
          id,
          title: body.title,
          origin: body.origin,
          destination: body.destination,
          departureDate: body.departureDate,
          returnDate: body.returnDate,
          estimatedPrice: body.estimatedPrice,
          currency: body.currency || 'USD',
          rationale: body.rationale,
          status: body.status || 'draft',
          googleFlightsUrl: body.googleFlightsUrl,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      return { statusCode: 201, headers, body: JSON.stringify(result[0]) };
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body);
      if (!body.id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id' }) };
      }

      const updates = { updatedAt: new Date().toISOString() };
      if (body.title !== undefined) updates.title = body.title;
      if (body.origin !== undefined) updates.origin = body.origin;
      if (body.destination !== undefined) updates.destination = body.destination;
      if (body.departureDate !== undefined) updates.departureDate = body.departureDate;
      if (body.returnDate !== undefined) updates.returnDate = body.returnDate;
      if (body.estimatedPrice !== undefined) updates.estimatedPrice = body.estimatedPrice;
      if (body.rationale !== undefined) updates.rationale = body.rationale;
      if (body.status !== undefined) updates.status = body.status;
      if (body.googleFlightsUrl !== undefined) updates.googleFlightsUrl = body.googleFlightsUrl;

      const result = await db
        .update(proposals)
        .set(updates)
        .where(eq(proposals.id, body.id))
        .returning();

      if (result.length === 0) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Proposal not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(result[0]) };
    }

    if (event.httpMethod === 'DELETE') {
      const params = event.queryStringParameters || {};
      if (!params.id) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id parameter' }) };
      }
      await db.delete(proposals).where(eq(proposals.id, params.id));
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  } catch (error) {
    console.error('Proposals function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
