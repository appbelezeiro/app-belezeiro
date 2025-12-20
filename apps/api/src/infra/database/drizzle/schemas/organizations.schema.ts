import { pgTable, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { ownerProfilesTable } from './owner-profiles.schema';

export const organizationsTable = pgTable(
  'organizations',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    ownerId: varchar('owner_id', { length: 64 })
      .references(() => ownerProfilesTable.id, { onDelete: 'restrict' })
      .notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    document: text('document'),
    logo: text('logo'),
    description: text('description'),
    category: text('category'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    idxOrganizationsOwnerId: index('idx_organizations_owner_id').on(table.ownerId),
    idxOrganizationsSlug: index('idx_organizations_slug').on(table.slug),
    idxOrganizationsDeletedAt: index('idx_organizations_deleted_at').on(table.deletedAt),
  }),
);

export type OrganizationRow = typeof organizationsTable.$inferSelect;
export type OrganizationInsert = typeof organizationsTable.$inferInsert;
