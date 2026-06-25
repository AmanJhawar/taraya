import type { ComponentProps } from 'react'
import { cn } from './cn'

export interface IconButtonProps extends ComponentProps<'button'> {
  /** Screen reader label is required since the button only has an icon */
  'aria-label': string
}

export function IconButton({ className, type = 'button', disabled, ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center p-2 text-ink rounded-full transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-field disabled:opacity-50 disabled:pointer-events-none hover:bg-ink/[0.04]',
        className
      )}
      {...props}
    />
  )
}
