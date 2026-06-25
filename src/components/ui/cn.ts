import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind conflict resolution, so a consumer's
 * `className` prop reliably overrides a component's defaults (last class wins
 * even when both target the same property).
 *
 * Requires: npm i clsx tailwind-merge
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
