'use client'

import React, { useState, useCallback } from 'react'
import Sidebar, { SidebarItem } from './Sidebar'
import TopNav from './TopNav'
import './DashboardLayout.css'

export interface DashboardLayoutProps {
  children: React.ReactNode
  sidebarItems: SidebarItem[]
  topNavTitle?: string
  topNavLogo?: React.ReactNode
  onSidebarItemClick?: (item: SidebarItem) => void
  onSearch?: (query: string) => void
  notifications?: Array<{ id: string; message: string; read?: boolean }>
  userMenu?: Array<{ id: string; label: string; onClick?: () => void }>
}

export default function DashboardLayout({
  children,
  sidebarItems,
  topNavTitle = 'Dashboard',
  topNavLogo,
  onSidebarItemClick,
  onSearch,
  notifications = [],
  userMenu = [],
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSidebarCollapse = useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
  }, [])

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'dashboard-layout--sidebar-collapsed' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        collapsed={sidebarCollapsed}
        onCollapse={handleSidebarCollapse}
        onItemClick={onSidebarItemClick}
        logoText="Geomarketing"
      />

      {/* Main Content */}
      <div className="dashboard-layout__main">
        {/* TopNav */}
        <TopNav
          title={topNavTitle}
          logo={topNavLogo}
          onSearch={onSearch}
          notifications={notifications}
          userMenu={userMenu}
        />

        {/* Content Area */}
        <main className="dashboard-layout__content">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="dashboard-layout__overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
