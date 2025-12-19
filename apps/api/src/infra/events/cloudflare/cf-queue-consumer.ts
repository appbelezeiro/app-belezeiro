import { DomainEvent } from '../../../domain/events/base/domain-event';
import { FanOutProcessor, ProcessResult } from '../fan-out-processor';
import { getRetryDelay, queuesConfig } from './cf-queues.config';
import { CloudflareQueue } from './cf-event-bus';

/**
 * Interface para mensagem da Cloudflare Queue
 */
export interface QueueMessage<T = unknown> {
  readonly id: string;
  readonly body: T;
  readonly timestamp: Date;
  readonly attempts: number;
  ack(): void;
  retry(options?: { delaySeconds?: number }): void;
}

/**
 * Interface para batch de mensagens
 */
export interface MessageBatch<T = unknown> {
  readonly queue: string;
  readonly messages: QueueMessage<T>[];
  ackAll(): void;
  retryAll(options?: { delaySeconds?: number }): void;
}

interface SerializedEvent extends Omit<DomainEvent, 'occurredAt'> {
  occurredAt: string;
}

/**
 * Consumer de eventos da Cloudflare Queue
 *
 * Processa eventos usando o FanOutProcessor e gerencia
 * retries e dead-letter queue.
 */
export class CloudflareQueueConsumer {
  constructor(
    private readonly processor: FanOutProcessor,
    private readonly dlqQueue?: CloudflareQueue,
  ) {}

  /**
   * Processa um batch de mensagens
   * Este método é chamado pelo Cloudflare Worker
   */
  async consume(batch: MessageBatch<SerializedEvent>): Promise<void> {
    for (const message of batch.messages) {
      await this.processMessage(message);
    }
  }

  private async processMessage(message: QueueMessage<SerializedEvent>): Promise<void> {
    const event = this.deserialize(message.body);
    const result = await this.processor.process(event);

    if (!result.hasFailures) {
      message.ack();
      return;
    }

    // Se ainda tem retries disponíveis
    if (message.attempts < queuesConfig.main.maxRetries) {
      const delay = getRetryDelay(message.attempts);
      message.retry({ delaySeconds: delay });
      return;
    }

    // Esgotou retries - envia para DLQ
    await this.sendToDlq(event, result);
    message.ack();
  }

  private async sendToDlq(event: DomainEvent, result: ProcessResult): Promise<void> {
    if (!this.dlqQueue) {
      console.error('[DLQ] No DLQ configured. Event lost:', event.eventId);
      return;
    }

    await this.dlqQueue.send({
      event,
      failedAt: new Date().toISOString(),
      failures: result.results
        .filter((r) => !r.success)
        .map((r) => ({
          handlerId: r.handlerId,
          error: r.error?.message,
        })),
    });
  }

  private deserialize(data: SerializedEvent): DomainEvent {
    return {
      ...data,
      occurredAt: new Date(data.occurredAt),
    };
  }
}
