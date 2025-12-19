import { UserProvider, ProviderType } from '../../../../domain/user/user-provider.entity';
import { ProviderId } from '../../../../domain/user/value-objects';
import { Email } from '../../../../domain/value-objects/email.vo';
import { UserProviderRow, UserProviderInsert } from '../schemas/user-providers.schema';

/**
 * UserProviderMapper
 *
 * Converte entre UserProvider (domínio) e UserProviderRow (persistência)
 */
export class UserProviderMapper {
  /**
   * Domain -> Persistence
   */
  static toPersistence(userProvider: UserProvider): UserProviderInsert {
    return {
      id: userProvider.id,
      userId: userProvider.userId,
      provider: userProvider.provider,
      providerId: userProvider.providerId.value,
      providerEmail: userProvider.providerEmail?.value,
      linkedAt: userProvider.linkedAt,
      lastUsedAt: userProvider.lastUsedAt,
      createdAt: userProvider.createdAt,
      updatedAt: userProvider.updatedAt,
    };
  }

  /**
   * Persistence -> Domain
   */
  static toDomain(row: UserProviderRow): UserProvider {
    return UserProvider.reconstitute({
      id: row.id,
      userId: row.userId,
      provider: row.provider as ProviderType,
      providerId: new ProviderId(row.providerId),
      providerEmail: row.providerEmail ? new Email(row.providerEmail) : undefined,
      linkedAt: row.linkedAt,
      lastUsedAt: row.lastUsedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
