import { type ComponentProps, type ReactNode } from 'react'
import { cn } from './cn'

export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type'> {
  label: ReactNode
}

export function Checkbox({ label, className, disabled, ...props }: CheckboxProps) {
  return (
    <label
      className={cn(
        'group flex items-start gap-3 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative flex h-5 w-5 items-center justify-center mt-[1px]">
        {/* The actual input is visually hidden but accessible */}
        <input
          type="checkbox"
          className="peer sr-only"
          disabled={disabled}
          {...props}
        />
        {/* The visual box */}
        <div className="absolute inset-0 rounded-[4px] border border-line bg-field transition-colors peer-checked:bg-ink peer-checked:border-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-field group-hover:border-ink/50" />
        {/* The checkmark (only visible when checked) */}
        <svg
          className="relative z-10 w-3 h-3 text-field opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="font-garamond text-[15px] text-ink leading-tight select-none">
        {label}
      </div>
    </label>
  )
}
