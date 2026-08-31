'use client'

import React from 'react'
import ExpandableCard from './ExpandableCard'
import './NeighborhoodCard.css'

export interface NeighborhoodData {
  id: string
  name: string
  city: string
  state: string
  clients: number
  revenue: number
  coverage: number
  potential: number
  competitors: number
}

export interface NeighborhoodCardProps {
  data: NeighborhoodData
  isLoading?: boolean
  isError?: boolean
  onViewDetails?: (id: string) => void
  onCreateRoute?: (id: string) => void
  onExport?: (id: string) => void
}

export default function NeighborhoodCard({
  data,
  isLoading = false,
  isError = false,
  onViewDetails,
  onCreateRoute,
  onExport,
}: NeighborhoodCardProps) {
  const summary = (
    <>
      <div className="neighborhood-card__stat">
        <span className="neighborhood-card__stat-label">Clientes</span>
        <span className="neighborhood-card__stat-value">{data.clients}</span>
      </div>
      <div className="neighborhood-card__stat">
        <span className="neighborhood-card__stat-label">Faturamento</span>
        <span className="neighborhood-card__stat-value">
          R$ {(data.revenue / 1000).toFixed(0)}K
        </span>
      </div>
      <div className="neighborhood-card__stat">
        <span className="neighborhood-card__stat-label">Cobertura</span>
        <span className="neighborhood-card__stat-value">{data.coverage}%</span>
      </div>
    </>
  )

  const details = (
    <div className="neighborhood-card__details-grid">
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Bairro</span>
        <span className="neighborhood-card__detail-value">{data.name}</span>
      </div>
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Cidade</span>
        <span className="neighborhood-card__detail-value">{data.city}</span>
      </div>
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Estado</span>
        <span className="neighborhood-card__detail-value">{data.state}</span>
      </div>
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Clientes Ativos</span>
        <span className="neighborhood-card__detail-value">{data.clients}</span>
      </div>
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Faturamento Total</span>
        <span className="neighborhood-card__detail-value">
          R$ {data.revenue.toLocaleString('pt-BR')}
        </span>
      </div>
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Cobertura</span>
        <span className="neighborhood-card__detail-value">{data.coverage}%</span>
      </div>
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Potencial</span>
        <span className="neighborhood-card__detail-value">
          R$ {data.potential.toLocaleString('pt-BR')}
        </span>
      </div>
      <div className="neighborhood-card__detail-item">
        <span className="neighborhood-card__detail-label">Concorrentes</span>
        <span className="neighborhood-card__detail-value">{data.competitors}</span>
      </div>
    </div>
  )

  return (
    <ExpandableCard
      id={data.id}
      title={data.name}
      subtitle={`${data.city}, ${data.state}`}
      summary={summary}
      details={details}
      isLoading={isLoading}
      isError={isError}
      onExpand={() => onViewDetails?.(data.id)}
      actions={[
        { id: 'details', label: 'Ver Detalhes', variant: 'primary' },
        { id: 'route', label: 'Criar Rota', variant: 'secondary' },
        { id: 'export', label: 'Exportar', variant: 'tertiary' },
      ]}
      onAction={(id, action) => {
        if (action === 'details') onViewDetails?.(id)
        else if (action === 'route') onCreateRoute?.(id)
        else if (action === 'export') onExport?.(id)
      }}
    />
  )
}
