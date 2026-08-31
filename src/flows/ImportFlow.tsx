'use client'

import React, { useState, useCallback } from 'react'
import Button from '@/components/Button/Button'
import Modal from '@/components/Modal/Modal'
import Alert from '@/components/Alert/Alert'
import Spinner from '@/components/Spinner/Spinner'
import Badge from '@/components/Badge/Badge'
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import Select from '@/components/Select/Select'
import './ImportFlow.css'

export type ImportFlowState = 
  | 'selection'
  | 'validation'
  | 'mapping'
  | 'preview'
  | 'confirmation'
  | 'processing'
  | 'geocoding'
  | 'synchronization'
  | 'success'
  | 'error'

export interface ImportFlowProps {
  onSuccess?: (data: { rows: number; mapped: number; errors: number }) => void
  onError?: (error: string) => void
  onStateChange?: (state: ImportFlowState) => void
}

export const ImportFlow: React.FC<ImportFlowProps> = ({
  onSuccess,
  onError,
  onStateChange,
}) => {
  const [state, setState] = useState<ImportFlowState>('selection')
  const [file, setFile] = useState<File | null>(null)
  const [brand, setBrand] = useState('')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const [showMapping, setShowMapping] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [importData, setImportData] = useState({
    rows: 0,
    mapped: 0,
    errors: 0,
  })

  const updateState = useCallback((newState: ImportFlowState) => {
    setState(newState)
    onStateChange?.(newState)
  }, [onStateChange])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(selectedFile.type)) {
        setError('Apenas arquivos CSV e Excel são permitidos')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }, [])

  const handleValidation = useCallback(async () => {
    if (!file || !brand) {
      setError('Selecione um arquivo e uma marca')
      return
    }

    updateState('validation')
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setImportData({ rows: 1250, mapped: 1200, errors: 50 })
      setShowMapping(true)
      updateState('mapping')
    } catch (err) {
      setError('Erro ao validar arquivo')
      updateState('error')
      onError?.('Erro ao validar arquivo')
    }
  }, [file, brand, updateState, onError])

  const handleMapping = useCallback(async () => {
    updateState('preview')
    setShowMapping(false)
    setShowPreview(true)
  }, [updateState])

  const handlePreview = useCallback(async () => {
    setShowPreview(false)
    setShowConfirmation(true)
    updateState('confirmation')
  }, [updateState])

  const handleConfirmation = useCallback(async () => {
    setShowConfirmation(false)
    updateState('processing')
    setProgress(0)

    try {
      // Simular processamento
      for (let i = 0; i <= 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      updateState('geocoding')
      for (let i = 30; i <= 70; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      updateState('synchronization')
      for (let i = 70; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      updateState('success')
      onSuccess?.(importData)

      setTimeout(() => {
        setFile(null)
        setBrand('')
        setProgress(0)
        setImportData({ rows: 0, mapped: 0, errors: 0 })
        updateState('selection')
      }, 2000)
    } catch (err) {
      setError('Erro ao processar importação')
      updateState('error')
      onError?.('Erro ao processar importação')
    }
  }, [importData, updateState, onSuccess, onError])

  return (
    <div className="import-flow">
      <div className="import-flow__container">
        <div className="import-flow__header">
          <h1>Importar Dados</h1>
          <Badge variant={state === 'success' ? 'success' : state === 'error' ? 'danger' : 'primary'}>
            {state === 'selection' && 'Seleção de Arquivo'}
            {state === 'validation' && 'Validando...'}
            {state === 'mapping' && 'Mapeamento'}
            {state === 'preview' && 'Pré-visualização'}
            {state === 'confirmation' && 'Confirmação'}
            {state === 'processing' && 'Processando...'}
            {state === 'geocoding' && 'Geocodificação...'}
            {state === 'synchronization' && 'Sincronizando...'}
            {state === 'success' && 'Sucesso!'}
            {state === 'error' && 'Erro'}
          </Badge>
        </div>

        {error && (
          <Alert
            variant={state === 'success' ? 'success' : 'danger'}
            title={state === 'success' ? 'Sucesso!' : 'Erro'}
            onDismiss={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {state === 'selection' && (
          <div className="import-flow__selection">
            <div className="import-flow__form">
              <Select
                label="Marca"
                placeholder="Selecione uma marca"
                value={brand}
                onChange={(e) => setBrand(typeof e === 'string' ? e : e.target?.value || '')}
                options={[
                  { value: 'brand1', label: 'Marca A' },
                  { value: 'brand2', label: 'Marca B' },
                  { value: 'brand3', label: 'Marca C' },
                ]}
              />

              <div className="import-flow__file-input">
                <label>Arquivo (CSV ou Excel)</label>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="import-flow__input"
                />
                {file && <p className="import-flow__file-name">{file.name}</p>}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleValidation}
                disabled={!file || !brand}
                fullWidth
              >
                Validar Arquivo
              </Button>
            </div>
          </div>
        )}

        {(state === 'validation' || state === 'processing' || state === 'geocoding' || state === 'synchronization') && (
          <div className="import-flow__loading">
            <Spinner size="lg" />
            <p>
              {state === 'validation' && 'Validando arquivo...'}
              {state === 'processing' && 'Processando dados...'}
              {state === 'geocoding' && 'Geocodificando endereços...'}
              {state === 'synchronization' && 'Sincronizando com banco de dados...'}
            </p>
            {(state === 'processing' || state === 'geocoding' || state === 'synchronization') && (
              <ProgressBar value={progress} max={100} />
            )}
          </div>
        )}

        {state === 'success' && (
          <div className="import-flow__success">
            <div className="import-flow__success-icon">✓</div>
            <h2>Importação concluída!</h2>
            <div className="import-flow__stats">
              <div className="import-flow__stat">
                <span className="import-flow__stat-label">Total de linhas</span>
                <span className="import-flow__stat-value">{importData.rows}</span>
              </div>
              <div className="import-flow__stat">
                <span className="import-flow__stat-label">Mapeadas</span>
                <span className="import-flow__stat-value">{importData.mapped}</span>
              </div>
              <div className="import-flow__stat">
                <span className="import-flow__stat-label">Erros</span>
                <span className="import-flow__stat-value">{importData.errors}</span>
              </div>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="import-flow__error">
            <div className="import-flow__error-icon">✕</div>
            <h2>Erro na importação</h2>
            <Button
              variant="primary"
              size="md"
              onClick={() => updateState('selection')}
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </div>

      {/* Modal: Mapeamento */}
      <Modal
        isOpen={showMapping}
        onClose={() => setShowMapping(false)}
        title="Mapeamento de Colunas"
      >
        <div className="import-flow__modal-content">
          <p>Mapeie as colunas do seu arquivo com os campos do sistema:</p>
          <div className="import-flow__mapping-list">
            <div className="import-flow__mapping-item">
              <span>Cliente</span>
              <Select
                placeholder="Selecione coluna"
                options={[
                  { value: 'col1', label: 'Coluna 1' },
                  { value: 'col2', label: 'Coluna 2' },
                ]}
              />
            </div>
            <div className="import-flow__mapping-item">
              <span>CNPJ</span>
              <Select
                placeholder="Selecione coluna"
                options={[
                  { value: 'col1', label: 'Coluna 1' },
                  { value: 'col2', label: 'Coluna 2' },
                ]}
              />
            </div>
            <div className="import-flow__mapping-item">
              <span>Cidade</span>
              <Select
                placeholder="Selecione coluna"
                options={[
                  { value: 'col1', label: 'Coluna 1' },
                  { value: 'col2', label: 'Coluna 2' },
                ]}
              />
            </div>
          </div>
          <div className="import-flow__modal-actions">
            <Button
              variant="primary"
              size="md"
              onClick={handleMapping}
            >
              Próximo
            </Button>
            <Button
              variant="tertiary"
              size="md"
              onClick={() => setShowMapping(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Pré-visualização */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Pré-visualização dos Dados"
      >
        <div className="import-flow__modal-content">
          <p>Revise os dados antes de importar:</p>
          <div className="import-flow__preview-table">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>CNPJ</th>
                  <th>Cidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Empresa A</td>
                  <td>12.345.678/0001-90</td>
                  <td>Rio de Janeiro</td>
                </tr>
                <tr>
                  <td>Empresa B</td>
                  <td>98.765.432/0001-10</td>
                  <td>São Paulo</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="import-flow__modal-actions">
            <Button
              variant="primary"
              size="md"
              onClick={handlePreview}
            >
              Confirmar
            </Button>
            <Button
              variant="tertiary"
              size="md"
              onClick={() => setShowPreview(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Confirmação */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirmar Importação"
      >
        <div className="import-flow__modal-content">
          <p>Você está prestes a importar {importData.rows} registros. Deseja continuar?</p>
          <div className="import-flow__modal-actions">
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmation}
            >
              Importar
            </Button>
            <Button
              variant="tertiary"
              size="md"
              onClick={() => setShowConfirmation(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
