import { ValueObject } from './base/value-object';

export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Email inválido: ${email}`);
    this.name = 'InvalidEmailError';
  }
}

/**
 * Email Value Object
 *
 * Representa um endereço de email válido.
 * - Normalizado (lowercase e trimmed)
 * - Validação de formato
 * - Imutável
 */
export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    const normalized = value.toLowerCase().trim();

    if (!Email.isValid(normalized)) {
      throw new InvalidEmailError(value);
    }

    super(normalized);
  }

  private static isValid(email: string): boolean {
    if (!email || email.length === 0) {
      return false;
    }

    if (email.length > 255) {
      return false;
    }

    return Email.EMAIL_REGEX.test(email);
  }

  get value(): string {
    return this.props;
  }

  getDomain(): string {
    return this.value.split('@')[1];
  }

  getLocalPart(): string {
    return this.value.split('@')[0];
  }

  toPrimitive(): string {
    return this.value;
  }
}
