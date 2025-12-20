import { pgTable, varchar, text, integer, boolean, timestamp, index, check, sql } from 'drizzle-orm/pg-core';
import { professionalProfilesTable } from './professional-profiles.schema';

export const servicesTable = pgTable(
  'services',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    defaultDuration: integer('default_duration'),
    isGlobal: boolean('is_global').notNull(),
    ownerId: varchar('owner_id', { length: 64 }).references(
      () => professionalProfilesTable.id,
      { onDelete: 'cascade' },
    ),
    createdById: varchar('created_by_id', { length: 64 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    idxServicesIsGlobal: index('idx_services_is_global').on(table.isGlobal),
    idxServicesOwnerId: index('idx_services_owner_id').on(table.ownerId),
    checkGlobalOwnership: check(
      'check_service_global_ownership',
      sql`(${table.isGlobal} = true AND ${table.ownerId} IS NULL) OR (${table.isGlobal} = false AND ${table.ownerId} IS NOT NULL)`,
    ),
  }),
);

export type ServiceRow = typeof servicesTable.$inferSelect;
export type ServiceInsert = typeof servicesTable.$inferInsert;
