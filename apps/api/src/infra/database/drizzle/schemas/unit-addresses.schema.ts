import { pgTable, varchar, text, timestamp, doublePrecision, uniqueIndex } from 'drizzle-orm/pg-core';
import { unitsTable } from './units.schema';

export const unitAddressesTable = pgTable(
  'unit_addresses',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    unitId: varchar('unit_id', { length: 64 })
      .references(() => unitsTable.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    street: text('street').notNull(),
    number: text('number').notNull(),
    complement: text('complement'),
    neighborhood: text('neighborhood').notNull(),
    city: text('city').notNull(),
    state: text('state').notNull(),
    zipCode: text('zip_code').notNull(),
    country: text('country').notNull().default('Brasil'),
    latitude: doublePrecision('latitude'),
    longitude: doublePrecision('longitude'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    idxUnitAddressesUnitId: uniqueIndex('idx_unit_addresses_unit_id').on(table.unitId),
  }),
);

export type UnitAddressRow = typeof unitAddressesTable.$inferSelect;
export type UnitAddressInsert = typeof unitAddressesTable.$inferInsert;
