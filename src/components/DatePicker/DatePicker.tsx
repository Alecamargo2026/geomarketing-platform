'use client'

import React from 'react'
import './DatePicker.css'

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
  fullWidth?: boolean
  required?: boolean
}

/**
 * Componente DatePicker profissional
 * Segue padrões WCAG 2.1 AA
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      label,
      error,
      hint,
      fullWidth = false,
      required = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const dateId = id || `date-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${dateId}-error` : undefined
    const hintId = hint ? `${dateId}-hint` : undefined

    const groupClasses = [
      'date-group',
      fullWidth && 'date-group--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const dateClasses = [
      'date-picker',
      error && 'date-picker--error',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={groupClasses}>
        {label && (
          <label htmlFor={dateId} className="date__label">
            {label}
            {required && <span className="date__required">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={dateId}
          type="date"
          className={dateClasses}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          {...props}
        />

        {error && (
          <p id={errorId} className="date__error">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="date__hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export default DatePicker
