'use client'

import React from 'react'
import './Badge.css'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  rounded?: boolean
  outline?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

/**
 * Componente Badge profissional para rótulos e status
 * Segue padrões WCAG 2.1 AA
 * 
 * @example
 * <Badge variant="success">Ativo</Badge>
 * <Badge variant="danger" dismissible onDismiss={handleDismiss}>Erro</Badge>
 */
export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  rounded = false,
  outline = false,
  dismissible = false,
  onDismiss,
  className = '',
}: BadgeProps) {
  const badgeClasses = [
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    rounded && 'badge--rounded',
    outline && 'badge--outline',
    dismissible && 'badge--dismissible',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={badgeClasses}>
      {icon && iconPosition === 'left' && (
        <span className="badge__icon badge__icon--left">{icon}</span>
      )}

      <span className="badge__content">{children}</span>

      {icon && iconPosition === 'right' && (
        <span className="badge__icon badge__icon--right">{icon}</span>
      )}

      {dismissible && (
        <button
          type="button"
          className="badge__dismiss"
          onClick={onDismiss}
          aria-label={`Remover ${children}`}
        >
          ✕
        </button>
      )}
    </span>
  )
}
