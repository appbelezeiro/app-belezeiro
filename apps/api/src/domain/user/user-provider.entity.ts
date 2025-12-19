import { BaseEntity, BaseEntityProps } from '../entities/base/base-entity';
import { Email } from '../value-objects/email.vo';
import { UserId, UserProviderId, ProviderId } from './value-objects';

export enum ProviderType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  EMAIL_PASSWORD = 'email_password',
}

export interface UserProviderProps extends BaseEntityProps {
  userId: UserId;
  provider: ProviderType;
  providerId: ProviderId;
  providerEmail?: Email;
  linkedAt: Date;
  lastUsedAt: Date;
}

/**
 * UserProvider Entity
 *
 * Representa um provider OAuth vinculado a um usuário.
 * - Google, Facebook, Email/Password
 * - User deve ter pelo menos 1 provider
 * - Não pode ter 2 providers do mesmo tipo
 */
export class UserProvider extends BaseEntity<UserProviderProps> {
  protected prefix(): string {
    return 'prov';
  }

  private constructor(props: UserProviderProps) {
    super(props);
  }

  static create(data: {
    userId: UserId;
    provider: ProviderType;
    providerId: ProviderId;
    providerEmail?: Email;
  }): UserProvider {
    const now = new Date();

    return new UserProvider({
      userId: data.userId,
      provider: data.provider,
      providerId: data.providerId,
      providerEmail: data.providerEmail,
      linkedAt: now,
      lastUsedAt: now,
    });
  }

  static reconstitute(data: {
    id: string;
    userId: UserId;
    provider: ProviderType;
    providerId: ProviderId;
    providerEmail?: Email;
    linkedAt: Date;
    lastUsedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }): UserProvider {
    return new UserProvider({
      id: data.id,
      userId: data.userId,
      provider: data.provider,
      providerId: data.providerId,
      providerEmail: data.providerEmail,
      linkedAt: data.linkedAt,
      lastUsedAt: data.lastUsedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get provider(): ProviderType {
    return this.props.provider;
  }

  get providerId(): ProviderId {
    return this.props.providerId;
  }

  get providerEmail(): Email | undefined {
    return this.props.providerEmail;
  }

  get linkedAt(): Date {
    return this.props.linkedAt;
  }

  get lastUsedAt(): Date {
    return this.props.lastUsedAt;
  }

  updateLastUsed(): void {
    this.props.lastUsedAt = new Date();
    this.touch();
  }
}
