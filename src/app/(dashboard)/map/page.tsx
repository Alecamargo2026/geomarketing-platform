'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { LocationDetails } from '@/components/LocationDetails'

// Importar mapa dinamicamente (client-only)
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap').then(mod => ({ default: mod.InteractiveMap })), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">Carregando mapa...</div>,
})

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string
    type: 'state' | 'city' | 'neighborhood'
    coordinates: [number, number]
  } | null>(null)

  // Dados mock de cobertura por estado
  const coverageData: Record<string, number> = {
    'Rio de Janeiro': 65,
    'São Paulo': 45,
    'Minas Gerais': 30,
    'Bahia': 25,
    'Ceará': 20,
    'Pernambuco': 35,
    'Paraná': 40,
    'Santa Catarina': 50,
    'Rio Grande do Sul': 55,
    'Distrito Federal': 70,
    'Goiás': 15,
    'Mato Grosso': 10,
    'Mato Grosso do Sul': 12,
    'Espírito Santo': 38,
    'Maranhão': 8,
    'Piauí': 5,
    'Paraíba': 18,
    'Rio Grande do Norte': 22,
    'Alagoas': 12,
    'Sergipe': 10,
    'Pará': 5,
    'Amazonas': 3,
    'Roraima': 2,
    'Amapá': 2,
    'Acre': 1,
    'Rondônia': 4,
    'Tocantins': 6,
  }

  // Dados mock de detalhes por localização
  const getLocationData = (location: typeof selectedLocation) => {
    if (!location) return null

    const baseData = {
      totalClients: Math.floor(Math.random() * 500) + 50,
      revenue: Math.floor(Math.random() * 5000000) + 500000,
      coverage: coverageData[location.name] || Math.floor(Math.random() * 100),
      potential: Math.floor(Math.random() * 10000000) + 1000000,
      uncoveredPotential: Math.floor(Math.random() * 5000000) + 500000,
      competitors: Math.floor(Math.random() * 10) + 1,
      commercialDensity: Math.random() * 50 + 5,
      clients: Array.from({ length: 5 }, (_, i) => ({
        id: `client-${i}`,
        name: `Cliente ${i + 1}`,
        cnpj: `${Math.floor(Math.random() * 99999999)}.0001-${Math.floor(Math.random() * 99)}`,
        lastPurchase: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        averageTicket: Math.floor(Math.random() * 50000) + 5000,
        frequency: ['Semanal', 'Quinzenal', 'Mensal', 'Bimestral'][Math.floor(Math.random() * 4)],
      })),
    }

    return baseData
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mapa Interativo</h1>
        <p className="text-gray-600 mt-2">
          Explore a cobertura territorial, potencial de mercado e oportunidades de expansão
        </p>
      </div>

      {/* Mapa e Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa (2/3) */}
        <div className="lg:col-span-2 h-[600px]">
          <InteractiveMap
            onLocationSelect={setSelectedLocation}
            coverageData={coverageData}
          />
        </div>

        {/* Detalhes (1/3) */}
        <div className="h-[600px]">
          <LocationDetails
            location={selectedLocation || undefined}
            data={getLocationData(selectedLocation)}
          />
        </div>
      </div>

      {/* Filtros e Legenda */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtros e Análise</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visualizar por
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Cobertura (%)</option>
              <option>Potencial (R$)</option>
              <option>Clientes (Qtd)</option>
              <option>Faturamento (R$)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Região
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Todas</option>
              <option>Sudeste</option>
              <option>Nordeste</option>
              <option>Sul</option>
              <option>Centro-Oeste</option>
              <option>Norte</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Potencial
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Todos</option>
              <option>Muito Alto (80-100%)</option>
              <option>Alto (60-79%)</option>
              <option>Médio (40-59%)</option>
              <option>Baixo (20-39%)</option>
              <option>Muito Baixo (0-19%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ação
            </label>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              📊 Gerar Relatório
            </button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">27</p>
            <p className="text-sm text-gray-600">Estados Mapeados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">45%</p>
            <p className="text-sm text-gray-600">Cobertura Média</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">R$ 2.1M</p>
            <p className="text-sm text-gray-600">Potencial Não Explorado</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">1.250</p>
            <p className="text-sm text-gray-600">Cidades Analisadas</p>
          </div>
        </div>
      </div>

      {/* Recomendações */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">🎯 Recomendações de Expansão</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Top 3 Oportunidades</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ São Paulo - Potencial: R$ 5.2M</li>
              <li>✓ Minas Gerais - Potencial: R$ 3.8M</li>
              <li>✓ Bahia - Potencial: R$ 2.9M</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Zonas Críticas</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>⚠️ Acre - Cobertura: 1%</li>
              <li>⚠️ Amazonas - Cobertura: 3%</li>
              <li>⚠️ Roraima - Cobertura: 2%</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Próximos Passos</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>→ Planejar expansão para SP</li>
              <li>→ Aumentar frequência em RJ</li>
              <li>→ Prospectar em MG</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
