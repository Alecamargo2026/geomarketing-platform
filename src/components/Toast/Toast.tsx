'use client'

import React from 'react'
import './Toast.css'

export interface ToastProps {
  message: string
  variant?: 'info' | 'success' | 'danger' | 'warning'
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Componente Toast para notificações flutuantes
 * Segue padrões WCAG 2.1 AA
 */
export default function Toast({
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  action,
}: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (duration <= 0) return

    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)
    
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const toastClasses = [
    'toast',
    `toast--${variant}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={toastClasses} role="status" aria-live="polite">
      <p className="toast__message">{message}</p>
      {action && (
        <button className="toast__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
      <button
        className="toast__close"
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  )
}
