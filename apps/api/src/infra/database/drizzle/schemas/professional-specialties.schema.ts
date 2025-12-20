import { pgTable, varchar, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { professionalProfilesTable } from './professional-profiles.schema';
import { specialtiesTable } from './specialties.schema';

export const professionalSpecialtiesTable = pgTable(
  'professional_specialties',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    professionalProfileId: varchar('professional_profile_id', { length: 64 })
      .references(() => professionalProfilesTable.id, { onDelete: 'cascade' })
      .notNull(),
    specialtyId: varchar('specialty_id', { length: 64 })
      .references(() => specialtiesTable.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    idxProfessionalSpecialtiesProfId: index('idx_professional_specialties_prof_id').on(
      table.professionalProfileId,
    ),
    idxProfessionalSpecialtiesSpecialtyId: index(
      'idx_professional_specialties_specialty_id',
    ).on(table.specialtyId),
    uniqProfessionalSpecialty: unique('uniq_professional_specialty').on(
      table.professionalProfileId,
      table.specialtyId,
    ),
  }),
);

export type ProfessionalSpecialtyRow = typeof professionalSpecialtiesTable.$inferSelect;
export type ProfessionalSpecialtyInsert = typeof professionalSpecialtiesTable.$inferInsert;
