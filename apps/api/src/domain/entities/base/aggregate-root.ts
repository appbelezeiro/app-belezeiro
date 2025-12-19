import { BaseEntity, BaseEntityProps } from './base-entity';

/**
 * Aggregate Root - Raiz de um agregado DDD
 *
 * Use esta classe para entidades que são raízes de agregados.
 * Agregados são clusters de entidades e value objects que são
 * tratados como uma unidade para mudanças de dados.
 *
 * Regras:
 * - Apenas a raiz do agregado pode ser referenciada externamente
 * - Entidades internas só podem ser acessadas através da raiz
 * - Invariantes do agregado são garantidas pela raiz
 */
export abstract class AggregateRoot<
  TProps extends BaseEntityProps = BaseEntityProps,
> extends BaseEntity<TProps> {
  /**
   * Retorna o nome do tipo do agregado.
   * Usado para identificar o tipo em eventos de domínio.
   */
  abstract get aggregateType(): string;

  /**
   * Helper para criar eventos com aggregateType preenchido
   */
  protected raiseEvent<TPayload>(
    eventType: string,
    payload: TPayload,
    metadata?: { correlationId?: string; causationId?: string; userId?: string },
  ): void {
    this.raise({
      eventType,
      aggregateId: this.id,
      aggregateType: this.aggregateType,
      payload,
      metadata,
    });
  }
}
