export class YearsOfExperience {
  private constructor(private readonly _value: number) {}

  static create(value: number): YearsOfExperience {
    if (value < 0) {
      throw new Error('Years of experience cannot be negative');
    }

    if (value > 100) {
      throw new Error('Years of experience cannot exceed 100');
    }

    return new YearsOfExperience(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: YearsOfExperience): boolean {
    return this._value === other._value;
  }
}
