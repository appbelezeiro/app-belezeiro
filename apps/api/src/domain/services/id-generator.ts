/**
 * Domain Service: ID Generator
 *
 * Abstração para geração de identificadores únicos.
 * Permite trocar a estratégia de geração (UUID, ULID, etc) sem afetar o domínio.
 */
export interface IdGenerator {
  /**
   * Gera um identificador único com prefix
   * @param prefix - Prefixo a ser adicionado (ex: 'user', 'org')
   * @returns string no formato: {prefix}_{id}
   */
  generate(prefix: string): string;
}
