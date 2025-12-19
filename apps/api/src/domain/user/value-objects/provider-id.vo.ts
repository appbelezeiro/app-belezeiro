import { ValueObject } from '../../value-objects/base/value-object';

export class InvalidProviderIdError extends Error {
  constructor() {
    super('ProviderId não pode ser vazio');
    this.name = 'InvalidProviderIdError';
  }
}

/**
 * ProviderId Value Object
 *
 * Representa o ID fornecido pelo provider OAuth (Google, Facebook, etc).
 * Ex: ID do Google, ID do Facebook
 */
export class ProviderId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidProviderIdError();
    }

    super(value.trim());
  }

  get value(): string {
    return this.props;
  }

  toPrimitive(): string {
    return this.value;
  }
}
