'use client'

import React from 'react'
import './Switch.css'

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  switchSize?: 'sm' | 'md' | 'lg'
}

/**
 * Componente Switch (Toggle) customizado
 * Segue padrões WCAG 2.1 AA
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, switchSize = 'md', id, className = '', ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={`switch-group ${className}`.trim()}>
        <label htmlFor={switchId} className={`switch switch--${switchSize}`}>
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            className="switch__input"
            {...props}
          />
          <span className="switch__slider" aria-hidden="true" />
          {label && <span className="switch__label">{label}</span>}
        </label>
      </div>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
