'use client'

import React from 'react'
import './Spinner.css'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning'
  label?: string
  fullScreen?: boolean
  className?: string
}

/**
 * Componente Spinner profissional para indicar carregamento
 * Segue padrões WCAG 2.1 AA
 * 
 * @example
 * <Spinner size="md" label="Carregando..." />
 * <Spinner fullScreen variant="primary" />
 */
export default function Spinner({
  size = 'md',
  variant = 'default',
  label,
  fullScreen = false,
  className = '',
}: SpinnerProps) {
  const spinnerClasses = [
    'spinner',
    `spinner--${size}`,
    `spinner--${variant}`,
    fullScreen && 'spinner--full-screen',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <div className={spinnerClasses} role="status" aria-live="polite">
      <svg className="spinner__svg" viewBox="0 0 50 50">
        <circle
          className="spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="3"
        />
      </svg>
      {label && <p className="spinner__label">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="spinner__overlay" aria-hidden={!label}>
        {content}
      </div>
    )
  }

  return content
}
