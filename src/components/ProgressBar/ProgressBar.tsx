'use client'

import React from 'react'
import './ProgressBar.css'

export interface ProgressBarProps {
  value: number
  max?: number
  variant?: 'primary' | 'success' | 'danger' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  label?: string | boolean
  className?: string
}

/**
 * Componente ProgressBar profissional
 * Segue padrões WCAG 2.1 AA
 */
export default function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  animated = false,
  label,
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const progressClasses = [
    'progress',
    `progress--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const barClasses = [
    'progress__bar',
    `progress__bar--${variant}`,
    animated && 'progress__bar--animated',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={progressClasses}>
      {label && (
        <div className="progress__label">
          {label === true ? `${Math.round(percentage)}%` : label}
        </div>
      )}
      <div className="progress__container" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
        <div className={barClasses} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
