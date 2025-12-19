import { ValueObject } from './base/value-object';

export class InvalidURLError extends Error {
  constructor(url: string) {
    super(`URL inválida: ${url}`);
    this.name = 'InvalidURLError';
  }
}

/**
 * URLAddress Value Object
 *
 * Representa uma URL válida.
 * - Validação de formato
 * - Imutável
 */
export class URLAddress extends ValueObject<string> {
  constructor(value: string) {
    if (!URLAddress.isValid(value)) {
      throw new InvalidURLError(value);
    }

    super(value);
  }

  private static isValid(url: string): boolean {
    if (!url || url.trim().length === 0) {
      return false;
    }

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  get value(): string {
    return this.props;
  }

  getProtocol(): string {
    return new URL(this.value).protocol;
  }

  getHostname(): string {
    return new URL(this.value).hostname;
  }

  getPathname(): string {
    return new URL(this.value).pathname;
  }

  toPrimitive(): string {
    return this.value;
  }
}
