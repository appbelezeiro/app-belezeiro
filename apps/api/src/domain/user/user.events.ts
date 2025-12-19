import { BaseDomainEvent, DomainEventMetadata } from '../events/base/domain-event';
import { Email } from '../value-objects/email.vo';
import { UserId } from './value-objects/user-id.vo';
import { ProviderType } from './user-provider.entity';

/**
 * UserCreated Event
 *
 * Disparado quando um novo usuário é criado
 */
export class UserCreatedEvent extends BaseDomainEvent<{
  userId: string;
  email: string;
  name: string;
  provider: ProviderType;
}> {
  get eventType(): string {
    return 'user.created';
  }

  static create(
    userId: UserId,
    email: Email,
    name: string,
    provider: ProviderType,
    metadata?: DomainEventMetadata,
  ): Omit<UserCreatedEvent, 'eventId' | 'occurredAt' | 'version' | 'eventType'> {
    return {
      aggregateId: userId.value,
      aggregateType: 'User',
      payload: {
        userId: userId.value,
        email: email.value,
        name,
        provider,
      },
      metadata,
    } as any;
  }
}

/**
 * UserDeleted Event
 *
 * Disparado quando um usuário é soft-deleted
 */
export class UserDeletedEvent extends BaseDomainEvent<{
  userId: string;
  deletedAt: Date;
}> {
  get eventType(): string {
    return 'user.deleted';
  }
}

/**
 * UserRestored Event
 *
 * Disparado quando um usuário deletado é restaurado
 */
export class UserRestoredEvent extends BaseDomainEvent<{
  userId: string;
  restoredAt: Date;
}> {
  get eventType(): string {
    return 'user.restored';
  }
}

/**
 * UserDocumentSet Event
 *
 * Disparado quando o documento (CPF/CNPJ) é definido pela primeira vez
 */
export class UserDocumentSetEvent extends BaseDomainEvent<{
  userId: string;
  documentType: string;
}> {
  get eventType(): string {
    return 'user.document.set';
  }
}

/**
 * UserOnboardingCompleted Event
 *
 * Disparado quando o onboarding do usuário é completado
 */
export class UserOnboardingCompletedEvent extends BaseDomainEvent<{
  userId: string;
  completedAt: Date;
}> {
  get eventType(): string {
    return 'user.onboarding.completed';
  }
}

/**
 * UserPhoneAdded Event
 *
 * Disparado quando um telefone é adicionado ao usuário
 */
export class UserPhoneAddedEvent extends BaseDomainEvent<{
  userId: string;
  phoneId: string;
  phone: string;
  isPrimary: boolean;
}> {
  get eventType(): string {
    return 'user.phone.added';
  }
}

/**
 * UserPhoneRemoved Event
 *
 * Disparado quando um telefone é removido do usuário
 */
export class UserPhoneRemovedEvent extends BaseDomainEvent<{
  userId: string;
  phoneId: string;
}> {
  get eventType(): string {
    return 'user.phone.removed';
  }
}

/**
 * UserPrimaryPhoneChanged Event
 *
 * Disparado quando o telefone primário do usuário é alterado
 */
export class UserPrimaryPhoneChangedEvent extends BaseDomainEvent<{
  userId: string;
  oldPrimaryPhoneId?: string;
  newPrimaryPhoneId: string;
}> {
  get eventType(): string {
    return 'user.phone.primary_changed';
  }
}

/**
 * ProviderLinked Event
 *
 * Disparado quando um novo provider OAuth é vinculado ao usuário
 */
export class ProviderLinkedEvent extends BaseDomainEvent<{
  userId: string;
  provider: ProviderType;
  providerId: string;
}> {
  get eventType(): string {
    return 'user.provider.linked';
  }
}

/**
 * ProviderUnlinked Event
 *
 * Disparado quando um provider OAuth é desvinculado do usuário
 */
export class ProviderUnlinkedEvent extends BaseDomainEvent<{
  userId: string;
  provider: ProviderType;
}> {
  get eventType(): string {
    return 'user.provider.unlinked';
  }
}

/**
 * UserNameUpdated Event
 *
 * Disparado quando o nome do usuário é atualizado
 */
export class UserNameUpdatedEvent extends BaseDomainEvent<{
  userId: string;
  oldName: string;
  newName: string;
}> {
  get eventType(): string {
    return 'user.name.updated';
  }
}

/**
 * UserPhotoUpdated Event
 *
 * Disparado quando a foto do usuário é atualizada
 */
export class UserPhotoUpdatedEvent extends BaseDomainEvent<{
  userId: string;
  photoUrl: string;
}> {
  get eventType(): string {
    return 'user.photo.updated';
  }
}
