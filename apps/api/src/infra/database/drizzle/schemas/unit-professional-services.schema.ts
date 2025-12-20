import { pgTable, varchar, integer, boolean, timestamp, index, unique, decimal } from 'drizzle-orm/pg-core';
import { unitProfessionalLinksTable } from './unit-professional-links.schema';
import { servicesTable } from './services.schema';

export const unitProfessionalServicesTable = pgTable(
  'unit_professional_services',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    unitProfessionalLinkId: varchar('unit_professional_link_id', { length: 64 })
      .references(() => unitProfessionalLinksTable.id, { onDelete: 'cascade' })
      .notNull(),
    serviceId: varchar('service_id', { length: 64 })
      .references(() => servicesTable.id, { onDelete: 'cascade' })
      .notNull(),
    unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
    unitDuration: integer('unit_duration'),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    idxUnitProfServicesLinkId: index('idx_unit_prof_services_link_id').on(
      table.unitProfessionalLinkId,
    ),
    idxUnitProfServicesServiceId: index('idx_unit_prof_services_service_id').on(
      table.serviceId,
    ),
    uniqUnitProfService: unique('uniq_unit_prof_service').on(
      table.unitProfessionalLinkId,
      table.serviceId,
    ),
  }),
);

export type UnitProfessionalServiceRow = typeof unitProfessionalServicesTable.$inferSelect;
export type UnitProfessionalServiceInsert = typeof unitProfessionalServicesTable.$inferInsert;
