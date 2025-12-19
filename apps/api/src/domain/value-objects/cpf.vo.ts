import { ValueObject } from './base/value-object';

export class InvalidCPFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCPFError';
  }
}

interface CPFProps {
  value: string;
}

/**
 * CPF Value Object
 *
 * Representa um CPF brasileiro válido.
 * - Validação de dígitos verificadores
 * - Formatação (###.###.###-##)
 * - Imutável
 */
export class CPF extends ValueObject<CPFProps> {
  private constructor(value: string) {
    const cleaned = value.replace(/\D/g, '');

    if (!CPF.isValid(cleaned)) {
      throw new InvalidCPFError('CPF inválido');
    }

    super({ value: cleaned });
  }

  /**
   * Cria CPF a partir de string
   */
  static create(value: string): CPF {
    return new CPF(value);
  }

  private static isValid(cpf: string): boolean {
    if (cpf.length !== 11) {
      return false;
    }

    // Rejeita CPFs conhecidos como inválidos (todos dígitos iguais)
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(9))) {
      return false;
    }

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpf.charAt(10))) {
      return false;
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Retorna CPF formatado: 123.456.789-09
   */
  toFormatted(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  toPrimitive(): string {
    return this.value;
  }
}
