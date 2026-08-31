'use client'

import React, { useState, useCallback } from 'react'
import './Sidebar.css'

export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  submenu?: SidebarItem[]
  active?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  onItemClick?: (item: SidebarItem) => void
  logo?: React.ReactNode
  logoText?: string
}

export default function Sidebar({
  items,
  collapsed = false,
  onCollapse,
  onItemClick,
  logo,
  logoText = 'Geomarketing',
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const handleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapse?.(newCollapsed)
  }, [isCollapsed, onCollapse])

  const handleItemClick = useCallback((item: SidebarItem) => {
    if (item.submenu && item.submenu.length > 0) {
      setExpandedItems(prev => {
        const newSet = new Set(prev)
        if (newSet.has(item.id)) {
          newSet.delete(item.id)
        } else {
          newSet.add(item.id)
        }
        return newSet
      })
    }
    onItemClick?.(item)
    item.onClick?.()
  }, [onItemClick])

  const renderItem = (item: SidebarItem, level = 0) => {
    const isExpanded = expandedItems.has(item.id)
    const hasSubmenu = item.submenu && item.submenu.length > 0

    return (
      <div key={item.id} className={`sidebar__item sidebar__item--level-${level}`}>
        <button
          className={`sidebar__button ${item.active ? 'sidebar__button--active' : ''} ${hasSubmenu ? 'sidebar__button--expandable' : ''}`}
          onClick={() => handleItemClick(item)}
          aria-expanded={hasSubmenu ? isExpanded : undefined}
        >
          {item.icon && <span className="sidebar__icon">{item.icon}</span>}
          {!isCollapsed && <span className="sidebar__label">{item.label}</span>}
          {hasSubmenu && !isCollapsed && (
            <span className={`sidebar__arrow ${isExpanded ? 'sidebar__arrow--expanded' : ''}`}>
              ▼
            </span>
          )}
        </button>

        {hasSubmenu && isExpanded && !isCollapsed && (
          <div className="sidebar__submenu">
            {item.submenu!.map(subitem => renderItem(subitem, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        {logo && <div className="sidebar__logo">{logo}</div>}
        {!isCollapsed && <span className="sidebar__logo-text">{logoText}</span>}
        <button
          className="sidebar__collapse-btn"
          onClick={handleCollapse}
          aria-label={isCollapsed ? 'Expandir menu' : 'Colapsar menu'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar__nav">
        {items.map(item => renderItem(item))}
      </nav>
    </aside>
  )
}
