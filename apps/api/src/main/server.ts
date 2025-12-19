/**
 * HTTP Server Setup
 *
 * Configuração do servidor HTTP.
 * A implementação depende do framework escolhido (Hono, Express, Fastify, etc.)
 */

import { AppInjector, TOKENS } from './container';

export interface Server {
  start(): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Cria e configura o servidor HTTP
 */
export function createServer(injector: AppInjector): Server {
  const config = injector.resolve(TOKENS.config);
  const _eventDispatcher = injector.resolve(TOKENS.eventDispatcher);

  // TODO: Implementar com o framework escolhido (Hono recomendado para Cloudflare Workers)
  //
  // Exemplo com Hono:
  // const app = new Hono();
  //
  // app.use('*', cors());
  // app.use('*', authMiddleware(injector));
  //
  // // Injetar use cases nos controllers
  // const createBookingUseCase = injector.injectClass(CreateBookingUseCase);
  // app.route('/bookings', bookingsRoutes(createBookingUseCase));
  //
  // return {
  //   start: () => serve(app, { port: config.port }),
  //   stop: () => Promise.resolve(),
  // };

  return {
    start: async () => {
      console.log(`Server started on port ${config.port} (placeholder)`);
    },
    stop: async () => {
      console.log('Server stopped (placeholder)');
    },
  };
}
