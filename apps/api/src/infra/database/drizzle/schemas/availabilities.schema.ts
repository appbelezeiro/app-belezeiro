import { pgTable, varchar, integer, timestamp, boolean, uniqueIndex } from 'drizzle-orm/pg-core';
import { professionalProfilesTable } from './professional-profiles.schema';

export const availabilitiesTable = pgTable(
  'availabilities',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    professionalProfileId: varchar('professional_profile_id', { length: 64 })
      .references(() => professionalProfilesTable.id, { onDelete: 'cascade' })
      .notNull(),
    dayOfWeek: integer('day_of_week').notNull(),
    startTime: varchar('start_time', { length: 5 }).notNull(),
    endTime: varchar('end_time', { length: 5 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    professionalDayUnique: uniqueIndex('availabilities_professional_day_unique').on(
      table.professionalProfileId,
      table.dayOfWeek
    ),
  })
);

export type AvailabilityRow = typeof availabilitiesTable.$inferSelect;
export type AvailabilityInsert = typeof availabilitiesTable.$inferInsert;
