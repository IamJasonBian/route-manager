import { pgTable, text, integer, serial, doublePrecision, uniqueIndex, timestamp } from 'drizzle-orm/pg-core';

export const routes = pgTable('routes', {
  id: serial('id').primaryKey(),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  price: doublePrecision('price'),
  departureDate: text('departure_date'),
  returnDate: text('return_date'),
  airline: text('airline'),
  flightNumber: text('flight_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('idx_route_unique').on(table.origin, table.destination, table.departureDate, table.flightNumber),
]);

export const priceHistory = pgTable('price_history', {
  id: serial('id').primaryKey(),
  routeId: integer('route_id').notNull().references(() => routes.id, { onDelete: 'cascade' }),
  price: doublePrecision('price'),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('idx_price_history_unique').on(table.routeId, table.recordedAt),
]);

export const proposals = pgTable('proposals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  departureDate: text('departure_date'),
  returnDate: text('return_date'),
  estimatedPrice: doublePrecision('estimated_price'),
  currency: text('currency').default('USD').notNull(),
  rationale: text('rationale'),
  status: text('status').default('draft').notNull(),
  googleFlightsUrl: text('google_flights_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
