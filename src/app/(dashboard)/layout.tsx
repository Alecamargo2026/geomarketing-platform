'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router, mounted])

  if (!mounted || isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    useAuthStore.setState({ user: null, token: null })
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">GeoMarketing</h1>
          <p className="text-xs text-gray-500 mt-1">Inteligência Comercial</p>
        </div>
        
        <nav className="p-4 space-y-2">
          <NavLink href="/dashboard" label="📊 Dashboard" />
          <NavLink href="/import" label="📥 Importar Dados" />
          <NavLink href="/customers" label="👥 Clientes" />
          <NavLink href="/demographics" label="📈 Análise Demográfica" />
          <NavLink href="/white-zones" label="🗺️ Zonas Brancas" />
          <NavLink href="/priorities" label="⭐ Prioridades" />
          <NavLink href="/settings" label="⚙️ Configurações" />
        </nav>

        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-600">Usuário</p>
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'Demo User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'demo@example.com'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Bem-vindo, {user?.name || 'Demo User'}</h2>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('pt-BR')}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Verificar se a rota atual é a ativa
    if (typeof window !== 'undefined') {
      setIsActive(window.location.pathname === href)
    }
  }, [href])

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        router.push(href)
      }}
      className={`block px-4 py-2 rounded-lg transition ${
        isActive
          ? 'bg-blue-100 text-blue-700 font-semibold'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </a>
  )
}
