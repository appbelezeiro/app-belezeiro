/**
 * Application Entry Point
 *
 * Bootstrap da aplicação para ambiente Node.js tradicional.
 * Para Cloudflare Workers, use worker.ts
 */

import { loadConfig } from './config';
import { createContainer, TOKENS } from './container';
import { createServer } from './server';

async function bootstrap() {
  const config = loadConfig();
  const container = createContainer(config);
  const server = createServer(container);

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    await server.stop();
    container.dispose();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  await server.start();
  console.log(`Server running on port ${container.resolve(TOKENS.config).port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
