/**
 * Common Types
 */

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Opções de paginação
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Opções de ordenação
 */
export interface SortOptions<T> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

/**
 * Resultado de operação que pode falhar
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper para criar Result de sucesso
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Helper para criar Result de erro
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Tipo para ID de entidade
 */
export type EntityId = string;

/**
 * Tipo para timestamps
 */
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Remove campos undefined de um objeto
 */
export type NonUndefined<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>;
};
