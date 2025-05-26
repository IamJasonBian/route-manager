const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '../../.env') });

// Database configuration
const dbConfig = {
  user: process.env.DB_USER || 'routeuser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'routedb',
  password: process.env.DB_PASSWORD || 'routepass',
  port: parseInt(process.env.DB_PORT || '5432'),
};

// Create a new pool
const pool = new Pool(dbConfig);

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`Found ${migrationFiles.length} migration(s) to run`);
    
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Get already run migrations
    const { rows: completedMigrations } = await client.query('SELECT name FROM migrations');
    const completedMigrationNames = new Set(completedMigrations.map(m => m.name));
    
    // Run new migrations
    for (const file of migrationFiles) {
      if (!completedMigrationNames.has(file)) {
        console.log(`Running migration: ${file}`);
        const migrationSQL = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(migrationSQL);
        await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        console.log(`Completed migration: ${file}`);
      } else {
        console.log(`Skipping already run migration: ${file}`);
      }
    }
    
    await client.query('COMMIT');
    console.log('All migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch(console.error);
