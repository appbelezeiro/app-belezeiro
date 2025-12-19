export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
}

export interface AuthProvider {
  /**
   * Verifica um token e retorna os dados do usuário
   */
  verifyToken(token: string): Promise<AuthUser>;

  /**
   * Gera um token customizado para um usuário
   */
  createCustomToken(userId: string, claims?: Record<string, unknown>): Promise<string>;

  /**
   * Revoga todos os tokens de um usuário
   */
  revokeTokens(userId: string): Promise<void>;
}

export const AUTH_PROVIDER = Symbol('AuthProvider');
