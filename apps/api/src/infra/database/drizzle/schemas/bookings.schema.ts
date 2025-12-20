import { pgTable, varchar, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { professionalProfilesTable } from './professional-profiles.schema';
import { customerProfilesTable } from './customer-profiles.schema';

export const bookingsTable = pgTable(
  'bookings',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    professionalProfileId: varchar('professional_profile_id', { length: 64 })
      .references(() => professionalProfilesTable.id, { onDelete: 'restrict' })
      .notNull(),
    customerProfileId: varchar('customer_profile_id', { length: 64 })
      .references(() => customerProfilesTable.id, { onDelete: 'restrict' })
      .notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    totalDuration: integer('total_duration').notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    cancelledBy: varchar('cancelled_by', { length: 20 }),
    cancellationReason: text('cancellation_reason'),
    cancelledAt: timestamp('cancelled_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    professionalIdx: index('bookings_professional_idx').on(table.professionalProfileId),
    customerIdx: index('bookings_customer_idx').on(table.customerProfileId),
    startTimeIdx: index('bookings_start_time_idx').on(table.startTime),
    statusIdx: index('bookings_status_idx').on(table.status),
    professionalTimeIdx: index('bookings_professional_time_idx').on(
      table.professionalProfileId,
      table.startTime,
      table.endTime
    ),
  })
);

export type BookingRow = typeof bookingsTable.$inferSelect;
export type BookingInsert = typeof bookingsTable.$inferInsert;
