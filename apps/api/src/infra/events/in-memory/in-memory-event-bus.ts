import { DomainEvent } from '../../../domain/events/base/domain-event';
import { EventBus } from '../../../contracts/events/event-bus';
import { FanOutProcessor } from '../fan-out-processor';

/**
 * Implementação in-memory do EventBus
 *
 * Útil para:
 * - Testes unitários e de integração
 * - Desenvolvimento local
 * - Processamento síncrono (quando desejado)
 */
export class InMemoryEventBus implements EventBus {
  private publishedEvents: DomainEvent[] = [];
  private processor?: FanOutProcessor;

  /**
   * Se um processor for configurado, os eventos serão
   * processados sincronamente ao serem publicados
   */
  setProcessor(processor: FanOutProcessor): void {
    this.processor = processor;
  }

  async publish(event: DomainEvent): Promise<void> {
    this.publishedEvents.push(event);

    if (this.processor) {
      await this.processor.process(event);
    }
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    this.publishedEvents.push(...events);

    if (this.processor) {
      for (const event of events) {
        await this.processor.process(event);
      }
    }
  }

  /**
   * Retorna todos os eventos publicados (útil para testes)
   */
  getPublishedEvents(): DomainEvent[] {
    return [...this.publishedEvents];
  }

  /**
   * Retorna eventos de um tipo específico (útil para testes)
   */
  getEventsByType(eventType: string): DomainEvent[] {
    return this.publishedEvents.filter((e) => e.eventType === eventType);
  }

  /**
   * Limpa os eventos publicados (útil para testes)
   */
  clear(): void {
    this.publishedEvents = [];
  }
}
