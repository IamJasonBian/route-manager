import { Pool } from 'pg';
import { loadEnv } from './loadEnv';

// Load environment variables
loadEnv();

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'routedb',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Log database connection info (without sensitive data)
console.log('Database connection info:', {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '5432',
  database: process.env.DB_NAME || 'routedb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD ? '***' : 'Not set',
});

// Test the connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
    return true;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

/**
 * Execute a query directly against the database
 */
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  
  try {
    console.log('Executing database query:', query);
    console.log('Query parameters:', params);
    
    const result = await client.query(query, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount || 0
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get a database client for transactions
 * @returns A promise that resolves to a database client
 */
export async function getClient() {
  const client = await pool.connect();
  return client;
}

// Test the connection when this module is loaded
testConnection().then(success => {
  if (!success) {
    console.error('Failed to connect to the database. Please check your connection settings.');
  }
});
