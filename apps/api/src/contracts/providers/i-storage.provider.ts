export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
}

export interface StorageProvider {
  /**
   * Faz upload de um arquivo
   */
  upload(key: string, data: Buffer | Uint8Array, options?: UploadOptions): Promise<UploadResult>;

  /**
   * Gera uma URL assinada para upload direto
   */
  getSignedUploadUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Gera uma URL assinada para download
   */
  getSignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;

  /**
   * Deleta um arquivo
   */
  delete(key: string): Promise<void>;

  /**
   * Verifica se um arquivo existe
   */
  exists(key: string): Promise<boolean>;
}

export const STORAGE_PROVIDER = Symbol('StorageProvider');
