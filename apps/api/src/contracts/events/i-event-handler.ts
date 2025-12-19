import { DomainEvent } from '../../domain/events/base/domain-event';

export interface EventHandler<TEvent extends DomainEvent = DomainEvent> {
  /**
   * Identificador único do handler
   */
  readonly handlerId: string;

  /**
   * Tipos de eventos que este handler processa
   * Permite que um handler ouça múltiplos tipos de eventos
   */
  readonly eventTypes: string[];

  /**
   * Processa o evento
   * @throws Error se o processamento falhar (será retentado)
   */
  handle(event: TEvent): Promise<void>;
}
