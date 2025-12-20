import { pgTable, varchar, text, boolean, timestamp, index, check, sql } from 'drizzle-orm/pg-core';
import { professionalProfilesTable } from './professional-profiles.schema';

export const specialtiesTable = pgTable(
  'specialties',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    isGlobal: boolean('is_global').notNull(),
    ownerId: varchar('owner_id', { length: 64 }).references(
      () => professionalProfilesTable.id,
      { onDelete: 'cascade' },
    ),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    idxSpecialtiesIsGlobal: index('idx_specialties_is_global').on(table.isGlobal),
    idxSpecialtiesOwnerId: index('idx_specialties_owner_id').on(table.ownerId),
    checkOwnership: check(
      'check_specialty_ownership',
      sql`(${table.isGlobal} = true AND ${table.ownerId} IS NULL) OR (${table.isGlobal} = false AND ${table.ownerId} IS NOT NULL)`,
    ),
  }),
);

export type SpecialtyRow = typeof specialtiesTable.$inferSelect;
export type SpecialtyInsert = typeof specialtiesTable.$inferInsert;
