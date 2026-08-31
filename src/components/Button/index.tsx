/**
 * Button Component - Exemplos de Uso
 * 
 * Componente profissional de botão com suporte a múltiplas variantes,
 * tamanhos e estados. Segue padrões WCAG 2.1 AA.
 */

import React from 'react'
import Button from './Button'

// ============================================================================
// EXEMPLOS DE USO
// ============================================================================

/**
 * BOTÃO PRIMÁRIO
 * Ação principal, mais importante
 */
export function PrimaryButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="primary" size="sm">
        Pequeno
      </Button>
      <Button variant="primary" size="md">
        Médio
      </Button>
      <Button variant="primary" size="lg">
        Grande
      </Button>
      <Button variant="primary" disabled>
        Desabilitado
      </Button>
      <Button variant="primary" isLoading>
        Carregando...
      </Button>
    </div>
  )
}

/**
 * BOTÃO SECUNDÁRIO
 * Ação alternativa
 */
export function SecondaryButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="secondary">Cancelar</Button>
      <Button variant="secondary">Voltar</Button>
      <Button variant="secondary" disabled>
        Desabilitado
      </Button>
    </div>
  )
}

/**
 * BOTÃO COM ÍCONE
 */
export function IconButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="primary" icon={<SearchIcon />} iconPosition="left">
        Buscar
      </Button>
      <Button variant="primary" icon={<DownloadIcon />} iconPosition="right">
        Baixar
      </Button>
      <Button variant="icon" icon={<SettingsIcon />} tooltip="Configurações" />
      <Button variant="icon" icon={<TrashIcon />} tooltip="Deletar" />
    </div>
  )
}

/**
 * BOTÃO FAB (Floating Action Button)
 */
export function FABButtonExample() {
  return <Button variant="fab" icon={<PlusIcon />} tooltip="Adicionar" />
}

/**
 * GRUPO DE BOTÕES
 */
export function ButtonGroupExample() {
  const [active, setActive] = React.useState('list')

  return (
    <div className="flex gap-0">
      <Button
        variant="group"
        className={active === 'list' ? 'active' : ''}
        onClick={() => setActive('list')}
        icon={<ListIcon />}
      >
        Lista
      </Button>
      <Button
        variant="group"
        className={active === 'grid' ? 'active' : ''}
        onClick={() => setActive('grid')}
        icon={<GridIcon />}
      >
        Grade
      </Button>
      <Button
        variant="group"
        className={active === 'map' ? 'active' : ''}
        onClick={() => setActive('map')}
        icon={<MapIcon />}
      >
        Mapa
      </Button>
    </div>
  )
}

/**
 * BOTÃO DE PERIGO
 */
export function DangerButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="danger">Deletar</Button>
      <Button variant="danger" icon={<TrashIcon />}>
        Remover
      </Button>
      <Button variant="danger" disabled>
        Deletar (desabilitado)
      </Button>
    </div>
  )
}

/**
 * BOTÃO DE SUCESSO
 */
export function SuccessButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="success">Confirmar</Button>
      <Button variant="success" isSuccess>
        Salvo com sucesso!
      </Button>
    </div>
  )
}

/**
 * BOTÃO DE AVISO
 */
export function WarningButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="warning">Atenção</Button>
      <Button variant="warning" icon={<AlertIcon />}>
        Cuidado!
      </Button>
    </div>
  )
}

/**
 * BOTÃO TERCIÁRIO
 */
export function TertiaryButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="tertiary">Link</Button>
      <Button variant="tertiary" icon={<ExternalLinkIcon />}>
        Abrir em nova aba
      </Button>
    </div>
  )
}

/**
 * BOTÃO COM LARGURA TOTAL
 */
export function FullWidthButtonExample() {
  return (
    <div className="space-y-4">
      <Button variant="primary" fullWidth>
        Enviar
      </Button>
      <Button variant="secondary" fullWidth>
        Cancelar
      </Button>
    </div>
  )
}

/**
 * BOTÃO COM ESTADOS
 */
export function ButtonStatesExample() {
  const [state, setState] = React.useState<'default' | 'loading' | 'success' | 'error'>('default')

  return (
    <div className="space-y-4">
      <Button
        variant="primary"
        state={state}
        isLoading={state === 'loading'}
        isSuccess={state === 'success'}
        isError={state === 'error'}
        onClick={() => {
          setState('loading')
          setTimeout(() => setState('success'), 2000)
        }}
      >
        {state === 'default' && 'Clique para enviar'}
        {state === 'loading' && 'Enviando...'}
        {state === 'success' && 'Enviado!'}
        {state === 'error' && 'Erro ao enviar'}
      </Button>
    </div>
  )
}

/**
 * BOTÃO COM TOOLTIP
 */
export function TooltipButtonExample() {
  return (
    <div className="space-y-4">
      <Button
        variant="icon"
        icon={<HelpIcon />}
        tooltip="Clique para obter ajuda"
        ariaLabel="Ajuda"
      />
      <Button
        variant="primary"
        tooltip="Salvar alterações (Ctrl+S)"
        ariaLabel="Salvar"
      >
        Salvar
      </Button>
    </div>
  )
}

/**
 * EXEMPLO COMPLETO: FORMULÁRIO COM BOTÕES
 */
export function FormWithButtonsExample() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Nome
        </label>
        <input
          id="name"
          type="text"
          placeholder="Seu nome"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="primary" type="submit" isLoading={isLoading} fullWidth>
          {isLoading ? 'Enviando...' : 'Enviar'}
        </Button>
        <Button variant="secondary" type="reset" fullWidth>
          Limpar
        </Button>
      </div>
    </form>
  )
}

/**
 * EXEMPLO COMPLETO: DASHBOARD COM BOTÕES
 */
export function DashboardButtonsExample() {
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="primary" icon={<PlusIcon />}>
          Novo
        </Button>
        <Button variant="secondary" icon={<EditIcon />}>
          Editar
        </Button>
        <Button variant="secondary" icon={<DownloadIcon />}>
          Exportar
        </Button>
        <Button variant="danger" icon={<TrashIcon />}>
          Deletar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button variant="group" className="active">
          Todos
        </Button>
        <Button variant="group">Ativos</Button>
        <Button variant="group">Inativos</Button>
      </div>

      {/* Ações */}
      <div className="flex gap-2">
        <Button variant="primary" size="lg" fullWidth>
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}

// ============================================================================
// ÍCONES (Exemplos)
// ============================================================================

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

export default Button
