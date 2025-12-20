export class SpecialtyName {
  private constructor(private readonly _value: string) {}

  static create(value: string): SpecialtyName {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('Specialty name cannot be empty');
    }

    if (trimmed.length > 100) {
      throw new Error('Specialty name cannot exceed 100 characters');
    }

    return new SpecialtyName(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: SpecialtyName): boolean {
    return this._value === other._value;
  }
}
