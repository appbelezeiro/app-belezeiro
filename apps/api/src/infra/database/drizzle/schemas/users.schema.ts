import { pgTable, varchar, boolean, timestamp, date, sql, check } from 'drizzle-orm/pg-core';

/**
 * Users Table Schema
 *
 * Tabela principal de usuários do sistema.
 * Suporta soft delete (deletedAt não null).
 *
 * Invariantes:
 * - email é obrigatório (exceto quando deletado)
 * - cpf é único e imutável
 * - email é liberado quando deletado (null)
 */
export const usersTable = pgTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(), // user_{uuid}
    email: varchar('email', { length: 255 }), // nullable quando deletado, unique quando não deletado
    name: varchar('name', { length: 100 }).notNull(),
    cpf: varchar('cpf', { length: 11 }), // CPF sem formatação (11 dígitos)
    birthDate: date('birth_date'),
    gender: varchar('gender', { length: 30 }), // male, female, other, prefer_not_to_say
    photoUrl: varchar('photo_url', { length: 500 }),
    onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
    emailBeforeDeletion: varchar('email_before_deletion', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    // Check: email é obrigatório exceto quando deletado
    checkEmailNotNullUnlessDeleted: check(
      'check_email_not_null_unless_deleted',
      sql`(${table.email} IS NOT NULL AND ${table.deletedAt} IS NULL) OR (${table.email} IS NULL AND ${table.deletedAt} IS NOT NULL)`,
    ),
  }),
);

export type UserRow = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
