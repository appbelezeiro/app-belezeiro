import { pgTable, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

/**
 * UserPhones Table Schema
 *
 * Tabela de telefones dos usuários.
 * Cada usuário pode ter múltiplos telefones.
 * Apenas 1 pode ser primary.
 *
 * Nota: Constraint parcial (unique primary phone por usuário) é criada via SQL migration.
 * Drizzle não suporta partial unique indexes nativamente.
 */
export const userPhonesTable = pgTable('user_phones', {
  id: varchar('id', { length: 64 }).primaryKey(), // phone_{uuid}
  userId: varchar('user_id', { length: 64 })
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(), // Formato internacional: +5511999999999
  label: varchar('label', { length: 50 }).notNull(), // 'Celular', 'Trabalho', 'Casa'
  isPrimary: boolean('is_primary').default(false).notNull(),
  isWhatsApp: boolean('is_whatsapp').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type UserPhoneRow = typeof userPhonesTable.$inferSelect;
export type UserPhoneInsert = typeof userPhonesTable.$inferInsert;
