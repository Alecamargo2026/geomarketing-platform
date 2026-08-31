import { useState, useCallback } from 'react'

// MapFlow Hook
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

export interface UseMapFlowReturn {
  state: MapFlowState
  selectedRegion: string
  isLoading: boolean
  selectRegion: (region: string) => Promise<void>
  zoomOut: () => void
  setState: (state: MapFlowState) => void
}

export const useMapFlow = (): UseMapFlowReturn => {
  const [state, setState] = useState<MapFlowState>('brasil')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const selectRegion = useCallback(async (region: string) => {
    setIsLoading(true)
    setSelectedRegion(region)

    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      if (state === 'brasil') {
        setState('zoom_estado')
      } else if (state === 'zoom_estado') {
        setState('zoom_cidade')
      } else if (state === 'zoom_cidade') {
        setState('zoom_bairro')
      }
    } finally {
      setIsLoading(false)
    }
  }, [state])

  const zoomOut = useCallback(() => {
    if (state === 'zoom_bairro') {
      setState('zoom_cidade')
    } else if (state === 'zoom_cidade') {
      setState('zoom_estado')
    } else if (state === 'zoom_estado') {
      setState('brasil')
    }
    setSelectedRegion('')
  }, [state])

  return {
    state,
    selectedRegion,
    isLoading,
    selectRegion,
    zoomOut,
    setState,
  }
}

// CardFlow Hook
export type CardFlowState = 
  | 'colapsado'
  | 'hover'
  | 'clique'
  | 'expandido'
  | 'fechando'

export interface UseCardFlowReturn {
  state: CardFlowState
  isExpanded: boolean
  toggleExpand: () => void
  setState: (state: CardFlowState) => void
}

export const useCardFlow = (): UseCardFlowReturn => {
  const [state, setState] = useState<CardFlowState>('colapsado')

  const toggleExpand = useCallback(() => {
    if (state === 'colapsado' || state === 'hover') {
      setState('clique')
      setTimeout(() => setState('expandido'), 300)
    } else if (state === 'expandido') {
      setState('fechando')
      setTimeout(() => setState('colapsado'), 300)
    }
  }, [state])

  return {
    state,
    isExpanded: state === 'expandido',
    toggleExpand,
    setState,
  }
}

// RouteFlow Hook
export type RouteFlowState = 
  | 'seleção'
  | 'otimização'
  | 'pré_visualização'
  | 'confirmação'
  | 'processamento'
  | 'sucesso'
  | 'erro'

export interface UseRouteFlowReturn {
  state: RouteFlowState
  progress: number
  selectedClients: string[]
  selectClient: (clientId: string) => void
  optimizeRoute: () => Promise<void>
  confirmRoute: () => Promise<void>
  reset: () => void
  setState: (state: RouteFlowState) => void
}

export const useRouteFlow = (): UseRouteFlowReturn => {
  const [state, setState] = useState<RouteFlowState>('seleção')
  const [progress, setProgress] = useState(0)
  const [selectedClients, setSelectedClients] = useState<string[]>([])

  const selectClient = useCallback((clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    )
  }, [])

  const optimizeRoute = useCallback(async () => {
    setState('otimização')
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setProgress(i)
      }
      setState('pré_visualização')
    } catch (err) {
      setState('erro')
    }
  }, [])

  const confirmRoute = useCallback(async () => {
    setState('processamento')
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setProgress(i)
      }
      setState('sucesso')
    } catch (err) {
      setState('erro')
    }
  }, [])

  const reset = useCallback(() => {
    setState('seleção')
    setProgress(0)
    setSelectedClients([])
  }, [])

  return {
    state,
    progress,
    selectedClients,
    selectClient,
    optimizeRoute,
    confirmRoute,
    reset,
    setState,
  }
}

// ExportFlow Hook
export type ExportFlowState = 
  | 'seleção'
  | 'formato'
  | 'configuração'
  | 'pré_visualização'
  | 'processamento'
  | 'sucesso'
  | 'erro'

export interface UseExportFlowReturn {
  state: ExportFlowState
  progress: number
  format: string
  selectedData: string[]
  selectData: (dataType: string) => void
  selectFormat: (format: string) => void
  export: () => Promise<void>
  reset: () => void
  setState: (state: ExportFlowState) => void
}

export const useExportFlow = (): UseExportFlowReturn => {
  const [state, setState] = useState<ExportFlowState>('seleção')
  const [progress, setProgress] = useState(0)
  const [format, setFormat] = useState('')
  const [selectedData, setSelectedData] = useState<string[]>([])

  const selectData = useCallback((dataType: string) => {
    setSelectedData(prev =>
      prev.includes(dataType)
        ? prev.filter(d => d !== dataType)
        : [...prev, dataType]
    )
  }, [])

  const selectFormat = useCallback((selectedFormat: string) => {
    setFormat(selectedFormat)
    setState('configuração')
  }, [])

  const exportData = useCallback(async () => {
    setState('processamento')
    setProgress(0)

    try {
      for (let i = 0; i <= 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 30))
        setProgress(i)
      }
      setState('sucesso')
    } catch (err) {
      setState('erro')
    }
  }, [])

  const reset = useCallback(() => {
    setState('seleção')
    setProgress(0)
    setFormat('')
    setSelectedData([])
  }, [])

  return {
    state,
    progress,
    format,
    selectedData,
    selectData,
    selectFormat,
    export: exportData,
    reset,
    setState,
  }
}
