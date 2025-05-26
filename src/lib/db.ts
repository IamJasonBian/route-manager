import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'routeuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'routedb',
  password: process.env.DB_PASSWORD || 'routepass',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Test the connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default {
  query,
  pool,
};
