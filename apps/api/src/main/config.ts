/**
 * Application Configuration
 *
 * Centraliza todas as configurações da aplicação.
 * Valores são lidos de variáveis de ambiente.
 */

export interface AppConfig {
  env: 'development' | 'staging' | 'production';
  port: number;

  database: {
    url: string;
  };

  auth: {
    // Firebase, Clerk, etc.
    projectId?: string;
    apiKey?: string;
  };

  storage: {
    // Cloudflare R2
    accountId?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucketName?: string;
  };

  cache: {
    // Cloudflare KV
    namespaceId?: string;
  };

  queues: {
    // Cloudflare Queues
    eventsQueueName: string;
    dlqQueueName: string;
  };
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function getEnvOptional(key: string): string | undefined {
  return process.env[key];
}

export function loadConfig(): AppConfig {
  return {
    env: getEnv('NODE_ENV', 'development') as AppConfig['env'],
    port: parseInt(getEnv('PORT', '3000'), 10),

    database: {
      url: getEnv('DATABASE_URL', 'file:./dev.db'),
    },

    auth: {
      projectId: getEnvOptional('AUTH_PROJECT_ID'),
      apiKey: getEnvOptional('AUTH_API_KEY'),
    },

    storage: {
      accountId: getEnvOptional('CF_ACCOUNT_ID'),
      accessKeyId: getEnvOptional('R2_ACCESS_KEY_ID'),
      secretAccessKey: getEnvOptional('R2_SECRET_ACCESS_KEY'),
      bucketName: getEnvOptional('R2_BUCKET_NAME'),
    },

    cache: {
      namespaceId: getEnvOptional('KV_NAMESPACE_ID'),
    },

    queues: {
      eventsQueueName: getEnv('QUEUE_EVENTS_NAME', 'events-main'),
      dlqQueueName: getEnv('QUEUE_DLQ_NAME', 'events-dlq'),
    },
  };
}
