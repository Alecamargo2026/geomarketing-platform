'use client'

import React from 'react'
import ExpandableCard from './ExpandableCard'
import './CustomerCard.css'

export interface CustomerData {
  id: string
  name: string
  cnpj: string
  phone: string
  address: string
  city: string
  state: string
  totalRevenue: number
  lastPurchase: string
  frequency: string
  priority: number
  segment: string
}

export interface CustomerCardProps {
  data: CustomerData
  isLoading?: boolean
  isError?: boolean
  onViewDetails?: (id: string) => void
  onScheduleVisit?: (id: string) => void
  onExport?: (id: string) => void
}

export default function CustomerCard({
  data,
  isLoading = false,
  isError = false,
  onViewDetails,
  onScheduleVisit,
  onExport,
}: CustomerCardProps) {
  const getPriorityLabel = (priority: number) => {
    if (priority >= 80) return 'Crítica'
    if (priority >= 60) return 'Alta'
    if (priority >= 40) return 'Média'
    return 'Baixa'
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'danger'
    if (priority >= 60) return 'warning'
    if (priority >= 40) return 'info'
    return 'success'
  }

  const summary = (
    <>
      <div className="customer-card__stat">
        <span className="customer-card__stat-label">Faturamento</span>
        <span className="customer-card__stat-value">
          R$ {(data.totalRevenue / 1000).toFixed(0)}K
        </span>
      </div>
      <div className="customer-card__stat">
        <span className="customer-card__stat-label">Frequência</span>
        <span className="customer-card__stat-value">{data.frequency}</span>
      </div>
      <div className={`customer-card__stat customer-card__stat--${getPriorityColor(data.priority)}`}>
        <span className="customer-card__stat-label">Prioridade</span>
        <span className="customer-card__stat-value">{getPriorityLabel(data.priority)}</span>
      </div>
    </>
  )

  const details = (
    <div className="customer-card__details-grid">
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Razão Social</span>
        <span className="customer-card__detail-value">{data.name}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">CNPJ</span>
        <span className="customer-card__detail-value">{data.cnpj}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Telefone</span>
        <span className="customer-card__detail-value">{data.phone}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Endereço</span>
        <span className="customer-card__detail-value">{data.address}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Cidade</span>
        <span className="customer-card__detail-value">{data.city}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Estado</span>
        <span className="customer-card__detail-value">{data.state}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Faturamento Total</span>
        <span className="customer-card__detail-value">
          R$ {data.totalRevenue.toLocaleString('pt-BR')}
        </span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Última Compra</span>
        <span className="customer-card__detail-value">{data.lastPurchase}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Frequência</span>
        <span className="customer-card__detail-value">{data.frequency}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Segmento</span>
        <span className="customer-card__detail-value">{data.segment}</span>
      </div>
      <div className="customer-card__detail-item">
        <span className="customer-card__detail-label">Prioridade</span>
        <span className={`customer-card__detail-value customer-card__detail-value--${getPriorityColor(data.priority)}`}>
          {getPriorityLabel(data.priority)} ({data.priority}%)
        </span>
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
        { id: 'visit', label: 'Agendar Visita', variant: 'secondary' },
        { id: 'export', label: 'Exportar', variant: 'tertiary' },
      ]}
      onAction={(id, action) => {
        if (action === 'details') onViewDetails?.(id)
        else if (action === 'visit') onScheduleVisit?.(id)
        else if (action === 'export') onExport?.(id)
      }}
    />
  )
}
