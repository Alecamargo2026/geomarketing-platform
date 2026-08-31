'use client'

import React, { useState, useCallback } from 'react'
import Button from '@/components/Button/Button'
import Spinner from '@/components/Spinner/Spinner'
import './ExpandableCard.css'

export interface ExpandableCardProps {
  id: string
  title: string
  subtitle?: string
  summary?: React.ReactNode
  details?: React.ReactNode
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onExpand?: (id: string) => void
  onCollapse?: (id: string) => void
  onAction?: (id: string, action: string) => void
  actions?: Array<{ id: string; label: string; variant?: string }>
  children?: React.ReactNode
}

export default function ExpandableCard({
  id,
  title,
  subtitle,
  summary,
  details,
  isLoading = false,
  isError = false,
  errorMessage,
  onExpand,
  onCollapse,
  onAction,
  actions = [],
  children,
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = useCallback(() => {
    if (isExpanded) {
      setIsExpanded(false)
      onCollapse?.(id)
    } else {
      setIsExpanded(true)
      onExpand?.(id)
    }
  }, [isExpanded, id, onExpand, onCollapse])

  const handleAction = useCallback((actionId: string) => {
    onAction?.(id, actionId)
  }, [id, onAction])

  return (
    <div className={`expandable-card ${isExpanded ? 'expandable-card--expanded' : ''}`}>
      <div className="expandable-card__header" onClick={handleToggle}>
        <div className="expandable-card__title-section">
          <h3 className="expandable-card__title">{title}</h3>
          {subtitle && <p className="expandable-card__subtitle">{subtitle}</p>}
        </div>
        <button
          className="expandable-card__toggle"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Colapsar' : 'Expandir'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {!isExpanded && summary && (
        <div className="expandable-card__summary">
          {summary}
        </div>
      )}

      {isExpanded && (
        <div className="expandable-card__content">
          {isLoading ? (
            <div className="expandable-card__loading">
              <Spinner size="md" />
              <p>Carregando...</p>
            </div>
          ) : isError ? (
            <div className="expandable-card__error">
              <p className="expandable-card__error-message">
                {errorMessage || 'Erro ao carregar dados'}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAction?.(id, 'retry')}
              >
                Tentar Novamente
              </Button>
            </div>
          ) : (
            <>
              {details && (
                <div className="expandable-card__details">
                  {details}
                </div>
              )}
              {children && (
                <div className="expandable-card__children">
                  {children}
                </div>
              )}
            </>
          )}

          {actions.length > 0 && !isLoading && !isError && (
            <div className="expandable-card__actions">
              {actions.map(action => (
                <Button
                  key={action.id}
                  variant={(action.variant as any) || 'secondary'}
                  size="sm"
                  onClick={() => handleAction(action.id)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
