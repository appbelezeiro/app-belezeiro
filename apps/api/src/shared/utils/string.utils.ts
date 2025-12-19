/**
 * String Utilities
 */

/**
 * Remove acentos de uma string
 */
export function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Converte string para slug (URL-friendly)
 */
export function toSlug(str: string): string {
  return removeAccents(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitaliza a primeira letra de cada palavra
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Trunca uma string com ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Mascara parte de uma string (útil para logs)
 */
export function mask(str: string, visibleStart = 3, visibleEnd = 3): string {
  if (str.length <= visibleStart + visibleEnd) {
    return '*'.repeat(str.length);
  }
  const masked = '*'.repeat(str.length - visibleStart - visibleEnd);
  return str.slice(0, visibleStart) + masked + str.slice(-visibleEnd);
}

/**
 * Remove espaços extras e normaliza whitespace
 */
export function normalizeWhitespace(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}
