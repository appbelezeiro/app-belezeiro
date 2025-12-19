import { ValueObject } from '../../value-objects/base/value-object';

/**
 * UserId Value Object
 *
 * Representa o identificador único de um usuário.
 * Formato: user_{uuid}
 *
 * Nota: O ID é gerado automaticamente pelo BaseEntity
 * através do IdGenerator configurado. Este VO é apenas
 * um wrapper type-safe para o ID.
 */
export class UserId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('UserId não pode ser vazio');
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
