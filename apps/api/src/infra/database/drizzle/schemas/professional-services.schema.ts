import { pgTable, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { professionalProfilesTable } from './professional-profiles.schema';

export const professionalServicesTable = pgTable('professional_services', {
  id: varchar('id', { length: 64 }).primaryKey(),
  professionalProfileId: varchar('professional_profile_id', { length: 64 })
    .references(() => professionalProfilesTable.id, { onDelete: 'cascade' })
    .notNull(),
  serviceId: varchar('service_id', { length: 64 }).notNull(),
  customPrice: integer('custom_price'),
  customDuration: integer('custom_duration'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type ProfessionalServiceRow = typeof professionalServicesTable.$inferSelect;
export type ProfessionalServiceInsert = typeof professionalServicesTable.$inferInsert;
