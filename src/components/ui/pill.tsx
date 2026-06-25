import type { ComponentProps } from 'react'
import { cn } from './cn'

export interface PillProps extends ComponentProps<'button'> {
  /** If true, styles as the active selection */
  active?: boolean
}

/** 
 * Variant selector pill (e.g. for Size, Purity, Material).
 * Renders as a button by default for interactive selection. 
 */
export function Pill({ active, className, type = 'button', disabled, ...props }: PillProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'min-w-[3rem] px-4 py-2.5 text-sm font-medium tracking-wide rounded-lg',
        'transition-[background-color,color,border-color,transform] duration-[160ms] ease-[var(--ease-out)] active:scale-[0.97]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-field',
        'disabled:opacity-50 disabled:pointer-events-none',
        active 
          ? 'bg-ink text-field border border-ink' 
          : 'bg-transparent text-ink border border-line hover:border-ink/30',
        className
      )}
      {...props}
    />
  )
}
