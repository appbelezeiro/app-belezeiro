import { pgTable, varchar, primaryKey, index } from 'drizzle-orm/pg-core';
import { specialtiesTable } from './specialties.schema';
import { servicesTable } from './services.schema';

export const specialtyServicesTable = pgTable(
  'specialty_services',
  {
    specialtyId: varchar('specialty_id', { length: 64 })
      .references(() => specialtiesTable.id, { onDelete: 'cascade' })
      .notNull(),
    serviceId: varchar('service_id', { length: 64 })
      .references(() => servicesTable.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.specialtyId, table.serviceId] }),
    idxSpecialtyServicesSpecialtyId: index('idx_specialty_services_specialty_id').on(
      table.specialtyId,
    ),
    idxSpecialtyServicesServiceId: index('idx_specialty_services_service_id').on(
      table.serviceId,
    ),
  }),
);

export type SpecialtyServiceRow = typeof specialtyServicesTable.$inferSelect;
export type SpecialtyServiceInsert = typeof specialtyServicesTable.$inferInsert;
