'use client'

import React, { useState, useCallback } from 'react'
import './Tabs.css'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
  badge?: string | number
}

export interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  variant?: 'default' | 'pills' | 'underline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onChange?: (tabId: string) => void
  className?: string
}

/**
 * Componente Tabs profissional com suporte a ícones e badges
 * Segue padrões WCAG 2.1 AA
 * 
 * @example
 * <Tabs 
 *   tabs={[
 *     { id: 'overview', label: 'Visão Geral', content: <Overview /> },
 *     { id: 'details', label: 'Detalhes', content: <Details /> }
 *   ]}
 *   defaultTab="overview"
 * />
 */
export default function Tabs({
  tabs,
  defaultTab,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  onChange,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const handleTabChange = useCallback(
    (tabId: string) => {
      const tab = tabs.find((t) => t.id === tabId)
      if (tab && !tab.disabled) {
        setActiveTab(tabId)
        onChange?.(tabId)
      }
    },
    [tabs, onChange]
  )

  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    const tabIds = tabs.filter((t) => !t.disabled).map((t) => t.id)
    const currentIndex = tabIds.indexOf(tabId)

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1
        handleTabChange(tabIds[prevIndex])
        break
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0
        handleTabChange(tabIds[nextIndex])
        break
      case 'Home':
        e.preventDefault()
        handleTabChange(tabIds[0])
        break
      case 'End':
        e.preventDefault()
        handleTabChange(tabIds[tabIds.length - 1])
        break
    }
  }

  const containerClasses = [
    'tabs',
    `tabs--${variant}`,
    `tabs--${size}`,
    fullWidth && 'tabs--full-width',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const activeTabContent = tabs.find((t) => t.id === activeTab)

  return (
    <div className={containerClasses}>
      <div className="tabs__header" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            className={[
              'tabs__button',
              activeTab === tab.id && 'tabs__button--active',
              tab.disabled && 'tabs__button--disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="tabs__icon">{tab.icon}</span>}
            <span className="tabs__label">{tab.label}</span>
            {tab.badge && (
              <span className="tabs__badge" aria-label={`${tab.badge} notificações`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="tabs__content">
        {activeTabContent && (
          <div
            role="tabpanel"
            id={`${activeTab}-panel`}
            aria-labelledby={`${activeTab}-tab`}
            className="tabs__panel"
          >
            {activeTabContent.content}
          </div>
        )}
      </div>
    </div>
  )
}
