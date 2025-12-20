export class CNPJ {
  private constructor(private readonly _value: string) {}

  static create(value: string): CNPJ {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length !== 14) {
      throw new Error('CNPJ must have 14 digits');
    }

    if (!CNPJ.isValid(cleaned)) {
      throw new Error('Invalid CNPJ');
    }

    return new CNPJ(cleaned);
  }

  private static isValid(cnpj: string): boolean {
    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }

  get value(): string {
    return this._value;
  }

  toFormatted(): string {
    return this._value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5',
    );
  }

  equals(other: CNPJ): boolean {
    return this._value === other._value;
  }
}
