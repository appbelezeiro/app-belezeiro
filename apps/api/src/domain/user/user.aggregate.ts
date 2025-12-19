import { AggregateRoot, BaseEntityProps } from '../entities/base/aggregate-root';
import { Email } from '../value-objects/email.vo';
import { Phone } from '../value-objects/phone.vo';
import { Document } from '../value-objects/document.vo';
import { URLAddress } from '../value-objects/url-address.vo';
import { UserId, UserName, Gender, UserPhoneId, ProviderId } from './value-objects';
import { UserPhone } from './user-phone.entity';
import { UserProvider, ProviderType } from './user-provider.entity';
import {
  UserDeletedError,
  DocumentAlreadySetError,
  CannotRemoveLastProviderError,
  ProviderAlreadyLinkedError,
  ProviderNotFoundError,
  PhoneNotFoundError,
  CannotRestoreUserError,
} from './user.errors';

export interface UserProps extends BaseEntityProps {
  userId: UserId;
  email: Email | null;
  name: UserName;
  document?: Document;
  birthDate?: Date;
  gender?: Gender;
  photoUrl?: URLAddress;
  phones: UserPhone[];
  providers: UserProvider[];
  onboardingCompleted: boolean;
  emailBeforeDeletion?: Email;
  deletedAt?: Date;
}

/**
 * User Aggregate Root
 *
 * Raiz do agregado User no Identity Context.
 *
 * Invariantes:
 * - Email é obrigatório (exceto quando deletado)
 * - Document é imutável após primeira definição
 * - User deve ter pelo menos 1 provider sempre
 * - Não pode ter 2 providers do mesmo tipo
 * - Apenas 1 phone pode ser primary
 * - User deletado não pode ser modificado
 * - Onboarding só pode ser completo uma vez
 */
export class User extends AggregateRoot<UserProps> {
  get aggregateType(): string {
    return 'User';
  }

  protected prefix(): string {
    return 'user';
  }

  private constructor(props: UserProps) {
    super(props);
  }

  // ═══════════════════════════════════════════════════════════════
  // Factory Methods
  // ═══════════════════════════════════════════════════════════════

  /**
   * Cria um novo usuário
   */
  static create(data: {
    email: Email;
    name: UserName;
    photoUrl?: URLAddress;
    provider: ProviderType;
    providerId: ProviderId;
    providerEmail?: Email;
  }): User {
    const userId = new UserId('');  // Será gerado pelo BaseEntity

    const user = new User({
      userId,
      email: data.email,
      name: data.name,
      photoUrl: data.photoUrl,
      phones: [],
      providers: [],
      onboardingCompleted: false,
    });

    // Adicionar provider inicial
    const provider = UserProvider.create({
      userId: new UserId(user.id),  // Agora temos o ID gerado
      provider: data.provider,
      providerId: data.providerId,
      providerEmail: data.providerEmail,
    });

    user.props.providers.push(provider);
    user.props.userId = new UserId(user.id);  // Atualizar com o ID correto

    // Disparar evento
    user.raise({
      eventType: 'user.created',
      aggregateId: user.id,
      aggregateType: 'User',
      payload: {
        userId: user.id,
        email: data.email.value,
        name: data.name.value,
        provider: data.provider,
      },
    });

    return user;
  }

