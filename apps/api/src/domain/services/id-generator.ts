/**
 * Domain Service: ID Generator
 *
 * Abstração para geração de identificadores únicos.
 * Permite trocar a estratégia de geração (UUID, ULID, etc) sem afetar o domínio.
 */
export interface IdGenerator {
  /**
   * Gera um identificador único
   * @returns string com o identificador (sem prefix)
   */
  generate(): string;
}
