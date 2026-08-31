'use client'

import { useState } from 'react'

interface LocationDetailsProps {
  location?: {
    name: string
    type: 'state' | 'city' | 'neighborhood'
  }
  data?: {
    totalClients: number
    revenue: number
    coverage: number
    potential: number
    uncoveredPotential: number
    competitors: number
    commercialDensity: number
    clients?: Array<{
      id: string
      name: string
      cnpj: string
      lastPurchase: string
      averageTicket: number
      frequency: string
    }> | null
  } | null
}

export function LocationDetails({ location, data }: LocationDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'analysis'>('overview')

  if (!location) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Selecione uma região no mapa</p>
      </div>
    )
  }

  const mockData = data || {
    totalClients: 0,
    revenue: 0,
    coverage: 0,
    potential: 0,
    uncoveredPotential: 0,
    competitors: 0,
    commercialDensity: 0,
    clients: [],
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{location.name}</h3>
        <p className="text-sm text-gray-500 capitalize">{location.type}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['overview', 'clients', 'analysis'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'overview' && 'Visão Geral'}
            {tab === 'clients' && 'Clientes'}
            {tab === 'analysis' && 'Análise'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-blue-600">{mockData.totalClients}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Faturamento</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {(mockData.revenue / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Cobertura</p>
                <p className="text-2xl font-bold text-purple-600">{mockData.coverage.toFixed(1)}%</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Potencial</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {(mockData.potential / 1000).toFixed(0)}k
                </p>
              </div>
            </div>

            {/* Detalhes */}
            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Potencial Não Explorado</span>
                <span className="font-semibold text-gray-800">
                  R$ {(mockData.uncoveredPotential / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Concorrentes</span>
                <span className="font-semibold text-gray-800">{mockData.competitors}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Densidade Comercial</span>
                <span className="font-semibold text-gray-800">
                  {mockData.commercialDensity.toFixed(2)} clientes/km²
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2 mt-6">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium">
                📍 Criar Rota
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium">
                ➕ Prospecto
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm font-medium">
                📥 Exportar
              </button>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="space-y-3">
            {mockData.clients && mockData.clients.length > 0 ? (
              mockData.clients.map((client) => (
                <div key={client.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.cnpj}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      R$ {client.averageTicket.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-600">
                    <span>Última compra: {client.lastPurchase}</span>
                    <span>Frequência: {client.frequency}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhum cliente nesta região</p>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Oportunidades</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Potencial não explorado: R$ {(mockData.uncoveredPotential / 1000).toFixed(0)}k</li>
                <li>✓ Densidade comercial: {mockData.commercialDensity.toFixed(2)} clientes/km²</li>
                <li>✓ Cobertura atual: {mockData.coverage.toFixed(1)}%</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Recomendações</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Expandir para {Math.ceil(mockData.totalClients * 0.3)} novos clientes</li>
                <li>• Aumentar frequência de visitas em {mockData.coverage < 50 ? 'zonas críticas' : 'regiões de alto potencial'}</li>
                <li>• Monitorar {mockData.competitors} concorrentes nesta região</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
