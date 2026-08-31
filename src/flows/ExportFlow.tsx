'use client'

import React, { useState, useCallback } from 'react'
import Button from '@/components/Button/Button'
import Badge from '@/components/Badge/Badge'
import Spinner from '@/components/Spinner/Spinner'
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import Select from '@/components/Select/Select'
import './ExportFlow.css'

export type ExportFlowState = 
  | 'seleção'
  | 'formato'
  | 'configuração'
  | 'pré_visualização'
  | 'processamento'
  | 'sucesso'
  | 'erro'

export interface ExportFlowProps {
  onStateChange?: (state: ExportFlowState) => void
}

export const ExportFlow: React.FC<ExportFlowProps> = ({ onStateChange }) => {
  const [state, setState] = useState<ExportFlowState>('seleção')
  const [progress, setProgress] = useState(0)
  const [format, setFormat] = useState('')
  const [selectedData, setSelectedData] = useState<string[]>([])

  const updateState = useCallback((newState: ExportFlowState) => {
    setState(newState)
    onStateChange?.(newState)
  }, [onStateChange])

  const handleDataSelect = useCallback((dataType: string) => {
    setSelectedData(prev =>
      prev.includes(dataType)
        ? prev.filter(d => d !== dataType)
        : [...prev, dataType]
    )
  }, [])

  const handleFormatSelect = useCallback((selectedFormat: string) => {
    setFormat(selectedFormat)
    updateState('configuração')
  }, [updateState])

  const handleExport = useCallback(async () => {
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
    <div className="export-flow">
      <div className="export-flow__container">
        <div className="export-flow__header">
          <h1>Exportar Relatório</h1>
          <Badge variant={state === 'sucesso' ? 'success' : state === 'erro' ? 'danger' : 'primary'}>
            {state}
          </Badge>
        </div>

        {state === 'seleção' && (
          <div className="export-flow__selection">
            <h2>Selecione os dados a exportar</h2>
            <div className="export-flow__data-list">
              {['Clientes', 'Faturamento', 'Cobertura', 'Potencial', 'Concorrentes'].map(data => (
                <label key={data} className="export-flow__data-item">
                  <input
                    type="checkbox"
                    checked={selectedData.includes(data)}
                    onChange={() => handleDataSelect(data)}
                  />
                  <span>{data}</span>
                </label>
              ))}
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => updateState('formato')}
              disabled={selectedData.length === 0}
              fullWidth
            >
              Próximo
            </Button>
          </div>
        )}

        {state === 'formato' && (
          <div className="export-flow__format">
            <h2>Selecione o formato</h2>
            <div className="export-flow__format-options">
              {[
                { value: 'pdf', label: 'PDF - Relatório Profissional' },
                { value: 'excel', label: 'Excel - Planilha Editável' },
                { value: 'csv', label: 'CSV - Dados Brutos' },
              ].map(option => (
                <button
                  key={option.value}
                  className={`export-flow__format-btn ${format === option.value ? 'active' : ''}`}
                  onClick={() => handleFormatSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {state === 'configuração' && (
          <div className="export-flow__config">
            <h2>Configurações</h2>
            <div className="export-flow__config-items">
              <Select
                label="Período"
                placeholder="Selecione período"
                options={[
                  { value: 'month', label: 'Último Mês' },
                  { value: 'quarter', label: 'Último Trimestre' },
                  { value: 'year', label: 'Último Ano' },
                ]}
              />
              <Select
                label="Agrupamento"
                placeholder="Selecione agrupamento"
                options={[
                  { value: 'city', label: 'Por Cidade' },
                  { value: 'region', label: 'Por Região' },
                  { value: 'client', label: 'Por Cliente' },
                ]}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => updateState('pré_visualização')}
              fullWidth
            >
              Pré-visualizar
            </Button>
          </div>
        )}

        {state === 'pré_visualização' && (
          <div className="export-flow__preview">
            <h2>Pré-visualização</h2>
            <div className="export-flow__preview-content">
              <p>Relatório com {selectedData.length} seções em formato {format.toUpperCase()}</p>
              <div className="export-flow__preview-stats">
                <div className="export-flow__preview-stat">
                  <span>Tamanho Estimado</span>
                  <span>2.5 MB</span>
                </div>
                <div className="export-flow__preview-stat">
                  <span>Tempo Estimado</span>
                  <span>30 segundos</span>
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleExport}
              fullWidth
            >
              Exportar
            </Button>
          </div>
        )}

        {state === 'processamento' && (
          <div className="export-flow__loading">
            <Spinner size="lg" />
            <p>Gerando relatório...</p>
            <ProgressBar value={progress} max={100} />
          </div>
        )}

        {state === 'sucesso' && (
          <div className="export-flow__success">
            <div className="export-flow__success-icon">✓</div>
            <h2>Relatório exportado com sucesso!</h2>
            <p>O arquivo está pronto para download.</p>
            <Button
              variant="primary"
              size="md"
              onClick={() => updateState('seleção')}
            >
              Exportar Outro
            </Button>
          </div>
        )}

        {state === 'erro' && (
          <div className="export-flow__error">
            <div className="export-flow__error-icon">✕</div>
            <h2>Erro ao exportar</h2>
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
