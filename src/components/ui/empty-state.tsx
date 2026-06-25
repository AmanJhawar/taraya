import type { ReactNode } from 'react'
import { cn } from './cn'

export interface EmptyStateProps {
  /** Optional decorative glyph or illustration. */
  icon?: ReactNode
  title: string
  description?: ReactNode
  /** Usually a Button or ButtonLink. */
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center px-6 py-20', className)}>
      {icon ? (
        <div aria-hidden="true" className="mb-6 text-muted">{icon}</div>
      ) : null}
      <h2 className="font-serif text-2xl md:text-3xl text-ink">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-md font-garamond text-[15px] md:text-base text-muted leading-relaxed">{description}</p>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}
