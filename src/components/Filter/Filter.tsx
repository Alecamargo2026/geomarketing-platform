'use client'

import React from 'react'
import './Filter.css'

export interface FilterOption {
  key: string
  label: string
  type: 'text' | 'select' | 'date' | 'range'
  options?: { value: string; label: string }[]
}

export interface FilterProps {
  options: FilterOption[]
  onApply: (filters: Record<string, any>) => void
  onReset?: () => void
  className?: string
}

/**
 * Componente Filter para filtros avançados
 * Segue padrões WCAG 2.1 AA
 */
export default function Filter({
  options,
  onApply,
  onReset,
  className = '',
}: FilterProps) {
  const [filters, setFilters] = React.useState<Record<string, any>>({})

  const handleChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    onApply(filters)
  }

  const handleReset = () => {
    setFilters({})
    onReset?.()
  }

  const filterClasses = ['filter', className].filter(Boolean).join(' ')

  return (
    <div className={filterClasses}>
      <div className="filter__content">
        {options.map((option) => (
          <div key={option.key} className="filter__group">
            <label className="filter__label">{option.label}</label>
            {option.type === 'text' && (
              <input
                type="text"
                className="filter__input"
                value={filters[option.key] || ''}
                onChange={(e) => handleChange(option.key, e.target.value)}
                placeholder={`Filtrar por ${option.label.toLowerCase()}`}
              />
            )}
            {option.type === 'select' && (
              <select
                className="filter__select"
                value={filters[option.key] || ''}
                onChange={(e) => handleChange(option.key, e.target.value)}
              >
                <option value="">Selecione...</option>
                {option.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            {option.type === 'date' && (
              <input
                type="date"
                className="filter__input"
                value={filters[option.key] || ''}
                onChange={(e) => handleChange(option.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="filter__actions">
        <button className="filter__button filter__button--apply" onClick={handleApply}>
          Aplicar
        </button>
        <button className="filter__button filter__button--reset" onClick={handleReset}>
          Limpar
        </button>
      </div>
    </div>
  )
}
