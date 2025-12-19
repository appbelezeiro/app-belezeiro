/**
 * Dependency Injection Container
 *
 * Centraliza a criação e injeção de dependências.
 * Pode ser substituído por um container DI como tsyringe, inversify, etc.
 */

import { EventBus, EVENT_BUS } from '../contracts/events/event-bus';
import { EventRegistry, EVENT_REGISTRY } from '../contracts/events/event-registry';
import { InMemoryEventRegistry } from '../application/event-handlers/handler-registry';
import { InMemoryEventBus } from '../infra/events/in-memory/in-memory-event-bus';
import { EventDispatcher } from '../infra/events/event-dispatcher';
import { FanOutProcessor } from '../infra/events/fan-out-processor';
import { AppConfig } from './config';

export interface Container {
  // Events
  eventBus: EventBus;
  eventRegistry: EventRegistry;
  eventDispatcher: EventDispatcher;
  fanOutProcessor: FanOutProcessor;

  // Repositories
  // userRepository: UserRepository;
  // ...

  // Providers
  // authProvider: AuthProvider;
  // ...
}

/**
 * Cria o container com todas as dependências
 */
export function createContainer(config: AppConfig): Container {
  // Event infrastructure
  const eventRegistry = new InMemoryEventRegistry();
  const fanOutProcessor = new FanOutProcessor(eventRegistry);

  // Para desenvolvimento, usa in-memory
  // Em produção, substituir por CloudflareEventBus
  const eventBus = new InMemoryEventBus();
  eventBus.setProcessor(fanOutProcessor);

  const eventDispatcher = new EventDispatcher(eventBus);

  // TODO: Registrar event handlers aqui
  // registerEventHandlers(eventRegistry, { ...providers });

  return {
    eventBus,
    eventRegistry,
    eventDispatcher,
    fanOutProcessor,
  };
}

// Símbolos para DI (se usar um container DI)
export const TOKENS = {
  EVENT_BUS,
  EVENT_REGISTRY,
} as const;
