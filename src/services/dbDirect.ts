import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '../../.env');
dotenv.config({ path: envPath });

// Database connection configuration
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
};

// Create a connection pool
const pool = new Pool(dbConfig);

// Test the database connection
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

// Execute a query with parameters
export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<{ rows: T[]; rowCount: number }> {
  const client = await pool.connect();
  try {
    console.log('Executing query:', query);
    console.log('With parameters:', params);
    
    const result = await client.query(query, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount || 0,
    };
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Get a database client for transactions
export async function getClient() {
  const client = await pool.connect();
  
  const release = client.release.bind(client);
  
  // Override the release method to ensure proper cleanup
  client.release = () => {
    release();
  };
  
  return client;
}

// Test the connection when this module is loaded
testConnection().then(connected => {
  if (!connected) {
    console.error('Failed to connect to the database. Please check your connection settings.');
  }
});

// Export the pool for direct access if needed
export { pool };
