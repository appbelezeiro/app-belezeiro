import { pgTable, varchar, text, boolean, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { organizationsTable } from './organizations.schema';

export const unitsTable = pgTable(
  'units',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    organizationId: varchar('organization_id', { length: 64 })
      .references(() => organizationsTable.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    isSoloProfessional: boolean('is_solo_professional').default(false).notNull(),
    phone: text('phone'),
    email: text('email'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    idxUnitsOrganizationId: index('idx_units_organization_id').on(table.organizationId),
    idxUnitsSlug: uniqueIndex('idx_units_slug').on(table.organizationId, table.slug),
    idxUnitsDeletedAt: index('idx_units_deleted_at').on(table.deletedAt),
  }),
);

export type UnitRow = typeof unitsTable.$inferSelect;
export type UnitInsert = typeof unitsTable.$inferInsert;
