import { pgTable, varchar, boolean, timestamp, uuid, sql, unique } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

/**
 * UserPhones Table Schema
 *
 * Tabela de telefones dos usuários.
 * Cada usuário pode ter múltiplos telefones.
 * Apenas 1 pode ser primary.
 */
export const userPhonesTable = pgTable(
  'user_phones',
  {
    id: varchar('id', { length: 64 }).primaryKey(), // phone_{uuid}
    userId: varchar('user_id', { length: 64 })
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    countryCode: varchar('country_code', { length: 5 }).notNull(), // +55, +1, etc
    areaCode: varchar('area_code', { length: 3 }).notNull(), // 11, 21, etc
    number: varchar('number', { length: 20 }).notNull(), // 999999999
    label: varchar('label', { length: 50 }), // 'Celular', 'Trabalho', 'Casa'
    isPrimary: boolean('is_primary').default(false).notNull(),
    isWhatsApp: boolean('is_whatsapp').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    // Unique constraint: apenas 1 telefone primary por usuário
    // Nota: Drizzle pode não suportar partial unique index com WHERE
    // Se não funcionar, será criado manualmente na migration SQL
    unique('unique_user_primary_phone').on(table.userId, table.isPrimary),
  ],
);

export type UserPhoneRow = typeof userPhonesTable.$inferSelect;
export type UserPhoneInsert = typeof userPhonesTable.$inferInsert;
