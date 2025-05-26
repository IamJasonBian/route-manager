import { Pool } from 'pg';

// Enhanced logging function
const log = (...args) => {
  console.log('[DB Function]', ...args);
};

export const handler = async (event, context) => {
  log('Request received:', {
    method: event.httpMethod,
    path: event.path,
    body: event.body ? JSON.parse(event.body) : {},
    env: {
      DB_USER: process.env.DB_USER ? '***' : 'not set',
      DB_HOST: process.env.DB_HOST ? '***' : 'not set',
      DB_NAME: process.env.DB_NAME ? '***' : 'not set',
      DB_PORT: process.env.DB_PORT ? '***' : 'not set',
    }
  });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    const error = 'Method Not Allowed';
    log('Error:', error);
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error }),
    };
  }

  let pool;
  try {
    // Log connection details (without password)
    const dbConfig = {
      user: process.env.DB_USER || 'routeuser',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'routedb',
      password: process.env.DB_PASSWORD ? '***' : 'not set',
      port: parseInt(process.env.DB_PORT || '5432'),
    };
    
    log('Creating database connection with config:', { ...dbConfig, password: '***' });
    
    pool = new Pool(dbConfig);
    
    // Test the connection
    try {
      const testResult = await pool.query('SELECT NOW()');
      log('Database connection test successful:', testResult.rows[0]);
    } catch (testError) {
      log('Database connection test failed:', testError);
      throw new Error(`Database connection test failed: ${testError.message}`);
    }

    const { query, params = [] } = JSON.parse(event.body);
    log('Executing query:', { query, params });
    
    const result = await pool.query(query, params);
    log('Query successful, rows returned:', result.rows.length);
    
    // Return the result in the expected QueryResult format
    const queryResult = {
      rows: result.rows,
      rowCount: result.rowCount
    };
    
    log('Returning query result with row count:', queryResult.rowCount);
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(queryResult),
    };
  } catch (error) {
    log('Database error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: error.message,
        details: error.detail,
        code: error.code,
        query: error.query
      }),
    };
  } finally {
    if (pool) {
      try {
        await pool.end();
        log('Database connection closed');
      } catch (err) {
        log('Error closing connection:', err);
      }
    }
  }
};
