import { ValueObject } from './base/value-object';

export class InvalidPhoneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPhoneError';
  }
}

interface PhoneProps {
  countryCode: string;
  areaCode: string;
  number: string;
}

/**
 * Phone Value Object
 *
 * Suporta telefones brasileiros e internacionais.
 * - Aceita string ou number (formatado ou não)
 * - Detecta formato brasileiro vs internacional
 * - Valida formato
 * - Imutável
 */
export class Phone extends ValueObject<PhoneProps> {
  /**
   * Factory principal - aceita qualquer formato
   * @param input - Telefone em qualquer formato (string ou number)
   */
  static create(input: string | number): Phone {
    const cleaned = String(input).replace(/\D/g, '');

    // Formato brasileiro: 11 dígitos (DDD + número)
    if (cleaned.length === 11) {
      return Phone.fromBrazilian(cleaned);
    }

    // Formato internacional: 12+ dígitos (inclui código do país)
    if (cleaned.length >= 12) {
      return Phone.fromInternational(cleaned);
    }

    throw new InvalidPhoneError(`Formato inválido: ${input}. Esperado 11+ dígitos`);
  }

  /**
   * Cria Phone a partir de formato brasileiro: DDD + número
   * Exemplo: 11999999999
   */
  static fromBrazilian(input: string): Phone {
    const cleaned = input.replace(/\D/g, '');

    if (cleaned.length !== 11) {
      throw new InvalidPhoneError('Telefone brasileiro deve ter 11 dígitos (DDD + número)');
    }

    const areaCode = cleaned.substring(0, 2);
    const number = cleaned.substring(2);

    // Validar DDD (genérico - 2 dígitos)
    if (!/^\d{2}$/.test(areaCode)) {
      throw new InvalidPhoneError('DDD inválido');
    }

    // Validar número (9 dígitos começando com 9)
    if (!/^9\d{8}$/.test(number)) {
      throw new InvalidPhoneError('Número deve ter 9 dígitos e começar com 9');
    }

    return new Phone({
      countryCode: '+55',
      areaCode,
      number,
    });
  }

  /**
   * Cria Phone a partir de formato internacional
   * Exemplo: +5511999999999 ou 5511999999999
   */
  static fromInternational(input: string): Phone {
    const cleaned = input.replace(/\D/g, '');

    if (cleaned.length < 12) {
      throw new InvalidPhoneError('Telefone internacional deve ter 12+ dígitos');
    }

    // Assumir que primeiros 2-3 dígitos são código do país
    // Para Brasil: 55
    const countryCode = cleaned.startsWith('55') ? '+55' : `+${cleaned.substring(0, 2)}`;
    const remaining = countryCode === '+55' ? cleaned.substring(2) : cleaned.substring(2);

    if (remaining.length < 10) {
      throw new InvalidPhoneError('Número internacional inválido');
    }

    const areaCode = remaining.substring(0, 2);
    const number = remaining.substring(2);

    return new Phone({
      countryCode,
      areaCode,
      number,
    });
  }

  get countryCode(): string {
    return this.props.countryCode;
  }

  get areaCode(): string {
    return this.props.areaCode;
  }

  get number(): string {
    return this.props.number;
  }

  /**
   * Formato: +55 (11) 99999-9999
   */
  toFormatted(): string {
    const part1 = this.number.substring(0, 5);
    const part2 = this.number.substring(5);
    return `${this.countryCode} (${this.areaCode}) ${part1}-${part2}`;
  }

  /**
   * Formato: +5511999999999
   */
  toInternational(): string {
    return `${this.countryCode}${this.areaCode}${this.number}`;
  }

  /**
   * Formato: 11999999999 (sem código do país)
   */
  toNational(): string {
    return `${this.areaCode}${this.number}`;
  }

  toPrimitive(): PhoneProps {
    return {
      countryCode: this.countryCode,
      areaCode: this.areaCode,
      number: this.number,
    };
  }
}
