'use client'

import React, { useState, useCallback } from 'react'
import Button from '@/components/Button/Button'
import Modal from '@/components/Modal/Modal'
import Badge from '@/components/Badge/Badge'
import Spinner from '@/components/Spinner/Spinner'
import './MapFlow.css'

export type MapFlowState = 
  | 'brasil'
  | 'zoom_estado'
  | 'zoom_cidade'
  | 'zoom_bairro'
  | 'clique_marcador'
  | 'filtro'
  | 'busca'
  | 'detalhes'
  | 'exportacao'

export interface MapFlowProps {
  onStateChange?: (state: MapFlowState) => void
  onSelectRegion?: (region: string) => void
}

export const MapFlow: React.FC<MapFlowProps> = ({
  onStateChange,
  onSelectRegion,
}) => {
  const [state, setState] = useState<MapFlowState>('brasil')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updateState = useCallback((newState: MapFlowState) => {
    setState(newState)
    onStateChange?.(newState)
  }, [onStateChange])

  const handleRegionClick = useCallback(async (region: string) => {
    setIsLoading(true)
    setSelectedRegion(region)

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      if (state === 'brasil') {
        updateState('zoom_estado')
      } else if (state === 'zoom_estado') {
        updateState('zoom_cidade')
      } else if (state === 'zoom_cidade') {
        updateState('zoom_bairro')
      }

      onSelectRegion?.(region)
    } finally {
      setIsLoading(false)
    }
  }, [state, updateState, onSelectRegion])

  const handleMarkerClick = useCallback(() => {
    updateState('clique_marcador')
    setShowDetails(true)
  }, [updateState])

  const handleZoomOut = useCallback(() => {
    if (state === 'zoom_bairro') {
      updateState('zoom_cidade')
    } else if (state === 'zoom_cidade') {
      updateState('zoom_estado')
    } else if (state === 'zoom_estado') {
      updateState('brasil')
    }
    setSelectedRegion('')
  }, [state, updateState])

  return (
    <div className="map-flow">
      <div className="map-flow__header">
        <h1>Mapa Dinâmico</h1>
        <Badge variant="primary">
          {state === 'brasil' && 'Brasil'}
          {state === 'zoom_estado' && 'Estado'}
          {state === 'zoom_cidade' && 'Cidade'}
          {state === 'zoom_bairro' && 'Bairro'}
          {state === 'clique_marcador' && 'Detalhes'}
          {state === 'filtro' && 'Filtros'}
          {state === 'busca' && 'Busca'}
          {state === 'detalhes' && 'Detalhes'}
          {state === 'exportacao' && 'Exportação'}
        </Badge>
      </div>

      <div className="map-flow__container">
        <div className="map-flow__controls">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(true)}
          >
            Filtros
          </Button>
          {state !== 'brasil' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleZoomOut}
            >
              Voltar
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => updateState('exportacao')}
          >
            Exportar
          </Button>
        </div>

        <div className="map-flow__map">
          {isLoading ? (
            <div className="map-flow__loading">
              <Spinner size="lg" />
              <p>Carregando mapa...</p>
            </div>
          ) : (
            <div className="map-flow__content">
              {state === 'brasil' && (
                <div className="map-flow__regions">
                  <h2>Selecione um Estado</h2>
                  <div className="map-flow__grid">
                    {['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Santa Catarina', 'Paraná'].map(region => (
                      <button
                        key={region}
                        className="map-flow__region-btn"
                        onClick={() => handleRegionClick(region)}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {state === 'zoom_estado' && (
                <div className="map-flow__regions">
                  <h2>Cidades em {selectedRegion}</h2>
                  <div className="map-flow__grid">
                    {['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Itaboraí'].map(city => (
                      <button
                        key={city}
                        className="map-flow__region-btn"
                        onClick={() => handleRegionClick(city)}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {state === 'zoom_cidade' && (
                <div className="map-flow__regions">
                  <h2>Bairros em {selectedRegion}</h2>
                  <div className="map-flow__grid">
                    {['Centro', 'Copacabana', 'Ipanema', 'Leblon', 'Barra da Tijuca'].map(neighborhood => (
                      <button
                        key={neighborhood}
                        className="map-flow__region-btn"
                        onClick={() => handleRegionClick(neighborhood)}
                      >
                        {neighborhood}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {state === 'zoom_bairro' && (
                <div className="map-flow__regions">
                  <h2>Clientes em {selectedRegion}</h2>
                  <div className="map-flow__grid">
                    {['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D'].map(client => (
                      <button
                        key={client}
                        className="map-flow__region-btn"
                        onClick={handleMarkerClick}
                      >
                        {client}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Detalhes */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Detalhes do Cliente"
      >
        <div className="map-flow__modal-content">
          <div className="map-flow__detail-item">
            <span className="map-flow__detail-label">Nome</span>
            <span className="map-flow__detail-value">Empresa XYZ</span>
          </div>
          <div className="map-flow__detail-item">
            <span className="map-flow__detail-label">CNPJ</span>
            <span className="map-flow__detail-value">12.345.678/0001-90</span>
          </div>
          <div className="map-flow__detail-item">
            <span className="map-flow__detail-label">Endereço</span>
            <span className="map-flow__detail-value">Rua Principal, 123 - Centro</span>
          </div>
          <div className="map-flow__detail-item">
            <span className="map-flow__detail-label">Faturamento</span>
            <span className="map-flow__detail-value">R$ 50.000,00</span>
          </div>
          <div className="map-flow__modal-actions">
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowDetails(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Filtros */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtros"
      >
        <div className="map-flow__modal-content">
          <p>Filtros disponíveis para o mapa</p>
          <div className="map-flow__modal-actions">
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowFilters(false)}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
