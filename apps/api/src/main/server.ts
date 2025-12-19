/**
 * HTTP Server Setup
 *
 * Configuração do servidor HTTP.
 * A implementação depende do framework escolhido (Hono, Express, Fastify, etc.)
 */

import { Container } from './container';
import { AppConfig } from './config';

export interface Server {
  start(): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Cria e configura o servidor HTTP
 */
export function createServer(_container: Container, _config: AppConfig): Server {
  // TODO: Implementar com o framework escolhido (Hono recomendado para Cloudflare Workers)
  //
  // Exemplo com Hono:
  // const app = new Hono();
  //
  // app.use('*', cors());
  // app.use('*', authMiddleware(container.authProvider));
  //
  // app.route('/users', usersRoutes(container));
  // app.route('/bookings', bookingsRoutes(container));
  //
  // return {
  //   start: () => serve(app, { port: config.port }),
  //   stop: () => Promise.resolve(),
  // };

  return {
    start: async () => {
      console.log('Server started (placeholder)');
    },
    stop: async () => {
      console.log('Server stopped (placeholder)');
    },
  };
}
