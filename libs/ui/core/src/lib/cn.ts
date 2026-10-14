import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine des classes conditionnelles (clsx) puis résout les conflits Tailwind (tailwind-merge).
 * Permet à l'utilisateur d'un composant de surcharger les classes par défaut via un input `class`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
