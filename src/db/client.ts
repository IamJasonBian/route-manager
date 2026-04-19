import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { resolve } from 'path';

let _db: ReturnType<typeof createDb> | null = null;

function createDb() {
  const dbPath = process.env.DB_PATH || resolve(process.cwd(), 'local.db');
  const sqlite = new Database(dbPath);
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  return drizzle(sqlite, { schema });
}

export function getDb() {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}

export type AppDatabase = ReturnType<typeof getDb>;
