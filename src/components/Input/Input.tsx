'use client'

import React, { forwardRef } from 'react'
import './Input.css'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  fullWidth?: boolean
  required?: boolean
}

/**
 * Componente Input profissional com suporte a múltiplas variantes
 * Segue padrões WCAG 2.1 AA
 * 
 * @example
 * <Input 
 *   label="Email" 
 *   type="email" 
 *   placeholder="seu@email.com"
 *   error={emailError}
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      variant = 'default',
      size = 'md',
      isLoading = false,
      isSuccess = false,
      isError = false,
      fullWidth = false,
      required = false,
      className = '',
      id,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    const containerClasses = [
      'input-group',
      fullWidth && 'input-group--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const inputClasses = [
      'input',
      `input--${variant}`,
      `input--${size}`,
      icon && `input--icon-${iconPosition}`,
      (isLoading || isSuccess || isError) && 'input--with-status',
      error && 'input--error',
      disabled && 'input--disabled',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className="input__label">
            {label}
            {required && <span className="input__required">*</span>}
          </label>
        )}

        <div className="input__wrapper">
          {icon && iconPosition === 'left' && (
            <span className="input__icon input__icon--left" aria-hidden="true">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            disabled={disabled || isLoading}
            aria-invalid={!!error}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            {...props}
          />

          {isLoading && (
            <span className="input__status input__status--loading" aria-hidden="true">
              <svg className="input__spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" />
              </svg>
            </span>
          )}

          {isSuccess && (
            <span className="input__status input__status--success" aria-hidden="true">
              ✓
            </span>
          )}

          {isError && (
            <span className="input__status input__status--error" aria-hidden="true">
              ✕
            </span>
          )}

          {icon && iconPosition === 'right' && (
            <span className="input__icon input__icon--right" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} className="input__error">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="input__hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
