'use client'

import { useState } from 'react'

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleImport = async () => {
    if (!file) {
      setError('Selecione um arquivo Excel')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('brandId', 'demo-brand-id')
      formData.append('tenantId', 'demo-tenant-id')

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao importar')
        return
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Importar Dados</h1>
        <p className="text-gray-600 mt-2">
          Importe dados de clientes e vendas a partir de um arquivo Excel
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-12l-4-4m0 0l-4 4m4-4v12"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <label className="block">
            <span className="sr-only">Escolher arquivo</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </label>

          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Arquivo selecionado: <strong>{file.name}</strong>
            </p>
          )}

          <button
            onClick={handleImport}
            disabled={!file || loading}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? 'Importando...' : 'Importar Arquivo'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Erro</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-4">✅ Importação Concluída</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Clientes Importados</p>
              <p className="text-2xl font-bold text-green-600">{result.imported}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Total de Registros</p>
              <p className="text-2xl font-bold text-blue-600">{result.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Bairros</p>
              <p className="text-2xl font-bold text-purple-600">{result.neighborhoods?.length || 0}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-orange-600">
                R$ {(result.totalRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>

          {result.neighborhoods && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Bairros Importados</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {result.neighborhoods.map((bairro: string) => (
                  <div key={bairro} className="bg-white rounded px-3 py-2 text-sm text-gray-700">
                    {bairro}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">Erros ({result.errors.length})</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                {result.errors.slice(0, 5).map((err: string, i: number) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">📋 Formato Esperado</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✓ Arquivo Excel (.xlsx) com dados de clientes</li>
          <li>✓ Colunas: CNPJ, Razão Social, Nome Fantasia, Telefone, Bairro, CEP</li>
          <li>✓ Colunas de faturamento com datas (ex: 2025-09-01, 2026-01-01)</li>
          <li>✓ Formato: "ANALISE RJ (1).xlsx" ou similar</li>
        </ul>
      </div>
    </div>
  )
}
