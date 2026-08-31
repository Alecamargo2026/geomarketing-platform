'use client'

import React, { useState } from 'react'
import {
  Button,
  Input,
  Modal,
  Select,
  Tabs,
  Badge,
  Spinner,
  Alert,
  Breadcrumb,
} from '@/components'

/**
 * Página de Demonstração de Componentes
 * 
 * Mostra exemplos de uso de todos os componentes do design system
 */
export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedState, setSelectedState] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const stateOptions = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais' },
    { value: 'ba', label: 'Bahia' },
    { value: 'rs', label: 'Rio Grande do Sul' },
  ]

  const tabs = [
    {
      id: 'buttons',
      label: 'Botões',
      icon: '🔘',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Variantes de Botão</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="tertiary">Terciário</Button>
            <Button variant="danger">Perigo</Button>
            <Button variant="success">Sucesso</Button>
            <Button variant="warning">Aviso</Button>
          </div>

          <h3 className="text-lg font-semibold mt-6">Tamanhos</h3>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Pequeno</Button>
            <Button size="md">Médio</Button>
            <Button size="lg">Grande</Button>
          </div>

          <h3 className="text-lg font-semibold mt-6">Estados</h3>
          <div className="flex flex-wrap gap-2">
            <Button disabled>Desabilitado</Button>
            <Button onClick={() => setIsLoading(!isLoading)}>
              {isLoading ? 'Carregando...' : 'Clique para carregar'}
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: 'inputs',
      label: 'Inputs',
      icon: '📝',
      content: (
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          <Input
            label="Telefone"
            type="tel"
            placeholder="(11) 99999-9999"
            hint="Formato: (XX) XXXXX-XXXX"
          />

          <Input
            label="Campo com erro"
            error="Este campo é obrigatório"
            placeholder="Digite algo"
          />

          <Input
            label="Campo desabilitado"
            disabled
            value="Não pode editar"
          />
        </div>
      ),
    },
    {
      id: 'selects',
      label: 'Selects',
      icon: '📋',
      content: (
        <div className="space-y-4">
          <Select
            label="Estado"
            options={stateOptions}
            placeholder="Selecione um estado"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value as string)}
            searchable
          />

          <Select
            label="Múltiplas seleções"
            options={stateOptions}
            placeholder="Selecione estados"
            multiple
            searchable
            clearable
          />

          <Select
            label="Com erro"
            options={stateOptions}
            error="Selecione um estado válido"
          />
        </div>
      ),
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: '💬',
      content: (
        <div className="space-y-4">
          <Alert variant="info" title="Informação">
            Esta é uma mensagem informativa para o usuário.
          </Alert>

          <Alert variant="success" title="Sucesso" dismissible>
            Operação realizada com sucesso!
          </Alert>

          <Alert variant="warning" title="Aviso" dismissible>
            Atenção: verifique os dados antes de continuar.
          </Alert>

          <Alert variant="danger" title="Erro" dismissible>
            Ocorreu um erro ao processar sua solicitação.
          </Alert>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primário</Badge>
              <Badge variant="success">Sucesso</Badge>
              <Badge variant="danger">Perigo</Badge>
              <Badge variant="warning">Aviso</Badge>
              <Badge variant="info" rounded>
                Info
              </Badge>
              <Badge variant="primary" outline>
                Outline
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Design System
          </h1>
          <p className="text-gray-600">
            Componentes profissionais com acessibilidade WCAG 2.1 AA
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Componentes' },
            ]}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <Tabs tabs={tabs} defaultTab="buttons" />
        </div>

        {/* Modal Demo */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            Abrir Modal
          </Button>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Exemplo de Modal"
            subtitle="Este é um modal de exemplo"
          >
            <p className="text-gray-600 mb-4">
              Este é o conteúdo do modal. Você pode adicionar qualquer
              componente aqui.
            </p>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                Confirmar
              </Button>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
            </div>
          </Modal>
        </div>

        {/* Spinner Demo */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center">
            <Spinner size="lg" label="Carregando..." />
          </div>
        )}
      </div>
    </div>
  )
}
