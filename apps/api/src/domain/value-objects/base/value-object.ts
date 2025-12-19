/**
 * Value Object base class
 *
 * Value Objects são objetos imutáveis que representam um conceito
 * do domínio e são comparados por seus valores, não por identidade.
 *
 * Exemplos: Email, Phone, Address, Money
 */
export abstract class ValueObject<TProps> {
  protected readonly props: TProps;

  constructor(props: TProps) {
    this.props = Object.freeze(props);
  }

  equals(other: ValueObject<TProps>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (other.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  /**
   * Retorna uma representação primitiva do value object
   */
  abstract toPrimitive(): unknown;
}
