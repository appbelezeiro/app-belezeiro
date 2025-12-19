import { EventHandler, EventRegistry } from '../../contracts/events';

/**
 * Implementação in-memory do registro de handlers
 */
export class InMemoryEventRegistry implements EventRegistry {
  private handlers: Map<string, EventHandler> = new Map();
  private eventTypeIndex: Map<string, Set<string>> = new Map();

  register(handler: EventHandler): void {
    this.handlers.set(handler.handlerId, handler);

    for (const eventType of handler.eventTypes) {
      if (!this.eventTypeIndex.has(eventType)) {
        this.eventTypeIndex.set(eventType, new Set());
      }
      this.eventTypeIndex.get(eventType)!.add(handler.handlerId);
    }
  }

  unregister(handlerId: string): void {
    const handler = this.handlers.get(handlerId);
    if (!handler) return;

    for (const eventType of handler.eventTypes) {
      this.eventTypeIndex.get(eventType)?.delete(handlerId);
    }

    this.handlers.delete(handlerId);
  }

  getHandlers(eventType: string): EventHandler[] {
    const handlerIds = this.eventTypeIndex.get(eventType);
    if (!handlerIds) return [];

    return Array.from(handlerIds)
      .map((id) => this.handlers.get(id))
      .filter((h): h is EventHandler => h !== undefined);
  }

  getAllHandlers(): EventHandler[] {
    return Array.from(this.handlers.values());
  }
}
