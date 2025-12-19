import { BaseEntity } from '../../domain/entities/base/base-entity';
import { EventBus } from '../../contracts/events/event-bus';

/**
 * Event Dispatcher
 *
 * Responsável por extrair eventos de entidades/agregados
 * e publicá-los no barramento de eventos.
 *
 * Deve ser chamado após o commit da transação do banco.
 */
export class EventDispatcher {
  constructor(private readonly eventBus: EventBus) {}

  /**
   * Extrai e publica eventos de uma entidade
   */
  async dispatchFromEntity(entity: BaseEntity): Promise<void> {
    const events = entity.pullEvents();

    if (events.length === 0) {
      return;
    }

    await this.eventBus.publishBatch(events);
  }

  /**
   * Extrai e publica eventos de múltiplas entidades
   */
  async dispatchFromEntities(entities: BaseEntity[]): Promise<void> {
    const allEvents = entities.flatMap((entity) => entity.pullEvents());

    if (allEvents.length === 0) {
      return;
    }

    await this.eventBus.publishBatch(allEvents);
  }
}
