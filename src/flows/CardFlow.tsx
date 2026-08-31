'use client'

import React, { useState, useCallback } from 'react'
import Button from '@/components/Button/Button'
import Modal from '@/components/Modal/Modal'
import Badge from '@/components/Badge/Badge'
import './CardFlow.css'

export type CardFlowState = 
  | 'colapsado'
  | 'hover'
  | 'clique'
  | 'expandido'
  | 'fechando'

export interface CardFlowProps {
  title?: string
  onStateChange?: (state: CardFlowState) => void
}

export const CardFlow: React.FC<CardFlowProps> = ({
  title = 'Card Expansível',
  onStateChange,
}) => {
  const [state, setState] = useState<CardFlowState>('colapsado')
  const [showDetails, setShowDetails] = useState(false)

  const updateState = useCallback((newState: CardFlowState) => {
    setState(newState)
    onStateChange?.(newState)
  }, [onStateChange])

  const handleCardClick = useCallback(() => {
    updateState('clique')
    setTimeout(() => {
      updateState('expandido')
      setShowDetails(true)
    }, 300)
  }, [updateState])

  const handleClose = useCallback(() => {
    updateState('fechando')
    setShowDetails(false)
    setTimeout(() => {
      updateState('colapsado')
    }, 300)
  }, [updateState])

  return (
    <div className="card-flow">
      <div className="card-flow__header">
        <h1>{title}</h1>
        <Badge variant={state === 'expandido' ? 'success' : 'primary'}>
          {state === 'colapsado' && 'Colapsado'}
          {state === 'hover' && 'Hover'}
          {state === 'clique' && 'Clique'}
          {state === 'expandido' && 'Expandido'}
          {state === 'fechando' && 'Fechando'}
        </Badge>
      </div>

      <div className="card-flow__container">
        <div
          className={`card-flow__card card-flow__card--${state}`}
          onMouseEnter={() => state === 'colapsado' && updateState('hover')}
          onMouseLeave={() => state === 'hover' && updateState('colapsado')}
          onClick={handleCardClick}
        >
          <div className="card-flow__card-header">
            <h3>Bairro: Copacabana</h3>
            <span className="card-flow__card-badge">RJ</span>
          </div>

          {state === 'colapsado' && (
            <div className="card-flow__card-summary">
              <div className="card-flow__stat">
                <span className="card-flow__stat-label">Clientes</span>
                <span className="card-flow__stat-value">45</span>
              </div>
              <div className="card-flow__stat">
                <span className="card-flow__stat-label">Faturamento</span>
                <span className="card-flow__stat-value">R$ 125K</span>
              </div>
            </div>
          )}

          {(state === 'hover' || state === 'clique' || state === 'expandido') && (
            <div className="card-flow__card-preview">
              <p>Clique para expandir e ver detalhes completos...</p>
            </div>
          )}

          {state === 'expandido' && (
            <div className="card-flow__card-expanded">
              <div className="card-flow__detail">
                <span className="card-flow__detail-label">Clientes Ativos</span>
                <span className="card-flow__detail-value">45</span>
              </div>
              <div className="card-flow__detail">
                <span className="card-flow__detail-label">Faturamento Total</span>
                <span className="card-flow__detail-value">R$ 125.000,00</span>
              </div>
              <div className="card-flow__detail">
                <span className="card-flow__detail-label">Cobertura</span>
                <span className="card-flow__detail-value">78%</span>
              </div>
              <div className="card-flow__detail">
                <span className="card-flow__detail-label">Potencial</span>
                <span className="card-flow__detail-value">R$ 45.000,00</span>
              </div>
              <div className="card-flow__actions">
                <Button variant="primary" size="sm">
                  Ver Detalhes
                </Button>
                <Button variant="secondary" size="sm">
                  Criar Rota
                </Button>
                <Button variant="tertiary" size="sm" onClick={handleClose}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Detalhes Completos */}
      <Modal
        isOpen={showDetails && state === 'expandido'}
        onClose={handleClose}
        title="Detalhes do Bairro"
      >
        <div className="card-flow__modal-content">
          <div className="card-flow__modal-section">
            <h4>Informações Gerais</h4>
            <div className="card-flow__modal-item">
              <span>Bairro</span>
              <span>Copacabana</span>
            </div>
            <div className="card-flow__modal-item">
              <span>Cidade</span>
              <span>Rio de Janeiro</span>
            </div>
            <div className="card-flow__modal-item">
              <span>Estado</span>
              <span>RJ</span>
            </div>
          </div>

          <div className="card-flow__modal-section">
            <h4>Dados Comerciais</h4>
            <div className="card-flow__modal-item">
              <span>Clientes Ativos</span>
              <span>45</span>
            </div>
            <div className="card-flow__modal-item">
              <span>Faturamento</span>
              <span>R$ 125.000,00</span>
            </div>
            <div className="card-flow__modal-item">
              <span>Ticket Médio</span>
              <span>R$ 2.777,78</span>
            </div>
          </div>

          <div className="card-flow__modal-actions">
            <Button variant="primary" size="md">
              Editar
            </Button>
            <Button variant="tertiary" size="md" onClick={handleClose}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
