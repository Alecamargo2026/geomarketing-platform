'use client'

import React, { ReactNode } from 'react'
import './Card.css'

export interface CardProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  isExpanded?: boolean
  onExpand?: () => void
  isLoading?: boolean
  error?: string
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'filled'
  size?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
}

/**
 * Componente Card profissional com suporte a expansão dinâmica
 * Segue padrões Material Design 3
 * 
 * @example
 * <Card title="Bairro: Leblon" icon={<MapIcon />}>
 *   <p>Dados demográficos...</p>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      subtitle,
      icon,
      children,
      footer,
      isExpanded = false,
      onExpand,
      isLoading = false,
      error,
      className = '',
      variant = 'default',
      size = 'md',
      hoverable = false,
      clickable = false,
    },
    ref
  ) => {
    const cardClasses = [
      'card',
      `card--${variant}`,
      `card--${size}`,
      isExpanded && 'card--expanded',
      hoverable && 'card--hoverable',
      clickable && 'card--clickable',
      error && 'card--error',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={clickable && onExpand ? onExpand : undefined}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={
          clickable && onExpand
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onExpand()
                }
              }
            : undefined
        }
      >
        {/* Header */}
        {(title || icon) && (
          <div className="card__header">
            {icon && <div className="card__icon">{icon}</div>}
            <div className="card__title-group">
              {title && <h3 className="card__title">{title}</h3>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </div>
            {onExpand && (
              <button
                className="card__expand-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onExpand()
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Recolher' : 'Expandir'}
              >
                <svg
                  className="card__expand-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="card__content">
          {isLoading ? (
            <div className="card__skeleton">
              <div className="card__skeleton-line" />
              <div className="card__skeleton-line" />
              <div className="card__skeleton-line" style={{ width: '80%' }} />
            </div>
          ) : error ? (
            <div className="card__error">
              <p className="card__error-text">{error}</p>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && <div className="card__footer">{footer}</div>}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
