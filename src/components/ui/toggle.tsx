import { type ComponentProps } from 'react'
import { cn } from './cn'

export interface ToggleProps extends Omit<ComponentProps<'button'>, 'onChange'> {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Hidden label for screen readers */
  label: string
}

export function Toggle({ checked, onChange, label, className, disabled, ...props }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-field',
        checked ? 'bg-ink' : 'bg-line',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-field shadow ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}
