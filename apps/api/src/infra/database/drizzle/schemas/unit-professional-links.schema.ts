import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { professionalProfilesTable } from './professional-profiles.schema';

export const unitProfessionalLinksTable = pgTable('unit_professional_links', {
  id: varchar('id', { length: 64 }).primaryKey(),
  unitId: varchar('unit_id', { length: 64 }).notNull(),
  professionalProfileId: varchar('professional_profile_id', { length: 64 })
    .references(() => professionalProfilesTable.id, { onDelete: 'cascade' })
    .notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  invitedBy: varchar('invited_by', { length: 64 }).notNull(),
  invitedAt: timestamp('invited_at').notNull(),
  linkedAt: timestamp('linked_at'),
  unlinkedAt: timestamp('unlinked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UnitProfessionalLinkRow = typeof unitProfessionalLinksTable.$inferSelect;
export type UnitProfessionalLinkInsert = typeof unitProfessionalLinksTable.$inferInsert;
