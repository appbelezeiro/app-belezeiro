export class DisplayName {
  private constructor(private readonly _value: string) {}

  static create(value: string): DisplayName {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('Display name cannot be empty');
    }

    if (trimmed.length > 100) {
      throw new Error('Display name cannot exceed 100 characters');
    }

    return new DisplayName(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: DisplayName): boolean {
    return this._value === other._value;
  }
}
