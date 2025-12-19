import { eq, and } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IUserRepository } from '../../../../contracts/repositories/i-user.repository';
import { User } from '../../../../domain/user/user.aggregate';
import { Email } from '../../../../domain/value-objects/email.vo';
import { Document } from '../../../../domain/value-objects/document.vo';
import { usersTable } from '../schemas/users.schema';
import { userPhonesTable } from '../schemas/user-phones.schema';
import { userProvidersTable } from '../schemas/user-providers.schema';
import { UserMapper } from '../mappers/user.mapper';
import { UserPhoneMapper } from '../mappers/user-phone.mapper';
import { UserProviderMapper } from '../mappers/user-provider.mapper';

/**
 * UserRepository
 *
 * Implementação do repositório de usuários usando Drizzle ORM.
 * Responsável por persistir e recuperar agregados User.
 */
export class UserRepository implements IUserRepository {
  constructor(private readonly db: NodePgDatabase) {}

  async findById(id: string): Promise<User | null> {
    // Buscar user
    const [userRow] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!userRow) {
      return null;
    }

    // Buscar phones
    const phoneRows = await this.db
      .select()
      .from(userPhonesTable)
      .where(eq(userPhonesTable.userId, id.value));

    // Buscar providers
    const providerRows = await this.db
      .select()
      .from(userProvidersTable)
      .where(eq(userProvidersTable.userId, id.value));

    // Mapear para domínio
    const phones = phoneRows.map((row) => UserPhoneMapper.toDomain(row));
    const providers = providerRows.map((row) => UserProviderMapper.toDomain(row));

    return UserMapper.toDomain(userRow, phones, providers);
  }

  async findByEmail(email: Email): Promise<User | null> {
    // Buscar user
    const [userRow] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email.value))
      .limit(1);

    if (!userRow) {
      return null;
    }

    // Buscar phones
    const phoneRows = await this.db
      .select()
      .from(userPhonesTable)
      .where(eq(userPhonesTable.userId, userRow.id));

    // Buscar providers
    const providerRows = await this.db
      .select()
      .from(userProvidersTable)
      .where(eq(userProvidersTable.userId, userRow.id));

    // Mapear para domínio
    const phones = phoneRows.map((row) => UserPhoneMapper.toDomain(row));
    const providers = providerRows.map((row) => UserProviderMapper.toDomain(row));

    return UserMapper.toDomain(userRow, phones, providers);
  }

  async findByDocument(document: Document): Promise<User | null> {
    // Buscar user
    const [userRow] = await this.db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.document, document.value),
          eq(usersTable.documentType, document.type),
        ),
      )
      .limit(1);

    if (!userRow) {
      return null;
    }

    // Buscar phones
    const phoneRows = await this.db
      .select()
      .from(userPhonesTable)
      .where(eq(userPhonesTable.userId, userRow.id));

    // Buscar providers
    const providerRows = await this.db
      .select()
      .from(userProvidersTable)
      .where(eq(userProvidersTable.userId, userRow.id));

    // Mapear para domínio
    const phones = phoneRows.map((row) => UserPhoneMapper.toDomain(row));
    const providers = providerRows.map((row) => UserProviderMapper.toDomain(row));

    return UserMapper.toDomain(userRow, phones, providers);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const [result] = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, email.value))
      .limit(1);

    return !!result;
  }

  async existsByDocument(document: Document): Promise<boolean> {
    const [result] = await this.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.document, document.value),
          eq(usersTable.documentType, document.type),
        ),
      )
      .limit(1);

    return !!result;
  }

  /**
   * Salva o agregado User (upsert)
   * Usa transação para garantir consistência
   */
  async save(user: User): Promise<void> {
    const { user: userInsert } = UserMapper.toPersistence(user);

    await this.db.transaction(async (tx) => {
      // 1. Upsert user
      await tx
        .insert(usersTable)
        .values(userInsert)
        .onConflictDoUpdate({
          target: usersTable.id,
          set: {
            email: userInsert.email,
            name: userInsert.name,
            document: userInsert.document,
            documentType: userInsert.documentType,
            birthDate: userInsert.birthDate,
            gender: userInsert.gender,
            photoUrl: userInsert.photoUrl,
            onboardingCompleted: userInsert.onboardingCompleted,
            emailBeforeDeletion: userInsert.emailBeforeDeletion,
            updatedAt: userInsert.updatedAt,
            deletedAt: userInsert.deletedAt,
          },
        });

      // 2. Deletar phones existentes e recriar
      await tx.delete(userPhonesTable).where(eq(userPhonesTable.userId, user.id));

      if (user.phones.length > 0) {
        const phonesInsert = user.phones.map((phone) =>
          UserPhoneMapper.toPersistence(phone),
        );

        await tx.insert(userPhonesTable).values(phonesInsert);
      }

      // 3. Deletar providers existentes e recriar
      await tx.delete(userProvidersTable).where(eq(userProvidersTable.userId, user.id));

      if (user.providers.length > 0) {
        const providersInsert = user.providers.map((provider) =>
          UserProviderMapper.toPersistence(provider),
        );

        await tx.insert(userProvidersTable).values(providersInsert);
      }
    });
  }
}
