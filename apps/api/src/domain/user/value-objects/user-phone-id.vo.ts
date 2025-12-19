import { ValueObject } from '../../value-objects/base/value-object';

/**
 * UserPhoneId Value Object
 *
 * Representa o identificador único de um telefone de usuário.
 * Formato: phone_{uuid}
 */
export class UserPhoneId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserPhoneId não pode ser vazio');
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
