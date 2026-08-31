'use client'

import React from 'react'
import './Radio.css'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
}

/**
 * Componente Radio customizado
 * Segue padrões WCAG 2.1 AA
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${radioId}-error` : undefined
    const hintId = hint ? `${radioId}-hint` : undefined

    return (
      <div className={`radio-group ${className}`.trim()}>
        <div className="radio__wrapper">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className="radio__input"
            aria-invalid={!!error}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          <label htmlFor={radioId} className="radio__label">
            <span className="radio__circle" aria-hidden="true" />
            {label}
          </label>
        </div>
        {error && (
          <p id={errorId} className="radio__error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="radio__hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
