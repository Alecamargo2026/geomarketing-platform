'use client'

import React from 'react'
import './Stat.css'

export interface StatProps {
  label: string
  value: string | number
  change?: {
    value: number
    direction: 'up' | 'down'
    period: string
  }
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'info'
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

/**
 * Componente Stat para exibir KPIs e estatísticas
 * Segue padrões WCAG 2.1 AA
 */
export default function Stat({
  label,
  value,
  change,
  icon,
  color = 'primary',
  trend,
  className = '',
}: StatProps) {
  const statClasses = [
    'stat',
    `stat--${color}`,
    trend && `stat--trend-${trend}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={statClasses}>
      {icon && <div className="stat__icon">{icon}</div>}

      <div className="stat__content">
        <p className="stat__label">{label}</p>
        <p className="stat__value">{value}</p>

        {change && (
          <p className={`stat__change stat__change--${change.direction}`}>
            <span className="stat__change-icon">
              {change.direction === 'up' ? '↑' : '↓'}
            </span>
            {Math.abs(change.value)}% {change.period}
          </p>
        )}
      </div>
    </div>
  )
}
