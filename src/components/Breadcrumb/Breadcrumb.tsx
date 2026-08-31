'use client'

import React from 'react'
import './Breadcrumb.css'

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
  disabled?: boolean
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: string | React.ReactNode
  className?: string
}

/**
 * Componente Breadcrumb profissional para navegação
 * Segue padrões WCAG 2.1 AA
 * 
 * @example
 * <Breadcrumb 
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Clientes' }
 *   ]}
 * />
 */
export default function Breadcrumb({
  items,
  separator = '/',
  className = '',
}: BreadcrumbProps) {
  const breadcrumbClasses = ['breadcrumb', className].filter(Boolean).join(' ')

  return (
    <nav className={breadcrumbClasses} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="breadcrumb__item">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="breadcrumb__link"
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault()
                      item.onClick()
                    }
                  }}
                  aria-disabled={item.disabled}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={[
                    'breadcrumb__text',
                    isLast && 'breadcrumb__text--current',
                    item.disabled && 'breadcrumb__text--disabled',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
