'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useGeoData } from '@/hooks/useGeoData'
import { getPolygonCenter } from '@/services/geoService'

interface MapProps {
  onLocationSelect?: (location: {
    name: string
    type: 'state' | 'city' | 'neighborhood'
    coordinates: [number, number]
  }) => void
  highlightedRegion?: string
  coverageData?: Record<string, number>
}

export function InteractiveMap({
  onLocationSelect,
  coverageData = {},
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentLevel, setCurrentLevel] = useState<'brasil' | 'state' | 'city'>('brasil')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const { data: brasilData } = useGeoData('brasil-estados.json')
  const { data: citiesData } = useGeoData('brasil-cidades.json')

  useEffect(() => {
    if (!containerRef.current) return

    // Inicializar mapa
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView([-14.2, -51.9], 4)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)
    }

    // Limpar camadas anteriores
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) {
        mapRef.current?.removeLayer(layer)
      }
    })

    // Renderizar dados baseado no nível atual
    if (currentLevel === 'brasil' && brasilData) {
      renderBrasilMap(brasilData)
    } else if (currentLevel === 'state' && citiesData && selectedState) {
      renderStateMap(citiesData, selectedState)
    }
  }, [currentLevel, brasilData, citiesData, selectedState])

  const renderBrasilMap = (data: any) => {
    if (!mapRef.current) return

    L.geoJSON(data, {
      style: (feature: any) => {
        const coverage = coverageData[feature?.properties?.name] || 0
        const color = getCoverageColor(coverage)
        return {
          fillColor: color,
          weight: 2,
          opacity: 1,
          color: '#333',
          dashArray: '3',
          fillOpacity: 0.7,
        }
      },
      onEachFeature: (feature, layer) => {
        const stateName = feature.properties.name
        const coverage = coverageData[stateName] || 0

        layer.bindPopup(
          `<div class="p-2">
            <strong>${stateName}</strong><br/>
            Cobertura: ${coverage.toFixed(1)}%
          </div>`
        )

        layer.on('click', () => {
          setSelectedState(stateName)
          setCurrentLevel('state')
          const coords = (feature.geometry as any).coordinates
          onLocationSelect?.({
            name: stateName,
            type: 'state',
            coordinates: getPolygonCenter(coords),
          })
        })
      },
    }).addTo(mapRef.current)
  }

  const renderStateMap = (data: any, stateName: string) => {
    if (!mapRef.current) return

    const filteredCities = data.features.filter(
      (f: any) => f.properties.state === stateName
    )

    L.geoJSON(
      { type: 'FeatureCollection', features: filteredCities } as any,
      {
        style: () => ({
          fillColor: '#3b82f6',
          weight: 1,
          opacity: 1,
          color: '#1e40af',
          fillOpacity: 0.5,
        }),
        onEachFeature: (feature, layer) => {
          const cityName = feature.properties.name
          layer.bindPopup(`<strong>${cityName}</strong>`)
          layer.on('click', () => {
            setSelectedCity(cityName)
            setCurrentLevel('city')
            const coords = (feature.geometry as any).coordinates
            onLocationSelect?.({
              name: cityName,
              type: 'city',
              coordinates: getPolygonCenter(coords),
            })
          })
        },
      }
    ).addTo(mapRef.current)

    // Zoom para estado
    const bounds = L.geoJSON(
      { type: 'FeatureCollection', features: filteredCities } as any
    ).getBounds()
    mapRef.current.fitBounds(bounds)
  }

  const getCoverageColor = (coverage: number): string => {
    if (coverage >= 80) return '#10b981' // Verde
    if (coverage >= 60) return '#3b82f6' // Azul
    if (coverage >= 40) return '#f59e0b' // Amarelo
    if (coverage >= 20) return '#ef4444' // Vermelho
    return '#6b7280' // Cinza
  }

  const handleBack = () => {
    if (currentLevel === 'city') {
      setCurrentLevel('state')
      setSelectedCity(null)
    } else if (currentLevel === 'state') {
      setCurrentLevel('brasil')
      setSelectedState(null)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {currentLevel === 'brasil' && 'Mapa do Brasil'}
            {currentLevel === 'state' && `Estado: ${selectedState}`}
            {currentLevel === 'city' && `Cidade: ${selectedCity}`}
          </h3>
          <p className="text-sm text-gray-500">Clique para explorar</p>
        </div>
        {currentLevel !== 'brasil' && (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Voltar
          </button>
        )}
      </div>

      {/* Legenda */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>80-100% (Muito Alto)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span>60-79% (Alto)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>40-59% (Médio)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>20-39% (Baixo)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-500 rounded"></div>
            <span>0-19% (Muito Baixo)</span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div ref={containerRef} className="flex-1 rounded-b-lg overflow-hidden" />
    </div>
  )
}
