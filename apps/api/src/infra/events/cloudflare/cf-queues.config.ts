export const queuesConfig = {
  main: {
    name: 'events-main',
    maxRetries: 5,
    retryDelays: [10, 30, 60, 120, 300], // segundos: 10s, 30s, 1min, 2min, 5min
  },
  dlq: {
    name: 'events-dlq',
  },
} as const;

export type MainQueueConfig = typeof queuesConfig.main;
export type DlqConfig = typeof queuesConfig.dlq;

/**
 * Calcula o delay de retry baseado no número de tentativas
 */
export function getRetryDelay(attempt: number): number {
  const delays = queuesConfig.main.retryDelays;
  return delays[Math.min(attempt, delays.length - 1)];
}
