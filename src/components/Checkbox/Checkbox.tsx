'use client'

import React from 'react'
import './Checkbox.css'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
  indeterminate?: boolean
}

/**
 * Componente Checkbox customizado
 * Segue padrões WCAG 2.1 AA
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, hint, indeterminate = false, id, className = '', ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${checkboxId}-error` : undefined
    const hintId = hint ? `${checkboxId}-hint` : undefined

    return (
      <div className={`checkbox-group ${className}`.trim()}>
        <div className="checkbox__wrapper">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="checkbox__input"
            aria-invalid={!!error}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          <label htmlFor={checkboxId} className="checkbox__label">
            <span className="checkbox__box" aria-hidden="true" />
            {label}
          </label>
        </div>
        {error && (
          <p id={errorId} className="checkbox__error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="checkbox__hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
