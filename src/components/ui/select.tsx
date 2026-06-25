'use client'

import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { useFloating, autoUpdate, offset, flip, shift, size, FloatingPortal } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from './cn'
import { Label } from './field'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-invalid'?: boolean
  'aria-describedby'?: string
}

export function Select({
  options, value, onChange, placeholder = 'Select…', disabled,
  id, name, className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const typeahead = useRef<{ str: string; timer: number | null }>({ str: '', timer: null })

  const autoId = useId()
  const baseId = id ?? autoId
  const listId = `${baseId}-listbox`

  // Floating UI handles placement: flip up when there is no room below, shift to
  // stay on-screen, match the trigger width, cap the height to the space left,
  // and reposition on scroll/resize. The portal escapes any overflow ancestor.
  const { refs, floatingStyles, placement } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.max(140, availableHeight)}px`,
          })
        },
      }),
    ],
  })

  const setButtonRef = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node
      refs.setReference(node)
    },
    [refs],
  )

  const selectedIndex = options.findIndex((o) => o.value === value)
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const firstEnabled = () => options.findIndex((o) => !o.disabled)
  const lastEnabled = () => {
    for (let i = options.length - 1; i >= 0; i--) if (!options[i].disabled) return i
    return -1
  }
  const step = (from: number, dir: 1 | -1) => {
    let i = from
    for (let c = 0; c < options.length; c++) {
      i = (i + dir + options.length) % options.length
      if (!options[i].disabled) return i
    }
    return from
  }

  const openList = (toIndex?: number) => {
    if (disabled) return
    setActiveIndex(toIndex ?? (selectedIndex >= 0 ? selectedIndex : firstEnabled()))
    setOpen(true)
  }
  const close = (focusButton = true) => {
    setOpen(false)
    setActiveIndex(-1)
    if (focusButton) buttonRef.current?.focus()
  }
  const choose = (index: number) => {
    const opt = options[index]
    if (!opt || opt.disabled) return
    onChange?.(opt.value)
    close()
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!buttonRef.current?.contains(t) && !refs.floating.current?.contains(t)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open, refs])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    refs.floating.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex, refs])

  const runTypeahead = (ch: string) => {
    const t = typeahead.current
    if (t.timer) window.clearTimeout(t.timer)
    t.str += ch.toLowerCase()
    const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(t.str))
    if (match >= 0) setActiveIndex(match)
    t.timer = window.setTimeout(() => { t.str = '' }, 600)
  }

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        open ? setActiveIndex((i) => step(i < 0 ? selectedIndex : i, 1)) : openList()
        break
      case 'ArrowUp':
        e.preventDefault()
        open ? setActiveIndex((i) => step(i < 0 ? selectedIndex : i, -1)) : openList(lastEnabled())
        break
      case 'Home':
        if (open) { e.preventDefault(); setActiveIndex(firstEnabled()) }
        break
      case 'End':
        if (open) { e.preventDefault(); setActiveIndex(lastEnabled()) }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        open ? choose(activeIndex) : openList()
        break
      case 'Escape':
        // Stop the event so a parent Dialog does not also close on the same key.
        if (open) { e.preventDefault(); e.stopPropagation(); close() }
        break
      case 'Tab':
        if (open) setOpen(false)
        break
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          runTypeahead(e.key)
          if (!open) openList()
        }
    }
  }

  return (
    <div className={cn('relative', className)}>
      <button
        ref={setButtonRef}
        type="button"
        id={baseId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={ariaDescribedby}
        aria-activedescendant={open && activeIndex >= 0 ? `${baseId}-opt-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-line bg-field px-3.5 text-left',
          'font-garamond text-[15px] text-ink transition-colors',
          'focus:outline-none focus:border-ink focus-visible:ring-1 focus-visible:ring-ink',
          'aria-invalid:border-danger disabled:opacity-50 disabled:cursor-not-allowed',
          open && 'border-ink',
        )}
      >
        <span className={cn('truncate', !selected && 'text-muted/70')}>{selected ? selected.label : placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn('shrink-0 text-muted transition-transform', open && 'rotate-180')}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <FloatingPortal>
        <AnimatePresence>
          {open ? (
            <motion.ul
              ref={refs.setFloating}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
              id={listId}
              role="listbox"
              aria-labelledby={ariaLabelledby}
              style={{
                ...floatingStyles,
                transformOrigin: placement.startsWith('top') ? 'bottom center' : 'top center',
              }}
              className="z-[200] overflow-auto rounded-lg border border-line bg-field py-1 shadow-[0_8px_40px_rgba(35,31,29,0.18)]"
            >
            {options.map((opt, index) => {
              const isSelected = opt.value === value
              const isActive = index === activeIndex
              return (
                <li
                  key={opt.value}
                  id={`${baseId}-opt-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  onMouseEnter={() => !opt.disabled && setActiveIndex(index)}
                  onMouseDown={(e) => { e.preventDefault(); choose(index) }}
                  className={cn(
                    'flex items-center justify-between gap-2 px-3.5 py-2 font-garamond text-[15px]',
                    opt.disabled ? 'cursor-not-allowed text-muted/50' : 'cursor-pointer',
                    !opt.disabled && isActive && 'bg-ink/[0.06]',
                    !opt.disabled && (isSelected ? 'text-ink' : 'text-ink/80'),
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 text-ink">
                      <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </li>
              )
            })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </FloatingPortal>

      {name ? <input type="hidden" name={name} value={value ?? ''} /> : null}
    </div>
  )
}

export interface SelectFieldProps extends SelectProps {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
}

export function SelectField({ label, hint, error, required, id, ...props }: SelectFieldProps) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const labelId = label ? `${fieldId}-label` : undefined
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <Label id={labelId} htmlFor={fieldId}>
          {label}
          {required ? <span aria-hidden="true" className="text-danger"> *</span> : null}
        </Label>
      ) : null}

      <Select
        id={fieldId}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />

      {hint && !error ? <p id={hintId} className="font-garamond text-[13px] text-muted">{hint}</p> : null}
      {error ? <p id={errorId} className="font-garamond text-[13px] text-danger">{error}</p> : null}
    </div>
  )
}
