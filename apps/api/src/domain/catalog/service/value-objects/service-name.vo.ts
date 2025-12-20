export class ServiceName {
  private constructor(private readonly _value: string) {}

  static create(value: string): ServiceName {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new Error('Service name cannot be empty');
    }

    if (trimmed.length > 200) {
      throw new Error('Service name cannot exceed 200 characters');
    }

    return new ServiceName(trimmed);
  }

  get value(): string {
    return this._value;
  }

  equals(other: ServiceName): boolean {
    return this._value === other._value;
  }
}
