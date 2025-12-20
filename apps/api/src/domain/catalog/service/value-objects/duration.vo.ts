export class Duration {
  private constructor(private readonly _value: number) {}

  static create(value: number): Duration {
    if (value <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    return new Duration(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: Duration): boolean {
    return this._value === other._value;
  }
}
