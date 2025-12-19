import { DomainEvent } from '../../../domain/events/base/domain-event';
import { EventBus } from '../../../contracts/events/event-bus';

/**
 * Tipo do binding da Cloudflare Queue
 * Será injetado pelo Cloudflare Workers runtime
 */
export interface CloudflareQueue {
  send(message: unknown): Promise<void>;
  sendBatch(messages: { body: unknown }[]): Promise<void>;
}

/**
 * Implementação do EventBus usando Cloudflare Queues
 */
export class CloudflareEventBus implements EventBus {
  constructor(private readonly queue: CloudflareQueue) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.queue.send(this.serialize(event));
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const messages = events.map((event) => ({
      body: this.serialize(event),
    }));

    await this.queue.sendBatch(messages);
  }

  private serialize(event: DomainEvent): unknown {
    return {
      ...event,
      occurredAt: event.occurredAt.toISOString(),
    };
  }
}
