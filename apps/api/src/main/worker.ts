/**
 * Cloudflare Worker Entry Point
 *
 * Entry point para Cloudflare Workers.
 * Processa requisições HTTP e mensagens de filas.
 */

import { createInjector } from 'typed-inject';

import { CloudflareQueueConsumer, MessageBatch } from '../infra/events/cloudflare/cf-queue-consumer';
import { CloudflareEventBus } from '../infra/events/cloudflare/cf-event-bus';
import { FanOutProcessor } from '../infra/events/fan-out-processor';
import { EventDispatcher } from '../infra/events/event-dispatcher';
import { InMemoryEventRegistry } from '../application/event-handlers/handler-registry';
import { TOKENS } from './container';

// ─────────────────────────────────────────────────────────────
// Cloudflare Worker Types
// ─────────────────────────────────────────────────────────────

export interface Env {
  // Queue bindings
  EVENTS_QUEUE: Queue;
  EVENTS_DLQ: Queue;

  // KV bindings
  CACHE: KVNamespace;

  // R2 bindings
  STORAGE: R2Bucket;

  // Secrets
  DATABASE_URL: string;
}

interface Queue {
  send(message: unknown): Promise<void>;
  sendBatch(messages: { body: unknown }[]): Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface KVNamespace {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface R2Bucket {}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// ─────────────────────────────────────────────────────────────
// Worker Container Factory
// ─────────────────────────────────────────────────────────────

/**
 * Cria o container para o contexto do Worker
 * (recriado a cada request para isolamento)
 */
function createWorkerContainer(env: Env) {
  const eventRegistry = new InMemoryEventRegistry();
  // TODO: Registrar handlers aqui
  // registerEventHandlers(eventRegistry);

  const fanOutProcessor = new FanOutProcessor(eventRegistry);

  const eventBus = new CloudflareEventBus(env.EVENTS_QUEUE);
  const eventDispatcher = new EventDispatcher(eventBus);

  return createInjector()
    .provideValue(TOKENS.eventRegistry, eventRegistry)
    .provideValue(TOKENS.fanOutProcessor, fanOutProcessor)
    .provideValue(TOKENS.eventBus, eventBus)
    .provideValue(TOKENS.eventDispatcher, eventDispatcher);
}

// ─────────────────────────────────────────────────────────────
// Worker Export
// ─────────────────────────────────────────────────────────────

export default {
  /**
   * HTTP request handler
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const container = createWorkerContainer(env);

    try {
      // TODO: Implementar roteamento HTTP com Hono
      // const app = createApp(container);
      // return app.fetch(request, env, ctx);

      return new Response('Hello from Cloudflare Workers!');
    } finally {
      container.dispose();
    }
  },

  /**
   * Queue message handler
   */
  async queue(batch: MessageBatch, env: Env, _ctx: ExecutionContext): Promise<void> {
    const eventRegistry = new InMemoryEventRegistry();
    // TODO: Registrar handlers aqui

    const fanOutProcessor = new FanOutProcessor(eventRegistry);
    const consumer = new CloudflareQueueConsumer(fanOutProcessor, {
      send: (msg) => env.EVENTS_DLQ.send(msg),
      sendBatch: (msgs) => env.EVENTS_DLQ.sendBatch(msgs),
    });

    await consumer.consume(batch);
  },
};
