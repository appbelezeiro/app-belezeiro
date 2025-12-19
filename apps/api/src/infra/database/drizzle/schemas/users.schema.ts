import { pgTable, varchar, boolean, timestamp, date, uuid, sql } from 'drizzle-orm/pg-core';

/**
 * Users Table Schema
 *
 * Tabela principal de usuários do sistema.
 * Suporta soft delete (deletedAt não null).
 */
export const usersTable = pgTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(), // user_{uuid}
    email: varchar('email', { length: 255 }).unique(), // nullable quando deletado
    name: varchar('name', { length: 100 }).notNull(),
    document: varchar('document', { length: 14 }).unique(), // CPF (11) ou CNPJ (14)
    documentType: varchar('document_type', { length: 10 }), // 'cpf' ou 'cnpj'
    birthDate: date('birth_date'),
    gender: varchar('gender', { length: 50 }),
    photoUrl: varchar('photo_url', { length: 500 }),
    onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
    emailBeforeDeletion: varchar('email_before_deletion', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    // Check: email é null quando deletedAt não é null
    checkDeletedEmail: sql`CHECK (deleted_at IS NULL OR email IS NULL)`,
  }),
);

export type UserRow = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
