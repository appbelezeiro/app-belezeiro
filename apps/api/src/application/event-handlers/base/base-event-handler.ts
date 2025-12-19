import { DomainEvent } from '../../../domain/events/base/domain-event';
import { EventHandler } from '../../../contracts/events/event-handler';

/**
 * Classe base para Event Handlers
 *
 * Fornece estrutura comum para handlers de eventos,
 * incluindo logging e tratamento de erros.
 */
export abstract class BaseEventHandler<TEvent extends DomainEvent = DomainEvent>
  implements EventHandler<TEvent>
{
  abstract readonly handlerId: string;
  abstract readonly eventTypes: string[];

  async handle(event: TEvent): Promise<void> {
    try {
      await this.process(event);
    } catch (error) {
      // Re-throw para que o sistema de retry funcione
      throw error;
    }
  }

  /**
   * Implementar a lógica de processamento do evento
   */
  protected abstract process(event: TEvent): Promise<void>;
}
