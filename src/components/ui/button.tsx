import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './cn'
import { Spinner } from './spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base = cn(
  'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap',
  'font-garamond tracking-[0.12em] [font-variant:small-caps] rounded-lg',
  'transition-[background-color,color,border-color,opacity] duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-field',
  'disabled:opacity-50 disabled:pointer-events-none',
)

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-field border border-ink hover:bg-ink/90',
  secondary: 'bg-transparent text-ink border border-line hover:border-ink hover:bg-ink/[0.04]',
  ghost: 'bg-transparent text-ink border border-transparent hover:bg-ink/[0.06]',
  danger: 'bg-transparent text-[#8B2E2E] border border-[#8B2E2E]/40 hover:border-[#8B2E2E] hover:bg-[#8B2E2E]/[0.06]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[12px]',
  md: 'h-11 px-6 text-[13px]',
  lg: 'h-14 px-8 text-[14px]',
}

/** Build the button class string for non-button elements that must look like a button. */
export function buttonClasses(
  opts: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {},
): string {
  const { variant = 'primary', size = 'md', fullWidth, className } = opts
  return cn(base, variantClasses[variant], sizeClasses[size], fullWidth && 'w-full', className)
}

interface SharedProps {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export interface ButtonProps extends ComponentProps<'button'>, SharedProps {
  /** Shows a spinner, disables interaction and sets aria-busy. */
  loading?: boolean
  /** Optional text to swap in while loading (keeps the spinner). */
  loadingText?: string
}

export function Button({
  variant, size, fullWidth, leftIcon, rightIcon,
  loading = false, loadingText,
  className, children, disabled, type = 'button', ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? <Spinner size={16} /> : leftIcon}
      <span>{loading && loadingText ? loadingText : children}</span>
      {loading ? null : rightIcon}
    </button>
  )
}

export interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className'>, SharedProps {
  className?: string
}

/** Navigation that looks like a button. Use for links; use Button for actions. */
export function ButtonLink({ variant, size, fullWidth, leftIcon, rightIcon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      {leftIcon}
      <span>{children}</span>
      {rightIcon}
    </Link>
  )
}
