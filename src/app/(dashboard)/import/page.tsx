'use client'

export default function ImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Importar Dados</h1>
        <p className="text-gray-600 mt-2">Importe dados de clientes em Excel ou CSV</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-gray-600">
            <p className="text-lg font-semibold mb-2">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-sm">Formatos suportados: Excel (.xlsx), CSV (.csv)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
