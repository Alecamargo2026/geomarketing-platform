'use client'

import { useState, useCallback } from 'react'
import { Upload, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface ImportResult {
  success: boolean
  clientes: number
  vendas: number
  bairros: number
  errors: string[]
  warnings: string[]
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      validateAndSetFile(droppedFile)
    }
  }, [])

  const validateAndSetFile = (selectedFile: File) => {
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!validTypes.includes(selectedFile.type)) {
      setError('❌ Arquivo inválido. Use Excel (.xlsx, .xls) ou CSV (.csv)')
      return
    }

    if (selectedFile.size > maxSize) {
      setError('❌ Arquivo muito grande. Máximo 10MB')
      return
    }

    setFile(selectedFile)
    setError(null)
    setResult(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      validateAndSetFile(selectedFile)
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

      const response = await fetch('/api/import/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao importar')
        return
      }

      setResult({
        success: true,
        clientes: data.customersInserted || 0,
        vendas: data.salesInserted || 0,
        bairros: data.neighborhoodsInserted || 0,
        errors: data.errors || [],
        warnings: data.warnings || [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">📊 Como Importar Dados de Clientes</h1>
        <p className="text-gray-600 mt-2 text-lg">
          Versão 2.0 - Redesenho Completo | Status: ✅ Interface Totalmente Renovada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Upload Area */}
        <div className="lg:col-span-2">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400'
            }`}
          >
            <Upload className="mx-auto h-16 w-16 text-blue-500 mb-4" />

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Arraste seu arquivo aqui
            </h2>
            <p className="text-gray-600 mb-6">
              ou clique para selecionar
            </p>

            <label className="block">
              <span className="sr-only">Escolher arquivo</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input[type="file"]') as HTMLInputElement
                  input?.click()
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                📁 Escolher Arquivo
              </button>
            </label>

            {file && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                <p className="text-green-700 font-semibold">✅ Arquivo Selecionado</p>
                <p className="text-gray-700 mt-2">{file.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  🔄 Escolher Outro Arquivo
                </button>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500">
              Formatos aceitos: <strong>.xlsx</strong>, <strong>.xls</strong>, <strong>.csv</strong>
              <br />
              Tamanho máximo: <strong>10 MB</strong>
            </div>
          </div>

          {/* Import Button */}
          {file && (
            <button
              onClick={handleImport}
              disabled={loading}
              className="w-full mt-6 px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition font-bold text-lg"
            >
              {loading ? '⏳ Importando...' : '🚀 IMPORTAR AGORA'}
            </button>
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          {/* Card 1: Aba Clientes */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-blue-900">Aba 1: Clientes</h3>
                <p className="text-sm text-blue-800 mt-2">
                  <strong>Obrigatório</strong>
                </p>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• razaoSocial</li>
                  <li>• cnpj</li>
                  <li>• latitude</li>
                  <li>• longitude</li>
                  <li>• city</li>
                  <li>• estado</li>
                  <li>• status</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Aba Vendas */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-purple-900">Aba 2: Vendas</h3>
                <p className="text-sm text-purple-800 mt-2">
                  <strong>Opcional</strong>
                </p>
                <ul className="text-xs text-purple-700 mt-2 space-y-1">
                  <li>• cnpj</li>
                  <li>• dataEmissao</li>
                  <li>• valorTotal</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Aba Bairros */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-orange-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900">Aba 3: Bairros</h3>
                <p className="text-sm text-orange-800 mt-2">
                  <strong>Opcional</strong>
                </p>
                <ul className="text-xs text-orange-700 mt-2 space-y-1">
                  <li>• bairro</li>
                  <li>• city</li>
                  <li>• estado</li>
                  <li>• populacao</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-900">Erro na Importação</h3>
            <p className="text-red-700 mt-2">{error}</p>
          </div>
        </div>
      )}

      {/* Success Result */}
      {result && result.success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="flex gap-4 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-green-900">✅ Importação Concluída!</h2>
              <p className="text-green-700 mt-1">Seus dados foram importados com sucesso</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600">Clientes</p>
              <p className="text-3xl font-bold text-green-600">{result.clientes}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600">Vendas</p>
              <p className="text-3xl font-bold text-purple-600">{result.vendas}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600">Bairros</p>
              <p className="text-3xl font-bold text-orange-600">{result.bairros}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-blue-600">
                {result.clientes + result.vendas + result.bairros}
              </p>
            </div>
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">
                ⚠️ Avisos ({result.warnings.length})
              </p>
              <ul className="text-sm text-yellow-800 space-y-1">
                {result.warnings.slice(0, 5).map((warn, i) => (
                  <li key={i}>• {warn}</li>
                ))}
              </ul>
            </div>
          )}

          {result.errors && result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-900 mb-2">
                ❌ Erros ({result.errors.length})
              </p>
              <ul className="text-sm text-red-800 space-y-1">
                {result.errors.slice(0, 5).map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setFile(null)
              setResult(null)
            }}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Importar Outro Arquivo
          </button>
        </div>
      )}

      {/* Example Table */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">📋 Exemplo de Estrutura Excel</h3>

        <div className="space-y-6">
          {/* Clientes Tab */}
          <div>
            <h4 className="font-bold text-blue-900 mb-3">Aba 1: Clientes (OBRIGATÓRIO)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="border border-blue-300 px-4 py-2 text-left">razaoSocial</th>
                    <th className="border border-blue-300 px-4 py-2 text-left">cnpj</th>
                    <th className="border border-blue-300 px-4 py-2 text-left">latitude</th>
                    <th className="border border-blue-300 px-4 py-2 text-left">longitude</th>
                    <th className="border border-blue-300 px-4 py-2 text-left">city</th>
                    <th className="border border-blue-300 px-4 py-2 text-left">estado</th>
                    <th className="border border-blue-300 px-4 py-2 text-left">status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Empresa X LTDA</td>
                    <td className="border border-gray-300 px-4 py-2">12.345.678/0001-00</td>
                    <td className="border border-gray-300 px-4 py-2">-22.9068</td>
                    <td className="border border-gray-300 px-4 py-2">-43.1729</td>
                    <td className="border border-gray-300 px-4 py-2">Rio de Janeiro</td>
                    <td className="border border-gray-300 px-4 py-2">RJ</td>
                    <td className="border border-gray-300 px-4 py-2">ativo</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Empresa Y LTDA</td>
                    <td className="border border-gray-300 px-4 py-2">87.654.321/0001-99</td>
                    <td className="border border-gray-300 px-4 py-2">-22.8756</td>
                    <td className="border border-gray-300 px-4 py-2">-43.2944</td>
                    <td className="border border-gray-300 px-4 py-2">Rio de Janeiro</td>
                    <td className="border border-gray-300 px-4 py-2">RJ</td>
                    <td className="border border-gray-300 px-4 py-2">prospect</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Vendas Tab */}
          <div>
            <h4 className="font-bold text-purple-900 mb-3">Aba 2: Vendas (OPCIONAL)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-purple-300 px-4 py-2 text-left">cnpj</th>
                    <th className="border border-purple-300 px-4 py-2 text-left">dataEmissao</th>
                    <th className="border border-purple-300 px-4 py-2 text-left">valorTotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">12.345.678/0001-00</td>
                    <td className="border border-gray-300 px-4 py-2">2026-08-15</td>
                    <td className="border border-gray-300 px-4 py-2">15000.00</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">12.345.678/0001-00</td>
                    <td className="border border-gray-300 px-4 py-2">2026-08-20</td>
                    <td className="border border-gray-300 px-4 py-2">8500.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bairros Tab */}
          <div>
            <h4 className="font-bold text-orange-900 mb-3">Aba 3: Bairros (OPCIONAL)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-orange-100">
                    <th className="border border-orange-300 px-4 py-2 text-left">bairro</th>
                    <th className="border border-orange-300 px-4 py-2 text-left">city</th>
                    <th className="border border-orange-300 px-4 py-2 text-left">estado</th>
                    <th className="border border-orange-300 px-4 py-2 text-left">populacao</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Centro</td>
                    <td className="border border-gray-300 px-4 py-2">Rio de Janeiro</td>
                    <td className="border border-gray-300 px-4 py-2">RJ</td>
                    <td className="border border-gray-300 px-4 py-2">120000</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">Copacabana</td>
                    <td className="border border-gray-300 px-4 py-2">Rio de Janeiro</td>
                    <td className="border border-gray-300 px-4 py-2">RJ</td>
                    <td className="border border-gray-300 px-4 py-2">150000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Dicas Importantes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">✅ Nomes de Coluna Exatos</h4>
            <p className="text-sm text-gray-700">
              Use <strong>exatamente</strong> estes nomes (case-sensitive):
              razaoSocial, cnpj, latitude, longitude, city, estado, status, dataEmissao, valorTotal, bairro, populacao
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">📊 Formato de Dados</h4>
            <p className="text-sm text-gray-700">
              Latitude/Longitude: -22.9068 (NOT -22,9068)
              <br />
              Data: 2026-08-15 (YYYY-MM-DD)
              <br />
              Valor: 15000.00 (NOT R$ 15.000,00)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
