'use client'

import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Faturamento Total</p>
          <p className="text-3xl font-bold text-primary mt-2">R$ 4.223.313</p>
          <p className="text-green-600 text-sm mt-2">+12% vs mês anterior</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Clientes Ativos</p>
          <p className="text-3xl font-bold text-primary mt-2">118</p>
          <p className="text-green-600 text-sm mt-2">+5 novos clientes</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Cobertura Territorial</p>
          <p className="text-3xl font-bold text-primary mt-2">46 bairros</p>
          <p className="text-yellow-600 text-sm mt-2">114 bairros sem clientes</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Potencial Não Explorado</p>
          <p className="text-3xl font-bold text-primary mt-2">R$ 2.1M</p>
          <p className="text-blue-600 text-sm mt-2">Oportunidade de expansão</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <a
              href="/import"
              className="block px-4 py-3 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 font-medium transition"
            >
              📤 Importar Dados
            </a>
            <a
              href="/customers"
              className="block px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium transition"
            >
              👥 Gerenciar Clientes
            </a>
            <a
              href="/zones"
              className="block px-4 py-3 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 font-medium transition"
            >
              🗺️ Zonas Brancas
            </a>
            <a
              href="/priorities"
              className="block px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 font-medium transition"
            >
              📍 Prioridades de Visita
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informações da Conta</h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-600">Nome</p>
              <p className="font-medium text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Função</p>
              <p className="font-medium text-gray-800 capitalize">{user?.role}</p>
            </div>
            <div>
              <p className="text-gray-600">Empresa</p>
              <p className="font-medium text-gray-800">{user?.tenantId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
