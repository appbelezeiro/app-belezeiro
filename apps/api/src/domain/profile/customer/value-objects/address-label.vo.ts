export class AddressLabel {
  private constructor(private readonly _value: string) {}

  static create(value: string): AddressLabel {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('Address label cannot be empty');
    }

    if (trimmed.length > 50) {
      throw new Error('Address label cannot exceed 50 characters');
    }

    return new AddressLabel(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: AddressLabel): boolean {
    return this._value === other._value;
  }
}
