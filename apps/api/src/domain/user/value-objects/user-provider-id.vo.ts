import { ValueObject } from '../../value-objects/base/value-object';

/**
 * UserProviderId Value Object
 *
 * Representa o identificador único de um provider de usuário.
 * Formato: prov_{uuid}
 */
export class UserProviderId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserProviderId não pode ser vazio');
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
