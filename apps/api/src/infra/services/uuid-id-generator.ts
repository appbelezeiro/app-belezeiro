import { randomUUID } from 'node:crypto';

import { IdGenerator } from '../../domain/services/id-generator';

/**
 * Implementação de IdGenerator usando UUID v4
 *
 * Esta é a implementação padrão que gera IDs usando
 * o algoritmo UUID v4 do node:crypto.
 *
 * Formato de saída: {prefix}_{uuid}
 * Exemplo: user_550e8400-e29b-41d4-a716-446655440000
 */
export class UuidIdGenerator implements IdGenerator {
  generate(prefix: string): string {
    const uuid = randomUUID();
    return `${prefix}_${uuid}`;
  }
}
