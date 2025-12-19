/**
 * Application Entry Point
 *
 * Bootstrap da aplicação para ambiente Node.js tradicional.
 * Para Cloudflare Workers, use worker.ts
 */

import { loadConfig } from './config';
import { createContainer } from './container';
import { createServer } from './server';

async function bootstrap() {
  const config = loadConfig();
  const container = createContainer(config);
  const server = createServer(container, config);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down...');
    await server.stop();
    process.exit(0);
  });

  await server.start();
  console.log(`Server running on port ${config.port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
