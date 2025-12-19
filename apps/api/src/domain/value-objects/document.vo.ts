import { ValueObject } from './base/value-object';

export class InvalidDocumentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDocumentError';
  }
}

export enum DocumentType {
  CPF = 'cpf',
  CNPJ = 'cnpj',
}

interface DocumentProps {
  value: string;
  type: DocumentType;
}

/**
 * Document Value Object
 *
 * Suporta CPF e CNPJ brasileiros.
 * - Validação de dígitos verificadores
 * - Formatação
 * - Imutável
 */
export class Document extends ValueObject<DocumentProps> {
  private constructor(value: string, type: DocumentType) {
    const cleaned = value.replace(/\D/g, '');

    if (type === DocumentType.CPF && !Document.isValidCPF(cleaned)) {
      throw new InvalidDocumentError('CPF inválido');
    }

    if (type === DocumentType.CNPJ && !Document.isValidCNPJ(cleaned)) {
      throw new InvalidDocumentError('CNPJ inválido');
    }

    super({ value: cleaned, type });
  }

  /**
   * Cria Document a partir de CPF
   */
  static fromCPF(value: string): Document {
    return new Document(value, DocumentType.CPF);
  }

  /**
   * Cria Document a partir de CNPJ
   */
  static fromCNPJ(value: string): Document {
    return new Document(value, DocumentType.CNPJ);
  }

  /**
   * Factory automático - detecta CPF ou CNPJ pelo tamanho
   */
  static create(value: string): Document {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 11) {
      return Document.fromCPF(cleaned);
    }

    if (cleaned.length === 14) {
      return Document.fromCNPJ(cleaned);
    }

    throw new InvalidDocumentError('Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos');
  }

  private static isValidCPF(cpf: string): boolean {
    if (cpf.length !== 11) {
      return false;
    }

    // Rejeita CPFs conhecidos como inválidos
    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    // Validação dos dígitos verificadores
    let sum = 0;
    let remainder: number;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(9, 10))) {
      return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }

    if (remainder !== parseInt(cpf.substring(10, 11))) {
      return false;
    }

    return true;
  }

  private static isValidCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14) {
      return false;
    }

    // Rejeita CNPJs conhecidos como inválidos
    if (/^(\d)\1{13}$/.test(cnpj)) {
      return false;
    }

    // Validação do primeiro dígito verificador
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) {
      return false;
    }

    // Validação do segundo dígito verificador
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) {
      return false;
    }

    return true;
  }

  get value(): string {
    return this.props.value;
  }

  get type(): DocumentType {
    return this.props.type;
  }

  isCPF(): boolean {
    return this.type === DocumentType.CPF;
  }

  isCNPJ(): boolean {
    return this.type === DocumentType.CNPJ;
  }

  /**
   * Retorna documento formatado
   * CPF: 123.456.789-09
   * CNPJ: 12.345.678/0001-09
   */
  toFormatted(): string {
    if (this.isCPF()) {
      return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    return this.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  toPrimitive(): DocumentProps {
    return {
      value: this.value,
      type: this.type,
    };
  }
}
