'use client'

import React, { useState, useCallback } from 'react'
import './TopNav.css'

export interface TopNavProps {
  logo?: React.ReactNode
  title?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  notifications?: Array<{ id: string; message: string; read?: boolean }>
  onNotificationClick?: (id: string) => void
  userMenu?: Array<{ id: string; label: string; onClick?: () => void }>
  onUserMenuClick?: (id: string) => void
  onThemeToggle?: (isDark: boolean) => void
  isDarkMode?: boolean
}

export default function TopNav({
  logo,
  title = 'Dashboard',
  searchPlaceholder = 'Buscar...',
  onSearch,
  notifications = [],
  onNotificationClick,
  userMenu = [],
  onUserMenuClick,
  onThemeToggle,
  isDarkMode = false,
}: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }, [onSearch])

  const handleThemeToggle = useCallback(() => {
    onThemeToggle?.(!isDarkMode)
  }, [isDarkMode, onThemeToggle])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="topnav">
      <div className="topnav__left">
        {logo && <div className="topnav__logo">{logo}</div>}
        <h1 className="topnav__title">{title}</h1>
      </div>

      <div className="topnav__center">
        <div className="topnav__search">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            className="topnav__search-input"
            aria-label="Buscar"
          />
          <span className="topnav__search-icon">🔍</span>
        </div>
      </div>

      <div className="topnav__right">
        {/* Botão de Tema */}
        <button
          className="topnav__icon-btn"
          onClick={handleThemeToggle}
          aria-label={isDarkMode ? 'Modo claro' : 'Modo escuro'}
          title={isDarkMode ? 'Modo claro' : 'Modo escuro'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        {/* Notificações */}
        <div className="topnav__notifications">
          <button
            className="topnav__icon-btn topnav__icon-btn--with-badge"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notificações"
            aria-expanded={showNotifications}
          >
            🔔
            {unreadCount > 0 && (
              <span className="topnav__badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="topnav__dropdown topnav__dropdown--notifications">
              {notifications.length === 0 ? (
                <p className="topnav__empty">Sem notificações</p>
              ) : (
                <ul className="topnav__notification-list">
                  {notifications.map(notification => (
                    <li
                      key={notification.id}
                      className={`topnav__notification-item ${!notification.read ? 'topnav__notification-item--unread' : ''}`}
                      onClick={() => {
                        onNotificationClick?.(notification.id)
                        setShowNotifications(false)
                      }}
                    >
                      {notification.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Menu do Usuário */}
        <div className="topnav__user-menu">
          <button
            className="topnav__user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Menu do usuário"
            aria-expanded={showUserMenu}
          >
            👤
          </button>

          {showUserMenu && (
            <div className="topnav__dropdown topnav__dropdown--user">
              {userMenu.length === 0 ? (
                <p className="topnav__empty">Sem opções</p>
              ) : (
                <ul className="topnav__user-list">
                  {userMenu.map(item => (
                    <li key={item.id}>
                      <button
                        className="topnav__user-item"
                        onClick={() => {
                          onUserMenuClick?.(item.id)
                          item.onClick?.()
                          setShowUserMenu(false)
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
