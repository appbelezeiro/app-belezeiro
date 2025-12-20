export class Slug {
  private constructor(private readonly _value: string) {}

  static create(value: string): Slug {
    const normalized = value.toLowerCase().trim();

    if (normalized.length === 0) {
      throw new Error('Slug cannot be empty');
    }

    if (normalized.length > 100) {
      throw new Error('Slug cannot exceed 100 characters');
    }

    const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!validSlugPattern.test(normalized)) {
      throw new Error(
        'Slug must contain only lowercase letters, numbers, and hyphens (no spaces)',
      );
    }

    return new Slug(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Slug): boolean {
    return this._value === other._value;
  }
}
