import { ValueObject } from '../../value-objects/base/value-object';

export class InvalidGenderError extends Error {
  constructor(value: string) {
    super(`Gênero inválido: ${value}`);
    this.name = 'InvalidGenderError';
  }
}

export enum GenderType {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

/**
 * Gender Value Object
 *
 * Representa o gênero de um usuário.
 * - Valores permitidos: male, female, other, prefer_not_to_say
 * - LGPD compliance (opcional)
 * - Imutável
 */
export class Gender extends ValueObject<GenderType> {
  constructor(value: GenderType | string) {
    const normalized = value.toLowerCase() as GenderType;

    if (!Object.values(GenderType).includes(normalized)) {
      throw new InvalidGenderError(value);
    }

    super(normalized);
  }

  static male(): Gender {
    return new Gender(GenderType.MALE);
  }

  static female(): Gender {
    return new Gender(GenderType.FEMALE);
  }

  static other(): Gender {
    return new Gender(GenderType.OTHER);
  }

  static preferNotToSay(): Gender {
    return new Gender(GenderType.PREFER_NOT_TO_SAY);
  }

  get value(): GenderType {
    return this.props;
  }

  toDisplayString(): string {
    const labels: Record<GenderType, string> = {
      [GenderType.MALE]: 'Masculino',
      [GenderType.FEMALE]: 'Feminino',
      [GenderType.OTHER]: 'Outro',
      [GenderType.PREFER_NOT_TO_SAY]: 'Prefiro não informar',
    };

    return labels[this.value];
  }

  toPrimitive(): string {
    return this.value;
  }
}
