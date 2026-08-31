'use client'

import React, { forwardRef, useState, useRef, useEffect } from 'react'
import './Select.css'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  options: SelectOption[]
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  isError?: boolean
  fullWidth?: boolean
  required?: boolean
  placeholder?: string
  searchable?: boolean
  clearable?: boolean
  multiple?: boolean
}

/**
 * Componente Select profissional com suporte a busca e múltiplas seleções
 * Segue padrões WCAG 2.1 AA
 * 
 * @example
 * <Select 
 *   label="Estado" 
 *   options={states}
 *   placeholder="Selecione um estado"
 *   searchable
 * />
 */
const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      options,
      variant = 'default',
      size = 'md',
      isLoading = false,
      isError = false,
      fullWidth = false,
      required = false,
      placeholder,
      searchable = false,
      clearable = false,
      multiple = false,
      className = '',
      id,
      disabled = false,
      value,
      onChange,
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${selectId}-error` : undefined
    const hintId = hint ? `${selectId}-hint` : undefined

    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [selectedValues, setSelectedValues] = useState<(string | number)[]>(
      multiple && value ? (Array.isArray(value) ? value : [value]) : []
    )
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Fechar dropdown ao clicar fora
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && 'current' in ref && ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        searchInputRef.current?.focus()
      }

      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Filtrar opções baseado na busca
    const filteredOptions = searchable
      ? options.filter((opt) =>
          opt.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options

    // Agrupar opções
    const groupedOptions = filteredOptions.reduce(
      (acc, opt) => {
        const group = opt.group || 'default'
        if (!acc[group]) acc[group] = []
        acc[group].push(opt)
        return acc
      },
      {} as Record<string, SelectOption[]>
    )

    const handleSelect = (optionValue: string | number) => {
      if (multiple) {
        const newValues = selectedValues.includes(optionValue)
          ? selectedValues.filter((v) => v !== optionValue)
          : [...selectedValues, optionValue]
        setSelectedValues(newValues)
        onChange?.({
          target: { value: newValues },
        } as any)
      } else {
        setSelectedValues([optionValue])
        onChange?.({
          target: { value: optionValue },
        } as any)
        setIsOpen(false)
      }
      setSearchValue('')
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedValues([])
      onChange?.({
        target: { value: multiple ? [] : '' },
      } as any)
    }

    const getDisplayValue = () => {
      if (selectedValues.length === 0) return placeholder || 'Selecione...'
      if (multiple) {
        return `${selectedValues.length} selecionado(s)`
      }
      const selected = options.find((opt) => opt.value === selectedValues[0])
      return selected?.label || ''
    }

    const containerClasses = [
      'select-group',
      fullWidth && 'select-group--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const selectClasses = [
      'select',
      `select--${variant}`,
      `select--${size}`,
      icon && 'select--with-icon',
      (isLoading || isError) && 'select--with-status',
      error && 'select--error',
      disabled && 'select--disabled',
      isOpen && 'select--open',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={containerClasses} ref={ref}>
        {label && (
          <label htmlFor={selectId} className="select__label">
            {label}
            {required && <span className="select__required">*</span>}
          </label>
        )}

        <div className="select__wrapper">
          {icon && <span className="select__icon">{icon}</span>}

          <button
            type="button"
            id={selectId}
            className={selectClasses}
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled || isLoading}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-invalid={!!error}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          >
            <span className="select__value">{getDisplayValue()}</span>
            <span className="select__arrow" aria-hidden="true">
              ▼
            </span>
          </button>

          {clearable && selectedValues.length > 0 && (
            <button
              type="button"
              className="select__clear"
              onClick={handleClear}
              aria-label="Limpar seleção"
            >
              ✕
            </button>
          )}

          {isLoading && (
            <span className="select__status select__status--loading" aria-hidden="true">
              <svg className="select__spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" />
              </svg>
            </span>
          )}

          {isError && (
            <span className="select__status select__status--error" aria-hidden="true">
              ✕
            </span>
          )}
        </div>

        {isOpen && (
          <div className="select__dropdown" role="listbox">
            {searchable && (
              <input
                ref={searchInputRef}
                type="text"
                className="select__search"
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                aria-label="Buscar opções"
              />
            )}

            <div className="select__options">
              {Object.entries(groupedOptions).map(([group, opts]) => (
                <div key={group}>
                  {group !== 'default' && (
                    <div className="select__group-label">{group}</div>
                  )}
                  {opts.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={[
                        'select__option',
                        selectedValues.includes(option.value) && 'select__option--selected',
                        option.disabled && 'select__option--disabled',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      disabled={option.disabled}
                      role="option"
                      aria-selected={selectedValues.includes(option.value)}
                    >
                      {multiple && (
                        <input
                          type="checkbox"
                          checked={selectedValues.includes(option.value)}
                          readOnly
                          className="select__checkbox"
                          aria-hidden="true"
                        />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              ))}

              {filteredOptions.length === 0 && (
                <div className="select__empty">Nenhuma opção encontrada</div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p id={errorId} className="select__error">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="select__hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