  /**
   * Reconstitui um usuário a partir de dados persistidos
   */
  static reconstitute(data: {
    id: string;
    email: Email | null;
    name: UserName;
    document?: Document;
    birthDate?: Date;
    gender?: Gender;
    photoUrl?: URLAddress;
    phones: UserPhone[];
    providers: UserProvider[];
    onboardingCompleted: boolean;
    emailBeforeDeletion?: Email;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }): User {
    return new User({
      id: data.id,
      userId: new UserId(data.id),
      email: data.email,
      name: data.name,
      document: data.document,
      birthDate: data.birthDate,
      gender: data.gender,
      photoUrl: data.photoUrl,
      phones: data.phones,
      providers: data.providers,
      onboardingCompleted: data.onboardingCompleted,
      emailBeforeDeletion: data.emailBeforeDeletion,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // Getters
  // ═══════════════════════════════════════════════════════════════

  get userId(): UserId {
    return this.props.userId;
  }

  get email(): Email | null {
    return this.props.email;
  }

  get name(): UserName {
    return this.props.name;
  }

  get document(): Document | undefined {
    return this.props.document;
  }

  get birthDate(): Date | undefined {
    return this.props.birthDate;
  }

  get gender(): Gender | undefined {
    return this.props.gender;
  }

  get photoUrl(): URLAddress | undefined {
    return this.props.photoUrl;
  }

  get phones(): readonly UserPhone[] {
    return this.props.phones;
  }

  get providers(): readonly UserProvider[] {
    return this.props.providers;
  }

  get onboardingCompleted(): boolean {
    return this.props.onboardingCompleted;
  }

  get emailBeforeDeletion(): Email | undefined {
    return this.props.emailBeforeDeletion;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  // ═══════════════════════════════════════════════════════════════
  // Guards
  // ═══════════════════════════════════════════════════════════════

  isDeleted(): boolean {
    return this.deletedAt !== undefined;
  }

  private ensureNotDeleted(): void {
    if (this.isDeleted()) {
      throw new UserDeletedError(this.id);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Update Methods
  // ═══════════════════════════════════════════════════════════════

  updateName(name: UserName): void {
    this.ensureNotDeleted();

    const oldName = this.props.name.value;
    this.props.name = name;
    this.touch();

    this.raise({
      eventType: 'user.name.updated',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        oldName,
        newName: name.value,
      },
    });
  }

  updateBirthDate(date: Date): void {
    this.ensureNotDeleted();

    this.props.birthDate = date;
    this.touch();
  }

  updateGender(gender: Gender): void {
    this.ensureNotDeleted();

    this.props.gender = gender;
    this.touch();
  }

  updatePhotoUrl(url: URLAddress): void {
    this.ensureNotDeleted();

    this.props.photoUrl = url;
    this.touch();

    this.raise({
      eventType: 'user.photo.updated',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        photoUrl: url.value,
      },
    });
  }

  /**
   * Define o documento (CPF/CNPJ) uma única vez.
   * Imutável após set.
   */
  setDocument(document: Document): void {
    this.ensureNotDeleted();

    if (this.props.document) {
      throw new DocumentAlreadySetError();
    }

    this.props.document = document;
    this.touch();

    this.raise({
      eventType: 'user.document.set',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        documentType: document.type,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // Phone Methods
  // ═══════════════════════════════════════════════════════════════

  addPhone(phone: Phone, label: string, isWhatsApp: boolean): void {
    this.ensureNotDeleted();

    const isPrimary = this.props.phones.length === 0;  // Primeiro phone é primary

    const userPhone = UserPhone.create({
      userId: this.userId,
      phone,
      label,
      isPrimary,
      isWhatsApp,
    });

    this.props.phones.push(userPhone);
    this.touch();

    this.raise({
      eventType: 'user.phone.added',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        phoneId: userPhone.id,
        phone: phone.toInternational(),
        isPrimary,
      },
    });
  }

  removePhone(phoneId: UserPhoneId): void {
    this.ensureNotDeleted();

    const phoneIndex = this.props.phones.findIndex((p) => p.id === phoneId.value);

    if (phoneIndex === -1) {
      throw new PhoneNotFoundError(phoneId.value);
    }

    this.props.phones.splice(phoneIndex, 1);
    this.touch();

    this.raise({
      eventType: 'user.phone.removed',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        phoneId: phoneId.value,
      },
    });
  }

  setPrimaryPhone(phoneId: UserPhoneId): void {
    this.ensureNotDeleted();

    const phone = this.props.phones.find((p) => p.id === phoneId.value);

    if (!phone) {
      throw new PhoneNotFoundError(phoneId.value);
    }

    // Encontrar phone primário atual
    const oldPrimary = this.props.phones.find((p) => p.isPrimary);

    // Desmarcar todos
    this.props.phones.forEach((p) => p.unmarkPrimary());

    // Marcar novo primary
    phone.markAsPrimary();
    this.touch();

    this.raise({
      eventType: 'user.phone.primary_changed',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        oldPrimaryPhoneId: oldPrimary?.id,
        newPrimaryPhoneId: phoneId.value,
      },
    });
  }

  updatePhoneLabel(phoneId: UserPhoneId, label: string): void {
    this.ensureNotDeleted();

    const phone = this.props.phones.find((p) => p.id === phoneId.value);

    if (!phone) {
      throw new PhoneNotFoundError(phoneId.value);
    }

    phone.updateLabel(label);
    this.touch();
  }

  // ═══════════════════════════════════════════════════════════════
  // Provider Methods
  // ═══════════════════════════════════════════════════════════════

  linkProvider(
    provider: ProviderType,
    providerId: ProviderId,
    providerEmail?: Email,
  ): void {
    this.ensureNotDeleted();

    // Não pode ter 2 providers do mesmo tipo
    const existingProvider = this.props.providers.find((p) => p.provider === provider);

    if (existingProvider) {
      throw new ProviderAlreadyLinkedError(provider);
    }

    const userProvider = UserProvider.create({
      userId: this.userId,
      provider,
      providerId,
      providerEmail,
    });

    this.props.providers.push(userProvider);
    this.touch();

    this.raise({
      eventType: 'user.provider.linked',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        provider,
        providerId: providerId.value,
      },
    });
  }

  unlinkProvider(provider: ProviderType): void {
    this.ensureNotDeleted();

    // Não pode remover o último provider
    if (this.props.providers.length === 1) {
      throw new CannotRemoveLastProviderError();
    }

    const providerIndex = this.props.providers.findIndex((p) => p.provider === provider);

    if (providerIndex === -1) {
      throw new ProviderNotFoundError(provider);
    }

    this.props.providers.splice(providerIndex, 1);
    this.touch();

    this.raise({
      eventType: 'user.provider.unlinked',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        provider,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // Lifecycle Methods
  // ═══════════════════════════════════════════════════════════════

  completeOnboarding(): void {
    this.ensureNotDeleted();

    if (this.props.onboardingCompleted) {
      console.warn(
        `Tentativa de completar onboarding para usuário ${this.id} que já completou. Operação ignorada.`,
      );
      return;  // Idempotente
    }

    this.props.onboardingCompleted = true;
    this.touch();

    this.raise({
      eventType: 'user.onboarding.completed',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        completedAt: new Date(),
      },
    });
  }

  softDelete(): void {
    this.ensureNotDeleted();

    this.props.deletedAt = new Date();
    this.props.emailBeforeDeletion = this.props.email!;
    this.props.email = null;  // Liberar email
    this.touch();

    this.raise({
      eventType: 'user.deleted',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        deletedAt: this.props.deletedAt,
      },
    });
  }

  restore(withinDays: number = 30): void {
    if (!this.isDeleted()) {
      return;  // Já não está deletado
    }

    const daysSinceDeletion =
      (Date.now() - this.deletedAt!.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceDeletion > withinDays) {
      throw new CannotRestoreUserError(
        `Não é possível restaurar usuário deletado há mais de ${withinDays} dias`,
      );
    }

    this.props.email = this.props.emailBeforeDeletion!;
    this.props.emailBeforeDeletion = undefined;
    this.props.deletedAt = undefined;
    this.touch();

    this.raise({
      eventType: 'user.restored',
      aggregateId: this.id,
      aggregateType: 'User',
      payload: {
        userId: this.id,
        restoredAt: new Date(),
      },
    });
  }
}
