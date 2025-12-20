import { pgTable, varchar, text, boolean, timestamp, doublePrecision } from 'drizzle-orm/pg-core';
import { customerProfilesTable } from './customer-profiles.schema';

export const customerAddressesTable = pgTable('customer_addresses', {
  id: varchar('id', { length: 64 }).primaryKey(),
  customerProfileId: varchar('customer_profile_id', { length: 64 })
    .references(() => customerProfilesTable.id, { onDelete: 'cascade' })
    .notNull(),
  street: varchar('street', { length: 255 }).notNull(),
  number: varchar('number', { length: 20 }).notNull(),
  complement: varchar('complement', { length: 100 }),
  neighborhood: varchar('neighborhood', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  label: varchar('label', { length: 50 }).notNull(),
  isPrimary: boolean('is_primary').default(false).notNull(),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type CustomerAddressRow = typeof customerAddressesTable.$inferSelect;
export type CustomerAddressInsert = typeof customerAddressesTable.$inferInsert;
