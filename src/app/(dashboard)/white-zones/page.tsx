'use client'

export default function WhiteZonesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Zonas Brancas</h1>
        <p className="text-gray-600 mt-2">Identifique oportunidades de expansão territorial</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Zonas Brancas Críticas</h3>
          <p className="text-3xl font-bold text-red-600">114</p>
          <p className="text-gray-600 text-sm mt-2">Cidades sem clientes com alto potencial</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Potencial Não Explorado</h3>
          <p className="text-3xl font-bold text-blue-600">R$ 2.1M</p>
          <p className="text-gray-600 text-sm mt-2">Oportunidade de faturamento</p>
        </div>
      </div>
    </div>
  )
}
