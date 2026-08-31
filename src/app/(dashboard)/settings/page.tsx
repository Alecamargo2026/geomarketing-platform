'use client'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600 mt-2">Personalize sua plataforma</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações Gerais</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Nome da Empresa</label>
            <input
              type="text"
              defaultValue="Geomarketing"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email de Contato</label>
            <input
              type="email"
              defaultValue="contato@geomarketing.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
