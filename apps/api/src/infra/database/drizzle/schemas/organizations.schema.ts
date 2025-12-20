import { pgTable, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

export const organizationsTable = pgTable(
  'organizations',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .references(() => usersTable.id, { onDelete: 'restrict' })
      .notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    photoUrl: text('photo_url'),
    address: text('address'),
    phone: text('phone'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    idxOrganizationsUserId: index('idx_organizations_user_id').on(table.userId),
    idxOrganizationsSlug: index('idx_organizations_slug').on(table.slug),
    idxOrganizationsDeletedAt: index('idx_organizations_deleted_at').on(table.deletedAt),
  }),
);

export type OrganizationRow = typeof organizationsTable.$inferSelect;
export type OrganizationInsert = typeof organizationsTable.$inferInsert;
