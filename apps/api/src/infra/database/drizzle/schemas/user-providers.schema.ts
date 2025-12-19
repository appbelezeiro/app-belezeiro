import { pgTable, varchar, timestamp, uuid, unique } from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';

/**
 * UserProviders Table Schema
 *
 * Tabela de providers OAuth vinculados aos usuários.
 * Suporta: Google, Facebook, Email/Password
 * Cada usuário pode ter múltiplos providers, mas não duplicados.
 */
export const userProvidersTable = pgTable(
  'user_providers',
  {
    id: varchar('id', { length: 64 }).primaryKey(), // prov_{uuid}
    userId: varchar('user_id', { length: 64 })
      .references(() => usersTable.id, { onDelete: 'cascade' })
      .notNull(),
    provider: varchar('provider', { length: 50 }).notNull(), // 'google', 'facebook', 'email_password'
    providerId: varchar('provider_id', { length: 255 }).notNull(), // ID fornecido pelo provider
    providerEmail: varchar('provider_email', { length: 255 }), // Email do provider (pode diferir do email do user)
    linkedAt: timestamp('linked_at').defaultNow().notNull(),
    lastUsedAt: timestamp('last_used_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    // Unique: provider + providerId (ex: google + google-id-123)
    unique('unique_provider_id').on(table.provider, table.providerId),
    // Unique: userId + provider (usuário não pode ter 2x o mesmo provider)
    unique('unique_user_provider').on(table.userId, table.provider),
  ],
);

export type UserProviderRow = typeof userProvidersTable.$inferSelect;
export type UserProviderInsert = typeof userProvidersTable.$inferInsert;
