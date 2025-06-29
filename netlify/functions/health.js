import { Pool } from 'pg';
import config from '../../src/config/env.js';

export const handler = async (event, context) => {
  // Log environment info for debugging
  console.log('Health check - Environment:', {
    nodeEnv: config.nodeEnv,
    dbHost: config.db.host,
    dbPort: config.db.port,
    dbName: config.db.name,
    dbUser: config.db.user,
    dbPassword: config.db.password ? '***' : 'Not set'
  });
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.name,
    password: config.db.password,
    port: config.db.port,
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
