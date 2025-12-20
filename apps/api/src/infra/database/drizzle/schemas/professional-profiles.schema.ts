import { pgTable, varchar, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

export const professionalProfilesTable = pgTable('professional_profiles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  bio: text('bio'),
  yearsOfExperience: integer('years_of_experience'),
  achievements: jsonb('achievements').notNull().$type<string[]>(),
  specialties: jsonb('specialties').notNull().$type<string[]>(),
  slotDurationMinutes: integer('slot_duration_minutes').default(30).notNull(),
  minAdvanceMinutes: integer('min_advance_minutes').default(60).notNull(),
  maxAdvanceDays: integer('max_advance_days').default(30).notNull(),
  bufferMinutes: integer('buffer_minutes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ProfessionalProfileRow = typeof professionalProfilesTable.$inferSelect;
export type ProfessionalProfileInsert = typeof professionalProfilesTable.$inferInsert;
