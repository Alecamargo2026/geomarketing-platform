'use client'

import React from 'react'
import './Textarea.css'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  required?: boolean
}

/**
 * Componente Textarea profissional
 * Segue padrões WCAG 2.1 AA
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      variant = 'default',
      size = 'md',
      fullWidth = false,
      required = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${textareaId}-error` : undefined
    const hintId = hint ? `${textareaId}-hint` : undefined

    const groupClasses = [
      'textarea-group',
      fullWidth && 'textarea-group--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const textareaClasses = [
      'textarea',
      `textarea--${variant}`,
      `textarea--${size}`,
      error && 'textarea--error',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={groupClasses}>
        {label && (
          <label htmlFor={textareaId} className="textarea__label">
            {label}
            {required && <span className="textarea__required">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={textareaClasses}
          aria-invalid={!!error}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          {...props}
        />

        {error && (
          <p id={errorId} className="textarea__error">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="textarea__hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
