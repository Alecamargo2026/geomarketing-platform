'use client'

import React, { useState, useCallback } from 'react'
import Button from '@/components/Button/Button'
import Badge from '@/components/Badge/Badge'
import Spinner from '@/components/Spinner/Spinner'
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import './RouteFlow.css'

export type RouteFlowState = 
  | 'seleção'
  | 'otimização'
  | 'pré_visualização'
  | 'confirmação'
  | 'processamento'
  | 'sucesso'
  | 'erro'

export interface RouteFlowProps {
  onStateChange?: (state: RouteFlowState) => void
}

export const RouteFlow: React.FC<RouteFlowProps> = ({ onStateChange }) => {
  const [state, setState] = useState<RouteFlowState>('seleção')
  const [progress, setProgress] = useState(0)
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  const updateState = useCallback((newState: RouteFlowState) => {
    setState(newState)
    onStateChange?.(newState)
  }, [onStateChange])

  const handleClientSelect = useCallback((clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }, [])

  const handleOptimize = useCallback(async () => {
    updateState('otimização')
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setProgress(i)
      }
      updateState('pré_visualização')
    } catch (err) {
      updateState('erro')
    }
  }, [updateState])

  const handleConfirm = useCallback(async () => {
    updateState('processamento')
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setProgress(i)
      }
      updateState('sucesso')
    } catch (err) {
      updateState('erro')
    }
  }, [updateState])

  return (
    <div className="route-flow">
      <div className="route-flow__container">
        <div className="route-flow__header">
          <h1>Criar Rota</h1>
          <Badge variant={state === 'sucesso' ? 'success' : state === 'erro' ? 'danger' : 'primary'}>
            {state}
          </Badge>
        </div>

        {state === 'seleção' && (
          <div className="route-flow__selection">
            <h2>Selecione os clientes</h2>
            <div className="route-flow__clients">
              {['Cliente A', 'Cliente B', 'Cliente C', 'Cliente D', 'Cliente E'].map(client => (
                <label key={client} className="route-flow__client-item">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(client)}
                    onChange={() => handleClientSelect(client)}
                  />
                  <span>{client}</span>
                </label>
              ))}
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleOptimize}
              disabled={selectedClients.length === 0}
              fullWidth
            >
              Otimizar Rota
            </Button>
          </div>
        )}

        {state === 'otimização' && (
          <div className="route-flow__loading">
            <Spinner size="lg" />
            <p>Otimizando rota...</p>
            <ProgressBar value={progress} max={100} />
          </div>
        )}

        {state === 'pré_visualização' && (
          <div className="route-flow__preview">
            <h2>Pré-visualização da Rota</h2>
            <div className="route-flow__route-info">
              <div className="route-flow__info-item">
                <span>Distância Total</span>
                <span>45.2 km</span>
              </div>
              <div className="route-flow__info-item">
                <span>Tempo Estimado</span>
                <span>2h 30min</span>
              </div>
              <div className="route-flow__info-item">
                <span>Clientes</span>
                <span>{selectedClients.length}</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirm}
              fullWidth
            >
              Confirmar Rota
            </Button>
          </div>
        )}

        {state === 'processamento' && (
          <div className="route-flow__loading">
            <Spinner size="lg" />
            <p>Processando rota...</p>
            <ProgressBar value={progress} max={100} />
          </div>
        )}

        {state === 'sucesso' && (
          <div className="route-flow__success">
            <div className="route-flow__success-icon">✓</div>
            <h2>Rota criada com sucesso!</h2>
            <p>A rota foi salva e está pronta para uso.</p>
          </div>
        )}

        {state === 'erro' && (
          <div className="route-flow__error">
            <div className="route-flow__error-icon">✕</div>
            <h2>Erro ao criar rota</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => updateState('seleção')}
            >
              Tentar Novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
