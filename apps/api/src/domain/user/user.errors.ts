import { DomainError } from '../errors/base/domain-error';

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';

  constructor(userId?: string) {
    super(userId ? `Usuário não encontrado: ${userId}` : 'Usuário não encontrado');
    this.name = 'UserNotFoundError';
  }
}

export class UserDeletedError extends DomainError {
  readonly code = 'USER_DELETED';

  constructor(userId: string) {
    super(`Usuário foi deletado: ${userId}`);
    this.name = 'UserDeletedError';
  }
}

export class EmailAlreadyExistsError extends DomainError {
  readonly code = 'EMAIL_ALREADY_EXISTS';

  constructor(email: string) {
    super(`Email já está em uso: ${email}`);
    this.name = 'EmailAlreadyExistsError';
  }
}

export class DocumentAlreadySetError extends DomainError {
  readonly code = 'DOCUMENT_ALREADY_SET';

  constructor() {
    super('Documento (CPF/CNPJ) já foi definido e não pode ser alterado');
    this.name = 'DocumentAlreadySetError';
  }
}

export class CannotRemoveLastProviderError extends DomainError {
  readonly code = 'CANNOT_REMOVE_LAST_PROVIDER';

  constructor() {
    super('Não é possível remover o último provider do usuário');
    this.name = 'CannotRemoveLastProviderError';
  }
}

export class ProviderAlreadyLinkedError extends DomainError {
  readonly code = 'PROVIDER_ALREADY_LINKED';

  constructor(provider: string) {
    super(`Provider já está vinculado: ${provider}`);
    this.name = 'ProviderAlreadyLinkedError';
  }
}

export class ProviderNotFoundError extends DomainError {
  readonly code = 'PROVIDER_NOT_FOUND';

  constructor(provider: string) {
    super(`Provider não encontrado: ${provider}`);
    this.name = 'ProviderNotFoundError';
  }
}

export class PhoneNotFoundError extends DomainError {
  readonly code = 'PHONE_NOT_FOUND';

  constructor(phoneId: string) {
    super(`Telefone não encontrado: ${phoneId}`);
    this.name = 'PhoneNotFoundError';
  }
}

export class CannotRestoreUserError extends DomainError {
  readonly code = 'CANNOT_RESTORE_USER';

  constructor(message: string) {
    super(message);
    this.name = 'CannotRestoreUserError';
  }
}
