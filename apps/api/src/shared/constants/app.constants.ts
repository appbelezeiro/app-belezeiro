/**
 * Application Constants
 */

export const APP_CONSTANTS = {
  /**
   * Paginação padrão
   */
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },

  /**
   * Cache TTLs (em segundos)
   */
  CACHE_TTL: {
    SHORT: 60, // 1 minuto
    MEDIUM: 300, // 5 minutos
    LONG: 3600, // 1 hora
    DAY: 86400, // 24 horas
  },

  /**
   * Limites de upload
   */
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  },

  /**
   * Eventos de domínio
   */
  EVENTS: {
    MAX_RETRIES: 5,
    RETRY_DELAYS: [10, 30, 60, 120, 300], // segundos
  },
} as const;
