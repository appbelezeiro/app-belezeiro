export class Price {
  private constructor(private readonly _value: number) {}

  static create(value: number): Price {
    if (value < 0) {
      throw new Error('Price cannot be negative');
    }

    return new Price(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: Price): boolean {
    return this._value === other._value;
  }
}
