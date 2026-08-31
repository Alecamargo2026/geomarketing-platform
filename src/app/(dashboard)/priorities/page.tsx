'use client'

export default function PrioritiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Prioridades de Visita</h1>
        <p className="text-gray-600 mt-2">Defina a cadência de visitas por cliente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prioridade A</h3>
          <p className="text-3xl font-bold text-red-600">15</p>
          <p className="text-gray-600 text-sm mt-2">Visita semanal</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prioridade B</h3>
          <p className="text-3xl font-bold text-orange-600">32</p>
          <p className="text-gray-600 text-sm mt-2">Visita quinzenal</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prioridade C</h3>
          <p className="text-3xl font-bold text-yellow-600">45</p>
          <p className="text-gray-600 text-sm mt-2">Visita mensal</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prioridade D</h3>
          <p className="text-3xl font-bold text-green-600">26</p>
          <p className="text-gray-600 text-sm mt-2">Visita bimestral</p>
        </div>
      </div>
    </div>
  )
}
