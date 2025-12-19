import { ValueObject } from '../../value-objects/base/value-object';

export class InvalidUserNameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidUserNameError';
  }
}

/**
 * UserName Value Object
 *
 * Representa o nome completo de um usuário.
 * - Tamanho: 2-100 caracteres
 * - Caracteres válidos: letras, espaços, hífens, apóstrofos
 * - Suporta caracteres acentuados
 * - Imutável
 */
export class UserName extends ValueObject<string> {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;
  private static readonly VALID_PATTERN = /^[a-zA-ZÀ-ÿ\s'-]+$/u;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length < UserName.MIN_LENGTH || trimmed.length > UserName.MAX_LENGTH) {
      throw new InvalidUserNameError(
        `Nome deve ter entre ${UserName.MIN_LENGTH} e ${UserName.MAX_LENGTH} caracteres`,
      );
    }

    if (!UserName.VALID_PATTERN.test(trimmed)) {
      throw new InvalidUserNameError('Nome contém caracteres inválidos');
    }

    super(trimmed);
  }

  get value(): string {
    return this.props;
  }

  /**
   * Retorna o primeiro nome
   * Ex: "João Silva" -> "João"
   */
  getFirstName(): string {
    return this.value.split(' ')[0];
  }

  /**
   * Retorna o último nome
   * Ex: "João Pedro Silva" -> "Silva"
   */
  getLastName(): string {
    const parts = this.value.split(' ');
    return parts[parts.length - 1];
  }

  /**
   * Retorna as iniciais (até 2 caracteres)
   * Ex: "João Silva" -> "JS"
   */
  getInitials(): string {
    return this.value
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  toPrimitive(): string {
    return this.value;
  }
}
