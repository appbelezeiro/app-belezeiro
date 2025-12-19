import { User } from '../../domain/user/user.aggregate';
import { Email } from '../../domain/value-objects/email.vo';
import { Document } from '../../domain/value-objects/document.vo';

/**
 * IUserRepository
 *
 * Contrato para repositório de usuários.
 * Segue o padrão Repository do DDD.
 *
 * Convenções:
 * - Métodos find* retornam null se não encontrar
 * - Método save faz upsert (insert ou update)
 * - Métodos exists* retornam boolean
 * - Não lança erros se não encontrar (retorna null)
 */
export interface IUserRepository {
  /**
   * Busca usuário por ID
   * @returns User ou null se não encontrado
   */
  findById(id: string): Promise<User | null>;

  /**
   * Busca usuário por email
   * @returns User ou null se não encontrado
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Busca usuário por documento (CPF/CNPJ)
   * @returns User ou null se não encontrado
   */
  findByDocument(document: Document): Promise<User | null>;

  /**
   * Verifica se existe usuário com o email
   * @returns true se existe, false caso contrário
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Verifica se existe usuário com o documento
   * @returns true se existe, false caso contrário
   */
  existsByDocument(document: Document): Promise<boolean>;

  /**
   * Salva usuário (insert ou update)
   * Implementa upsert baseado no ID
   */
  save(user: User): Promise<void>;
}
