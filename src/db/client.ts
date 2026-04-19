let _db: any = null;
let _dbError: string | null = null;

function usePostgres(): boolean {
  const host = process.env.DB_HOST;
  return !!(host && host !== 'localhost' && host !== '127.0.0.1');
}

function isLambda(): boolean {
  return !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.LAMBDA_TASK_ROOT;
}

export function getDb() {
  if (_db) return _db;
  if (_dbError) throw new Error(_dbError);

  try {
    if (usePostgres()) {
      console.log('[DB] Using PostgreSQL');
      const { drizzle } = require('drizzle-orm/node-postgres');
      const { Pool } = require('pg');
      const schema = require('./schema.pg');

      const pool = new Pool({
        user: process.env.DB_USER || 'alpha',
        host: process.env.DB_HOST,
        database: process.env.DB_NAME || 'alpha',
        password: process.env.DB_PASSWORD || 'alpha',
        port: parseInt(process.env.DB_PORT || '5432'),
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      _db = drizzle(pool, { schema });
    } else if (isLambda()) {
      _dbError = 'No database configured. Set DB_HOST to a remote Postgres host for production.';
      throw new Error(_dbError);
    } else {
      console.log('[DB] Using SQLite');
      const { drizzle } = require('drizzle-orm/better-sqlite3');
      const Database = require('better-sqlite3');
      const schema = require('./schema');
      const { resolve } = require('path');

      const dbPath = process.env.DB_PATH || resolve(process.cwd(), 'local.db');
      const sqlite = new Database(dbPath);
      sqlite.pragma('journal_mode = WAL');
      sqlite.pragma('foreign_keys = ON');
      _db = drizzle(sqlite, { schema });
    }
  } catch (err: any) {
    if (!_dbError) _dbError = err.message;
    throw err;
  }

  return _db;
}

export type AppDatabase = ReturnType<typeof getDb>;
