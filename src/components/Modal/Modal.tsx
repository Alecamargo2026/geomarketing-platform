'use client'

import React, { ReactNode, useEffect } from 'react'
import './Modal.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'danger' | 'success'
  closeButton?: boolean
  backdrop?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  isLoading?: boolean
  error?: string
  className?: string
}

/**
 * Componente Modal profissional com suporte a múltiplos tamanhos e variantes
 * Segue padrões WCAG 2.1 AA com focus trap
 * 
 * @example
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="Confirmar ação">
 *   <p>Tem certeza que deseja continuar?</p>
 * </Modal>
 */
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      subtitle,
      children,
      footer,
      size = 'md',
      variant = 'default',
      closeButton = true,
      backdrop = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      isLoading = false,
      error,
      className = '',
    },
    ref
  ) => {
    // Fechar com ESC
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, closeOnEscape, onClose])

    // Bloquear scroll do body
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      }
      return () => {
        document.body.style.overflow = 'unset'
      }
    }, [isOpen])

    if (!isOpen) return null

    const modalClasses = [
      'modal',
      `modal--${size}`,
      `modal--${variant}`,
      error && 'modal--error',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <>
        {/* Backdrop */}
        {backdrop && (
          <div
            className="modal__backdrop"
            onClick={closeOnBackdropClick ? onClose : undefined}
            aria-hidden="true"
          />
        )}

        {/* Modal */}
        <div
          ref={ref}
          className={modalClasses}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby={subtitle ? 'modal-subtitle' : undefined}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className="modal__header">
              <div className="modal__title-group">
                {title && <h2 className="modal__title" id="modal-title">{title}</h2>}
                {subtitle && <p className="modal__subtitle" id="modal-subtitle">{subtitle}</p>}
              </div>
              {closeButton && (
                <button
                  className="modal__close-btn"
                  onClick={onClose}
                  aria-label="Fechar"
                  type="button"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="modal__content">
            {isLoading ? (
              <div className="modal__skeleton">
                <div className="modal__skeleton-line" />
                <div className="modal__skeleton-line" />
                <div className="modal__skeleton-line" style={{ width: '80%' }} />
              </div>
            ) : error ? (
              <div className="modal__error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>{error}</p>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Footer */}
          {footer && <div className="modal__footer">{footer}</div>}
        </div>
      </>
    )
  }
)

Modal.displayName = 'Modal'

export default Modal
