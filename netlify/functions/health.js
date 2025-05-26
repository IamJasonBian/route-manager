import { Pool } from 'pg';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const pool = new Pool({
    user: process.env.DB_USER || 'routeuser',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'routedb',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    // Test the connection
    const result = await pool.query('SELECT NOW()');
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'ok',
        database: 'connected',
        currentTime: result.rows[0].now,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'error',
        error: error.message,
      }),
    };
  } finally {
    await pool.end();
  }
};
