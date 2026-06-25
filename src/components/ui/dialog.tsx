'use client'

import { createPortal } from 'react-dom'
import { useEffect, useId, useState, type ReactNode, type RefObject } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { cn } from './cn'
import { useFocusTrap } from './use-focus-trap'

// Reference-counted body scroll lock, so two stacked overlays cannot restore
// scrolling while one is still open.
let lockCount = 0
let previousOverflow = ''
function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount += 1
    return () => {
      lockCount -= 1
      if (lockCount === 0) document.body.style.overflow = previousOverflow
    }
  }, [active])
}

export interface OverlayProps {
  open: boolean
  onClose: () => void
  /** Required for the accessible name. Use hideTitle to keep it screen-reader only. */
  title: ReactNode
  description?: ReactNode
  hideTitle?: boolean
  /** Allow Escape and backdrop click to close. Default true. */
  dismissible?: boolean
  /** Focus this element on open instead of the dialog container. */
  initialFocus?: RefObject<HTMLElement | null>
  children?: ReactNode
  footer?: ReactNode
  className?: string
}

interface ShellProps extends OverlayProps {
  variant: 'dialog' | 'drawer'
}

const SOFT_SHADOW = 'shadow-[0_8px_40px_rgba(35,31,29,0.18)]'

function OverlayShell({
  open, onClose, title, description, hideTitle, dismissible = true, initialFocus,
  children, footer, className, variant,
}: ShellProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useScrollLock(open)
  const panelRef = useFocusTrap<HTMLDivElement>(open, initialFocus)
  const reduce = useReducedMotion()
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open || !dismissible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, dismissible, onClose])

  if (!mounted) return null

  const isDrawer = variant === 'drawer'
  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : isDrawer
      ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
      : { initial: { opacity: 0, y: 12, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 } }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-ink/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={dismissible ? onClose : undefined}
          />

          <div className={cn('absolute inset-0 flex', isDrawer ? 'justify-end' : 'items-center justify-center p-4 md:p-6')}>
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={description ? descId : undefined}
              {...panelMotion}
              transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'relative flex flex-col bg-field text-ink border border-line outline-none rounded-lg',
                SOFT_SHADOW,
                isDrawer ? 'h-full w-full max-w-md' : 'w-full max-w-lg max-h-[90vh]',
                className,
              )}
            >
              <header className={cn('flex items-start justify-between gap-4 px-6 pt-6', isDrawer ? 'border-b border-line pb-5' : 'pb-2')}>
                <div className="min-w-0">
                  <h2 id={titleId} className={cn('font-serif text-xl md:text-2xl text-ink', hideTitle && 'sr-only')}>
                    {title}
                  </h2>
                  {description ? (
                    <p id={descId} className="mt-1 font-garamond text-[14px] text-muted">{description}</p>
                  ) : null}
                </div>
                {dismissible ? (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="-mr-1 -mt-1 shrink-0 p-2 text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                ) : null}
              </header>

              <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

              {footer ? (
                <footer className={cn('px-6 pb-6', isDrawer && 'border-t border-line pt-5')}>{footer}</footer>
              ) : null}
            </motion.div>
          </div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

/** Centred modal dialog. */
export function Dialog(props: OverlayProps) {
  return <OverlayShell {...props} variant="dialog" />
}

/** Right-hand side drawer (cart, filters, menus). */
export function Drawer(props: OverlayProps) {
  return <OverlayShell {...props} variant="drawer" />
}
