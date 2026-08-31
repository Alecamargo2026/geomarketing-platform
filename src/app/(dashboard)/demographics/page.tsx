'use client'

import { useState, useEffect } from 'react'

interface DemographicData {
  ibgeCode: number
  cityName: string
  state: string
  region: string
  population: number
  areaKm2: number
  density: number
  pibTotal: number
  pibPerCapita: number
  incomePerCapita: number
  numCompanies: number
  commercialDensity: number
  potentialScore: number
}

export default function DemographicsPage() {
  const [demographics, setDemographics] = useState<DemographicData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedState, setSelectedState] = useState('')
  const [minPotential, setMinPotential] = useState(0)

  useEffect(() => {
    fetchDemographics()
  }, [selectedState, minPotential])

  const fetchDemographics = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedState) params.append('state', selectedState)
      if (minPotential) params.append('minPotential', minPotential.toString())

      const response = await fetch(`/api/demographics?${params}`)
      const result = await response.json()
      setDemographics(result.data || [])
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPopulation = demographics.reduce((sum, d) => sum + d.population, 0)
  const avgPotential = demographics.length > 0 ? demographics.reduce((sum, d) => sum + d.potentialScore, 0) / demographics.length : 0
  const highPotentialCities = demographics.filter((d) => d.potentialScore >= 80).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análise Demográfica</h1>
        <p className="text-gray-600 mt-2">Dados de população, renda e potencial comercial por cidade</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">População Total</h3>
          <p className="text-3xl font-bold text-blue-600">{(totalPopulation / 1000000).toFixed(1)}M</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Potencial Médio</h3>
          <p className="text-3xl font-bold text-green-600">{avgPotential.toFixed(1)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Cidades Alto Potencial</h3>
          <p className="text-3xl font-bold text-orange-600">{highPotentialCities}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total de Cidades</h3>
          <p className="text-3xl font-bold text-purple-600">{demographics.length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Estado</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os estados</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="SP">São Paulo</option>
              <option value="MG">Minas Gerais</option>
              <option value="BA">Bahia</option>
              <option value="RS">Rio Grande do Sul</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Potencial Mínimo</label>
            <input
              type="range"
              min="0"
              max="100"
              value={minPotential}
              onChange={(e) => setMinPotential(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{minPotential}</span>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Cidades por Potencial</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-600">Carregando dados...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cidade</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">População</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Renda per Capita</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Potencial</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Classificação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {demographics.map((city) => (
                  <tr key={city.ibgeCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{city.cityName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{city.state}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{(city.population / 1000).toFixed(0)}k</td>
                    <td className="px-6 py-4 text-sm text-gray-600">R$ {(city.incomePerCapita / 1000).toFixed(1)}k</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{city.potentialScore.toFixed(1)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          city.potentialScore >= 80
                            ? 'bg-red-100 text-red-800'
                            : city.potentialScore >= 60
                            ? 'bg-orange-100 text-orange-800'
                            : city.potentialScore >= 40
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {city.potentialScore >= 80
                          ? 'Muito Alto'
                          : city.potentialScore >= 60
                          ? 'Alto'
                          : city.potentialScore >= 40
                          ? 'Médio'
                          : 'Baixo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
