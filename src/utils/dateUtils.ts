/**
 * Formatea una fecha en formato estándar
 * @param dateString - Fecha en formato ISO o similar
 * @returns Fecha formateada legible
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}