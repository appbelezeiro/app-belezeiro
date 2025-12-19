import { DomainEvent } from '../events/base/domain-event';
import { ProviderType } from './user-provider.entity';

/**
 * User Events Registry
 *
 * Centraliza todos os eventos do bounded context User.
 * Formato inline (não classes) para simplicidade.
 */
export const UserEvents = {
  UserCreated: 'user.created' as const,
  UserDeleted: 'user.deleted' as const,
  UserRestored: 'user.restored' as const,
  UserNameUpdated: 'user.name.updated' as const,
  UserBirthDateUpdated: 'user.birth_date.updated' as const,
  UserGenderUpdated: 'user.gender.updated' as const,
  UserPhotoUpdated: 'user.photo.updated' as const,
  UserDocumentSet: 'user.document.set' as const,
  UserOnboardingCompleted: 'user.onboarding.completed' as const,
  UserPhoneAdded: 'user.phone.added' as const,
  UserPhoneRemoved: 'user.phone.removed' as const,
  UserPrimaryPhoneChanged: 'user.phone.primary_changed' as const,
  ProviderLinked: 'user.provider.linked' as const,
  ProviderUnlinked: 'user.provider.unlinked' as const,
} as const;

/**
 * UserCreated Event
 *
 * Disparado quando um novo usuário é criado no sistema.
 */
export type UserCreatedEvent = DomainEvent<{
  userId: string;
  email: string;
  name: string;
  provider: ProviderType;
}>;

/**
 * UserDeleted Event
 *
 * Disparado quando um usuário é soft-deleted.
 * Email é liberado para reutilização.
 */
export type UserDeletedEvent = DomainEvent<{
  userId: string;
  deletedAt: Date;
}>;

/**
 * UserRestored Event
 *
 * Disparado quando um usuário deletado é restaurado.
 */
export type UserRestoredEvent = DomainEvent<{
  userId: string;
  restoredAt: Date;
}>;

/**
 * UserNameUpdated Event
 *
 * Disparado quando o nome do usuário é atualizado.
 */
export type UserNameUpdatedEvent = DomainEvent<{
  userId: string;
  oldName: string;
  newName: string;
}>;

/**
 * UserBirthDateUpdated Event
 *
 * Disparado quando a data de nascimento é atualizada.
 */
export type UserBirthDateUpdatedEvent = DomainEvent<{
  userId: string;
  birthDate: Date;
}>;

/**
 * UserGenderUpdated Event
 *
 * Disparado quando o gênero do usuário é atualizado.
 */
export type UserGenderUpdatedEvent = DomainEvent<{
  userId: string;
  gender: string;
}>;

/**
 * UserPhotoUpdated Event
 *
 * Disparado quando a foto de perfil do usuário é atualizada.
 */
export type UserPhotoUpdatedEvent = DomainEvent<{
  userId: string;
  photoUrl: string;
}>;

/**
 * UserDocumentSet Event
 *
 * Disparado quando o documento (CPF/CNPJ) é definido pela primeira vez.
 * Documento é imutável - só pode ser definido uma vez.
 */
export type UserDocumentSetEvent = DomainEvent<{
  userId: string;
  documentType: string;
  documentValue: string;
}>;

/**
 * UserOnboardingCompleted Event
 *
 * Disparado quando o onboarding do usuário é completado.
 */
export type UserOnboardingCompletedEvent = DomainEvent<{
  userId: string;
  completedAt: Date;
}>;

/**
 * UserPhoneAdded Event
 *
 * Disparado quando um telefone é adicionado ao usuário.
 */
export type UserPhoneAddedEvent = DomainEvent<{
  userId: string;
  phoneId: string;
  phone: string;
  label: string;
  isPrimary: boolean;
  isWhatsApp: boolean;
}>;

/**
 * UserPhoneRemoved Event
 *
 * Disparado quando um telefone é removido do usuário.
 */
export type UserPhoneRemovedEvent = DomainEvent<{
  userId: string;
  phoneId: string;
}>;

/**
 * UserPrimaryPhoneChanged Event
 *
 * Disparado quando o telefone primário do usuário é alterado.
 */
export type UserPrimaryPhoneChangedEvent = DomainEvent<{
  userId: string;
  oldPrimaryPhoneId?: string;
  newPrimaryPhoneId: string;
}>;

/**
 * ProviderLinked Event
 *
 * Disparado quando um novo provider OAuth é vinculado ao usuário.
 */
export type ProviderLinkedEvent = DomainEvent<{
  userId: string;
  providerId: string;
  provider: ProviderType;
  providerUserId: string;
  providerEmail?: string;
}>;

/**
 * ProviderUnlinked Event
 *
 * Disparado quando um provider OAuth é desvinculado do usuário.
 */
export type ProviderUnlinkedEvent = DomainEvent<{
  userId: string;
  providerId: string;
  provider: ProviderType;
}>;
