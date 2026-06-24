'use client'

import { useState, useRef, useEffect, KeyboardEvent, useId } from 'react'
import { ChevronDown } from 'lucide-react'

export interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  id?: string
  name?: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function CustomSelect({ id, name, value, onChange, options, placeholder = 'Select...', className = '', disabled = false }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const selectRef = useRef<HTMLDivElement>(null)
  const defaultId = useId()
  const resolvedId = id || defaultId

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openSelect = () => {
    setIsOpen(true)
    const idx = options.findIndex(opt => opt.value === value)
    setFocusedIndex(idx >= 0 ? idx : 0)
  }

  const closeSelect = () => {
    setIsOpen(false)
    setFocusedIndex(-1)
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    closeSelect()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openSelect()
      }
      return
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        closeSelect()
        break
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex].value)
        }
    }
  }

  return (
    <div className="relative" ref={selectRef} onKeyDown={disabled ? undefined : handleKeyDown}>
      {name && <input type="hidden" id={resolvedId} name={name} value={value} />}
      
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${resolvedId}-listbox`}
        onClick={() => !disabled && (isOpen ? closeSelect() : openSelect())}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-line rounded-lg text-base text-left flex justify-between items-center transition-[color,border-color,box-shadow,transform] duration-150 ease-[var(--ease-out)] ${
          disabled 
            ? 'bg-band/50 cursor-not-allowed opacity-70' 
            : `bg-field active:scale-[0.97] focus:border-ink focus:ring-4 focus:ring-black/10 ${isOpen ? 'border-ink ring-4 ring-black/10' : ''}`
        } ${className}`}
      >
        <span className={selectedOption ? "text-ink" : "text-muted"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-muted transition-transform duration-200 ease-[var(--ease-out)] shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-field border border-line rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-[opacity,transform] duration-200 ease-[var(--ease-out)] opacity-100 scale-100 starting:opacity-0 starting:scale-[0.97] origin-top">
          <ul 
            id={`${resolvedId}-listbox`}
            role="listbox"
            className="py-1 m-0 list-none max-h-60 overflow-y-auto"
          >
            {options.map((option, idx) => (
              <li key={option.value} role="option" aria-selected={value === option.value}>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 ease-[var(--ease-out)] hover:bg-band ${
                    focusedIndex === idx ? 'bg-band' : ''
                  } ${
                    value === option.value ? 'bg-band font-semibold text-ink' : 'text-muted'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
