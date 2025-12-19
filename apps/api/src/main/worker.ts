/**
 * Cloudflare Worker Entry Point
 *
 * Entry point para Cloudflare Workers.
 * Processa requisições HTTP e mensagens de filas.
 */

import { CloudflareQueueConsumer, MessageBatch } from '../infra/events/cloudflare/cf-queue-consumer';
import { FanOutProcessor } from '../infra/events/fan-out-processor';
import { InMemoryEventRegistry } from '../application/event-handlers/handler-registry';

// Tipos do Cloudflare Workers
export interface Env {
  // Bindings de filas
  EVENTS_QUEUE: Queue;
  EVENTS_DLQ: Queue;

  // Bindings de KV
  CACHE: KVNamespace;

  // Bindings de R2
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

export default {
  /**
   * Handler para requisições HTTP
   */
  async fetch(_request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    // TODO: Implementar roteamento HTTP com Hono
    return new Response('Hello from Cloudflare Workers!');
  },

  /**
   * Handler para mensagens da fila de eventos
   */
  async queue(batch: MessageBatch, env: Env, _ctx: ExecutionContext): Promise<void> {
    // Setup do processador
    const registry = new InMemoryEventRegistry();
    // TODO: Registrar handlers aqui

    const processor = new FanOutProcessor(registry);
    const consumer = new CloudflareQueueConsumer(processor, {
      send: (msg) => env.EVENTS_DLQ.send(msg),
      sendBatch: (msgs) => env.EVENTS_DLQ.sendBatch(msgs),
    });

    await consumer.consume(batch);
  },
};

// Tipo para ExecutionContext do Cloudflare
interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
