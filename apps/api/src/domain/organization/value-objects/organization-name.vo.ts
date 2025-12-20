export class OrganizationName {
  private constructor(private readonly _value: string) {}

  static create(value: string): OrganizationName {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('Organization name cannot be empty');
    }

    if (trimmed.length > 200) {
      throw new Error('Organization name cannot exceed 200 characters');
    }

    return new OrganizationName(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: OrganizationName): boolean {
    return this._value === other._value;
  }
}
