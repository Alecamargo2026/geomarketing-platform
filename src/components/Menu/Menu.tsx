'use client'

import React, { useState, useRef, useEffect } from 'react'
import './Menu.css'

export interface MenuItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  divider?: boolean
}

export interface MenuProps {
  items: MenuItem[]
  trigger: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

/**
 * Componente Menu dropdown profissional
 * Segue padrões WCAG 2.1 AA
 */
export default function Menu({
  items,
  trigger,
  position = 'bottom',
  className = '',
}: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const menuClasses = [
    'menu',
    `menu--${position}`,
    isOpen && 'menu--open',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={menuClasses} ref={containerRef}>
      <button
        className="menu__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>

      {isOpen && (
        <div className="menu__dropdown" role="menu">
          {items.map((item, index) =>
            item.divider ? (
              <div key={`divider-${index}`} className="menu__divider" />
            ) : (
              <button
                key={index}
                className={[
                  'menu__item',
                  item.disabled && 'menu__item--disabled',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  item.onClick?.()
                  setIsOpen(false)
                }}
                disabled={item.disabled}
                role="menuitem"
              >
                {item.icon && <span className="menu__icon">{item.icon}</span>}
                <span className="menu__label">{item.label}</span>
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
