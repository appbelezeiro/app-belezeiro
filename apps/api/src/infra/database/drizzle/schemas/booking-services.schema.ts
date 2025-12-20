import { pgTable, varchar, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { bookingsTable } from './bookings.schema';

export const bookingServicesTable = pgTable(
  'booking_services',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    bookingId: varchar('booking_id', { length: 64 })
      .references(() => bookingsTable.id, { onDelete: 'cascade' })
      .notNull(),
    serviceId: varchar('service_id', { length: 64 }).notNull(),
    serviceName: varchar('service_name', { length: 255 }).notNull(),
    duration: integer('duration').notNull(),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    bookingIdx: index('booking_services_booking_idx').on(table.bookingId),
  })
);

export type BookingServiceRow = typeof bookingServicesTable.$inferSelect;
export type BookingServiceInsert = typeof bookingServicesTable.$inferInsert;
