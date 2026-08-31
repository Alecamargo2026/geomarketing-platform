'use client'

import React, { useState } from 'react'
import './Alert.css'

export interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'danger'
  icon?: React.ReactNode
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

/**
 * Componente Alert profissional para mensagens de status
 * Segue padrões WCAG 2.1 AA
 * 
 * @example
 * <Alert variant="success" title="Sucesso">
 *   Dados importados com sucesso!
 * </Alert>
 */
export default function Alert({
  children,
  variant = 'info',
  icon,
  title,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  const alertClasses = [
    'alert',
    `alert--${variant}`,
    dismissible && 'alert--dismissible',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const roleMap = {
    info: 'status',
    success: 'status',
    warning: 'alert',
    danger: 'alert',
  }

  return (
    <div className={alertClasses} role={roleMap[variant]} aria-live="polite">
      <div className="alert__content">
        {icon && <span className="alert__icon">{icon}</span>}

        <div className="alert__body">
          {title && <h3 className="alert__title">{title}</h3>}
          <p className="alert__message">{children}</p>
        </div>
      </div>

      {dismissible && (
        <button
          type="button"
          className="alert__dismiss"
          onClick={handleDismiss}
          aria-label="Fechar alerta"
        >
          ✕
        </button>
      )}
    </div>
  )
}
