import { Pool } from 'pg';
import { withCors } from './utils/cors.js';

const getRoutesSummaryHandler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Initialize database connection
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Get all routes with their price history
    const query = `
      WITH latest_prices AS (
        SELECT 
          route_id, 
          price,
          recorded_at,
          ROW_NUMBER() OVER (PARTITION BY route_id ORDER BY recorded_at DESC) as rn
        FROM price_history
      )
      SELECT 
        r.id as route_id,
        r.origin,
        r.destination,
        COALESCE(
          json_agg(
            json_build_object(
              'price', p.price,
              'recorded_at', p.recorded_at
            ) ORDER BY p.recorded_at
            ) FILTER (WHERE p.price IS NOT NULL),
          '[]'::json
        ) as price_history
      FROM routes r
      LEFT JOIN price_history p ON r.id = p.route_id
      GROUP BY r.id, r.origin, r.destination
      ORDER BY r.origin, r.destination;
    `;

    const { rows } = await pool.query(query);
    
    // Transform the data for the frontend
    const routes = rows.map(row => ({
      route_id: row.route_id,
      origin: row.origin,
      destination: row.destination,
      prices: row.price_history
        .filter(Boolean) // Remove null entries
        .map(ph => ({
          price: parseFloat(ph.price),
          recorded_at: new Date(ph.recorded_at).toISOString()
        }))
    }));

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify({ routes })
    };
  } catch (error) {
    console.error('Database query error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Failed to fetch route data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  } finally {
    await pool.end();
  }
};

export const handler = withCors(getRoutesSummaryHandler);
