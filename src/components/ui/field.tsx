import { useId, type ComponentProps, type ReactNode } from 'react'
import { cn } from './cn'

const labelClass = 'block font-garamond text-[12px] tracking-[0.12em] [font-variant:small-caps] text-muted'

export function Label({ className, children, ...props }: ComponentProps<'label'>) {
  return (
    <label className={cn(labelClass, className)} {...props}>
      {children}
    </label>
  )
}

const controlBase = cn(
  'w-full rounded-lg border border-line bg-field text-ink font-garamond text-[15px] px-3.5',
  'transition-colors placeholder:text-muted/60',
  'focus:outline-none focus:border-ink focus-visible:ring-1 focus-visible:ring-ink',
  'aria-invalid:border-danger aria-invalid:focus:border-danger',
  'disabled:opacity-50 disabled:cursor-not-allowed',
)

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlBase, 'h-11', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(controlBase, 'min-h-28 py-2.5 resize-y', className)} {...props} />
}

interface ShellAria {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
  'aria-required'?: true
}

interface FieldShellProps {
  id: string
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  children: (aria: ShellAria) => ReactNode
}

function FieldShell({ id, label, hint, error, required, children }: FieldShellProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <Label htmlFor={id}>
          {label}
          {required ? <span aria-hidden="true" className="text-danger"> *</span> : null}
        </Label>
      ) : null}

      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}

      {hint && !error ? (
        <p id={hintId} className="font-garamond text-[13px] text-muted">{hint}</p>
      ) : null}
      {error ? (
        <p id={errorId} className="font-garamond text-[13px] text-danger">{error}</p>
      ) : null}
    </div>
  )
}

export interface TextFieldProps extends Omit<ComponentProps<'input'>, 'id'> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  id?: string
}

export function TextField({ label, hint, error, required, id, className, ...props }: TextFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} required={required}>
      {(aria) => <Input className={className} required={required} {...props} {...aria} />}
    </FieldShell>
  )
}

export interface TextareaFieldProps extends Omit<ComponentProps<'textarea'>, 'id'> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  id?: string
}

export function TextareaField({ label, hint, error, required, id, className, ...props }: TextareaFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error} required={required}>
      {(aria) => <Textarea className={className} required={required} {...props} {...aria} />}
    </FieldShell>
  )
}

