import { sqliteTable, text, integer, real, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const routes = sqliteTable('routes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  price: real('price'),
  departureDate: text('departure_date'),
  returnDate: text('return_date'),
  airline: text('airline'),
  flightNumber: text('flight_number'),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),
}, (table) => [
  uniqueIndex('idx_route_unique').on(table.origin, table.destination, table.departureDate, table.flightNumber),
]);

export const priceHistory = sqliteTable('price_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  routeId: integer('route_id').notNull().references(() => routes.id, { onDelete: 'cascade' }),
  price: real('price'),
  recordedAt: text('recorded_at').default(sql`(datetime('now'))`).notNull(),
}, (table) => [
  uniqueIndex('idx_price_history_unique').on(table.routeId, table.recordedAt),
]);

export const proposals = sqliteTable('proposals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  departureDate: text('departure_date'),
  returnDate: text('return_date'),
  estimatedPrice: real('estimated_price'),
  currency: text('currency').default('USD').notNull(),
  rationale: text('rationale'),
  status: text('status').default('draft').notNull(),
  googleFlightsUrl: text('google_flights_url'),
  createdAt: text('created_at').default(sql`(datetime('now'))`).notNull(),
  updatedAt: text('updated_at').default(sql`(datetime('now'))`).notNull(),
});
