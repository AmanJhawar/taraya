import type { ComponentProps } from 'react'
import { cn } from './cn'

export type BadgeVariant = 'default' | 'success' | 'danger'

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-line/50 text-ink',
  success: 'bg-[#E1EFE6] text-[#2C5234]', // Using a muted green that fits the palette
  danger: 'bg-[#8B2E2E]/10 text-[#8B2E2E]', // Using the oxblood literal
}

/** 
 * Status indicator badge (e.g. for Inquiry states).
 */
export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-garamond font-medium tracking-wide [font-variant:small-caps]',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
}
