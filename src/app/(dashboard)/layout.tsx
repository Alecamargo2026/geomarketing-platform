'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">GeoMarketing</h1>
        </div>
        <nav className="p-6 space-y-4">
          <a href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Dashboard
          </a>
          <a href="/import" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Importar Dados
          </a>
          <a href="/customers" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Clientes
          </a>
          <a href="/zones" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Zonas Brancas
          </a>
          <a href="/priorities" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Prioridades
          </a>
          <a href="/settings" className="block px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            Configurações
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Bem-vindo, {user.name}</h2>
          <button
            onClick={() => {
              useAuthStore.setState({ user: null, token: null })
              router.push('/login')
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Sair
          </button>
        </header>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
