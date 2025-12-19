/**
 * Dependency Injection Container
 *
 * Usa typed-inject para injeção de dependências type-safe.
 * https://github.com/nicojs/typed-inject
 */

import { createInjector, Injector } from 'typed-inject';

import { EventBus } from '../contracts/events/event-bus';
import { EventRegistry } from '../contracts/events/event-registry';
import { InMemoryEventRegistry } from '../application/event-handlers/handler-registry';
import { InMemoryEventBus } from '../infra/events/in-memory/in-memory-event-bus';
import { EventDispatcher } from '../infra/events/event-dispatcher';
import { FanOutProcessor } from '../infra/events/fan-out-processor';
import { AppConfig, loadConfig } from './config';

// ─────────────────────────────────────────────────────────────
// Tokens - Identificadores para as dependências
// ─────────────────────────────────────────────────────────────

export const TOKENS = {
  config: 'config',
  eventRegistry: 'eventRegistry',
  eventBus: 'eventBus',
  fanOutProcessor: 'fanOutProcessor',
  eventDispatcher: 'eventDispatcher',
  // Adicione novos tokens aqui
} as const;

// ─────────────────────────────────────────────────────────────
// Factory Functions - Criam as dependências
// ─────────────────────────────────────────────────────────────

function createEventRegistry(): EventRegistry {
  return new InMemoryEventRegistry();
}
createEventRegistry.inject = [] as const;

function createFanOutProcessor(eventRegistry: EventRegistry): FanOutProcessor {
  return new FanOutProcessor(eventRegistry);
}
createFanOutProcessor.inject = [TOKENS.eventRegistry] as const;

function createEventBus(fanOutProcessor: FanOutProcessor): EventBus {
  const bus = new InMemoryEventBus();
  bus.setProcessor(fanOutProcessor);
  return bus;
}
createEventBus.inject = [TOKENS.fanOutProcessor] as const;

function createEventDispatcher(eventBus: EventBus): EventDispatcher {
  return new EventDispatcher(eventBus);
}
createEventDispatcher.inject = [TOKENS.eventBus] as const;

// ─────────────────────────────────────────────────────────────
// Container Type - Tipo do injector com todas as dependências
// ─────────────────────────────────────────────────────────────

export type AppInjector = Injector<{
  [TOKENS.config]: AppConfig;
  [TOKENS.eventRegistry]: EventRegistry;
  [TOKENS.eventBus]: EventBus;
  [TOKENS.fanOutProcessor]: FanOutProcessor;
  [TOKENS.eventDispatcher]: EventDispatcher;
}>;

// ─────────────────────────────────────────────────────────────
// Container Creation
// ─────────────────────────────────────────────────────────────

/**
 * Cria o injector raiz com todas as dependências da aplicação
 */
export function createContainer(config?: AppConfig): AppInjector {
  const appConfig = config ?? loadConfig();

  return createInjector()
    .provideValue(TOKENS.config, appConfig)
    .provideFactory(TOKENS.eventRegistry, createEventRegistry)
    .provideFactory(TOKENS.fanOutProcessor, createFanOutProcessor)
    .provideFactory(TOKENS.eventBus, createEventBus)
    .provideFactory(TOKENS.eventDispatcher, createEventDispatcher);
}

// ─────────────────────────────────────────────────────────────
// Helper para criar classes injetáveis
// ─────────────────────────────────────────────────────────────

/**
 * Tipo helper para extrair os tokens de inject de uma classe/função
 *
 * @example
 * class MyService {
 *   static inject = ['eventBus', 'config'] as const;
 *   constructor(eventBus: EventBus, config: AppConfig) {}
 * }
 */
export type InjectableClass<TTokens extends readonly string[], TInstance> = {
  new (...args: unknown[]): TInstance;
  inject: TTokens;
};
