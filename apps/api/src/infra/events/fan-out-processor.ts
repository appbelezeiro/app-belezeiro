import { DomainEvent } from '../../domain/events/base/domain-event';
import { EventRegistry } from '../../contracts/events/event-registry';

export interface HandlerResult {
  handlerId: string;
  success: boolean;
  error: Error | null;
  durationMs: number;
}

export interface ProcessResult {
  eventId: string;
  eventType: string;
  results: HandlerResult[];
  hasFailures: boolean;
}

/**
 * Fan-out Processor
 *
 * Processa um evento executando todos os handlers registrados
 * para aquele tipo de evento em paralelo.
 */
export class FanOutProcessor {
  constructor(private readonly registry: EventRegistry) {}

  async process(event: DomainEvent): Promise<ProcessResult> {
    const handlers = this.registry.getHandlers(event.eventType);

    const results = await Promise.allSettled(
      handlers.map(async (handler) => {
        const start = Date.now();

        try {
          await handler.handle(event);
          return {
            handlerId: handler.handlerId,
            success: true,
            error: null,
            durationMs: Date.now() - start,
          };
        } catch (error) {
          return {
            handlerId: handler.handlerId,
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
            durationMs: Date.now() - start,
          };
        }
      }),
    );

    const handlerResults: HandlerResult[] = results.map((result) =>
      result.status === 'fulfilled'
        ? result.value
        : {
            handlerId: 'unknown',
            success: false,
            error: result.reason,
            durationMs: 0,
          },
    );

    return {
      eventId: event.eventId,
      eventType: event.eventType,
      results: handlerResults,
      hasFailures: handlerResults.some((r) => !r.success),
    };
  }
}
