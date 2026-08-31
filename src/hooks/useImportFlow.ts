import { useState, useCallback } from 'react'

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

export interface ImportData {
  rows: number
  mapped: number
  errors: number
  file?: File
  brand?: string
}

export interface UseImportFlowReturn {
  state: ImportFlowState
  progress: number
  data: ImportData
  error: string
  isLoading: boolean
  selectFile: (file: File) => void
  selectBrand: (brand: string) => void
  validateFile: () => Promise<void>
  mapColumns: (mapping: Record<string, string>) => Promise<void>
  previewData: () => Promise<void>
  confirmImport: () => Promise<void>
  reset: () => void
  setState: (state: ImportFlowState) => void
  setProgress: (progress: number) => void
  setError: (error: string) => void
}

export const useImportFlow = (): UseImportFlowReturn => {
  const [state, setState] = useState<ImportFlowState>('selection')
  const [progress, setProgress] = useState(0)
  const [data, setData] = useState<ImportData>({
    rows: 0,
    mapped: 0,
    errors: 0,
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectFile = useCallback((file: File) => {
    setData(prev => ({ ...prev, file }))
    setError('')
  }, [])

  const selectBrand = useCallback((brand: string) => {
    setData(prev => ({ ...prev, brand }))
  }, [])

  const validateFile = useCallback(async () => {
    if (!data.file || !data.brand) {
      setError('Arquivo e marca são obrigatórios')
      return
    }

    setIsLoading(true)
    setState('validation')
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simular validação
      setData(prev => ({
        ...prev,
        rows: 1250,
        mapped: 1200,
        errors: 50,
      }))

      setState('mapping')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao validar arquivo'
      setError(errorMessage)
      setState('error')
    } finally {
      setIsLoading(false)
    }
  }, [data.file, data.brand])

  const mapColumns = useCallback(async () => {
    setIsLoading(true)
    setState('preview')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Aplicar mapeamento
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao mapear colunas'
      setError(errorMessage)
      setState('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const previewData = useCallback(async () => {
    setState('confirmation')
  }, [])

  const confirmImport = useCallback(async () => {
    setIsLoading(true)
    setState('processing')
    setProgress(0)

    try {
      // Simular processamento
      for (let i = 0; i <= 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      setState('geocoding')
      for (let i = 30; i <= 70; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      setState('synchronization')
      for (let i = 70; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        setProgress(i)
      }

      setState('success')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar importação'
      setError(errorMessage)
      setState('error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setState('selection')
    setProgress(0)
    setData({ rows: 0, mapped: 0, errors: 0 })
    setError('')
  }, [])

  return {
    state,
    progress,
    data,
    error,
    isLoading,
    selectFile,
    selectBrand,
    validateFile,
    mapColumns,
    previewData,
    confirmImport,
    reset,
    setState,
    setProgress,
    setError,
  }
}
