export interface CacheOptions {
  ttlSeconds?: number;
}

export interface CacheProvider {
  /**
   * Obtém um valor do cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Define um valor no cache
   */
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;

  /**
   * Remove um valor do cache
   */
  delete(key: string): Promise<void>;

  /**
   * Remove múltiplos valores por padrão de chave
   */
  invalidate(pattern: string): Promise<void>;

  /**
   * Verifica se uma chave existe
   */
  has(key: string): Promise<boolean>;
}

export const CACHE_PROVIDER = Symbol('CacheProvider');
