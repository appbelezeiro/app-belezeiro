import { randomUUID } from 'node:crypto';

import { IdGenerator } from '../../domain/services/id-generator';

/**
 * Implementação de IdGenerator usando UUID v4
 *
 * Esta é a implementação padrão que gera IDs usando
 * o algoritmo UUID v4 do node:crypto.
 */
export class UuidIdGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
