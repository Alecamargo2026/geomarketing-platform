'use client'

import React, { forwardRef } from 'react'
import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'warning' | 'icon' | 'fab' | 'group' | 'split'
export type ButtonSize = 'sm' | 'md' | 'lg'
export type ButtonState = 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading' | 'success' | 'error'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  state?: ButtonState
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  isSuccess?: boolean
  isError?: boolean
  tooltip?: string
  ariaLabel?: string
  fullWidth?: boolean
  children?: React.ReactNode
}

/**
 * Componente Button profissional com suporte a múltiplas variantes
 * Segue padrões WCAG 2.1 AA com contraste mínimo 4.5:1
 * 
 * @example
 * <Button variant="primary" size="md">Clique aqui</Button>
 * <Button variant="icon" icon={<SearchIcon />} tooltip="Buscar" />
 * <Button variant="fab" icon={<PlusIcon />} />
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      state = 'default',
      icon,
      iconPosition = 'left',
      isLoading = false,
      isSuccess = false,
      isError = false,
      tooltip,
      ariaLabel,
      fullWidth = false,
      className = '',
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    // Determinar estado baseado em props
    let computedState = state
    if (isLoading) computedState = 'loading'
    if (isSuccess) computedState = 'success'
    if (isError) computedState = 'error'
    if (disabled) computedState = 'disabled'

    const buttonClasses = [
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      `btn--${computedState}`,
      fullWidth && 'btn--full-width',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        title={tooltip}
        {...props}
      >
        {/* Ícone à esquerda */}
        {icon && iconPosition === 'left' && (
          <span className="btn__icon btn__icon--left" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Conteúdo */}
        {isLoading ? (
          <span className="btn__spinner" aria-hidden="true">
            <svg className="btn__spinner-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" strokeWidth="2" />
            </svg>
          </span>
        ) : isSuccess ? (
          <span className="btn__success-icon" aria-hidden="true">
            ✓
          </span>
        ) : isError ? (
          <span className="btn__error-icon" aria-hidden="true">
            ✕
          </span>
        ) : (
          children && <span className="btn__text">{children}</span>
        )}

        {/* Ícone à direita */}
        {icon && iconPosition === 'right' && (
          <span className="btn__icon btn__icon--right" aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
