import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Trap focus within a container while `active`.
 *
 * On activate: remembers the currently focused element, then moves focus to
 * `initialFocus` if provided, otherwise to the container itself so a screen
 * reader announces the dialog by its accessible name. Tab and Shift+Tab cycle
 * the focusable descendants. On deactivate: focus returns to the opener.
 *
 * Attach the returned ref to the container that should hold focus.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  initialFocus?: RefObject<HTMLElement | null>,
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const previouslyFocused = document.activeElement as HTMLElement | null

    const getFocusable = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.getClientRects().length > 0,
      )

    const target = initialFocus?.current ?? node
    if (target === node) node.tabIndex = -1
    target.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = getFocusable()
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement

      if (e.shiftKey && (activeEl === first || activeEl === node)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }

    node.addEventListener('keydown', onKeyDown)
    return () => {
      node.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [active, initialFocus])

  return ref
}
