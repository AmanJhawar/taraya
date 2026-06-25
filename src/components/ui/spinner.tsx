import { cn } from './cn'

export interface SpinnerProps {
  /** Pixel size of the square spinner. */
  size?: number
  className?: string
  /**
   * Provide a label to expose the spinner to assistive tech as a polite live
   * status. Omit it when the spinner sits inside an element that already
   * announces busy state (for example a Button with aria-busy), to avoid
   * double announcements.
   */
  label?: string
}

export function Spinner({ size = 16, className, label }: SpinnerProps) {
  return (
    <span role={label ? 'status' : undefined} aria-live={label ? 'polite' : undefined} className="inline-flex">
      {/* A spinner's motion is functional, not decorative, so it always animates. */}
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn('animate-spin', className)}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {label ? <span className="sr-only">{label}</span> : null}
    </span>
  )
}
