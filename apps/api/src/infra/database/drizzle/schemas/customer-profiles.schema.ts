import { pgTable, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

export const customerProfilesTable = pgTable('customer_profiles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  preferredServices: jsonb('preferred_services').notNull().$type<string[]>(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type CustomerProfileRow = typeof customerProfilesTable.$inferSelect;
export type CustomerProfileInsert = typeof customerProfilesTable.$inferInsert;
