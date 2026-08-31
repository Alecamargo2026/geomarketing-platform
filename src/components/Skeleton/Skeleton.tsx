'use client'

import React from 'react'
import './Skeleton.css'

export interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rect'
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}

/**
 * Componente Skeleton para placeholder de carregamento
 * Segue padrões WCAG 2.1 AA
 */
export default function Skeleton({
  variant = 'text',
  width = '100%',
  height = '20px',
  count = 1,
  className = '',
}: SkeletonProps) {
  const skeletons = Array.from({ length: count })

  const skeletonClasses = [
    'skeleton',
    `skeleton--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="skeleton-group">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={skeletonClasses}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
          }}
          aria-busy="true"
          aria-label="Carregando..."
        />
      ))}
    </div>
  )
}
