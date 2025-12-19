import { EventHandler } from './event-handler';

export interface EventRegistry {
  /**
   * Registra um handler para processar eventos
   */
  register(handler: EventHandler): void;

  /**
   * Remove um handler do registro
   */
  unregister(handlerId: string): void;

  /**
   * Retorna todos os handlers registrados para um tipo de evento
   */
  getHandlers(eventType: string): EventHandler[];

  /**
   * Retorna todos os handlers registrados
   */
  getAllHandlers(): EventHandler[];
}

export const EVENT_REGISTRY = Symbol('EventRegistry');
