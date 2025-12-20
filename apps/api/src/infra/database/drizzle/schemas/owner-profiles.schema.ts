import { pgTable, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

export const ownerProfilesTable = pgTable('owner_profiles', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  education: text('education'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type OwnerProfileRow = typeof ownerProfilesTable.$inferSelect;
export type OwnerProfileInsert = typeof ownerProfilesTable.$inferInsert;
