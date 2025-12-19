import { DomainEvent } from '../../domain/events/base/domain-event';

export interface EventBus {
  /**
   * Publica um único evento na fila
   */
  publish(event: DomainEvent): Promise<void>;

  /**
   * Publica múltiplos eventos na fila (batch)
   */
  publishBatch(events: DomainEvent[]): Promise<void>;
}

export const EVENT_BUS = Symbol('EventBus');
