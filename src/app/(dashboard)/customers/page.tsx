'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function CustomersPage() {
  const { user } = useAuthStore()
  const [customers] = useState([
    {
      id: 1,
      name: 'Cliente A',
      cnpj: '12.345.678/0001-90',
      city: 'Rio de Janeiro',
      state: 'RJ',
      revenue: 150000,
      status: 'Ativo',
    },
    {
      id: 2,
      name: 'Cliente B',
      cnpj: '98.765.432/0001-10',
      city: 'São Paulo',
      state: 'SP',
      revenue: 250000,
      status: 'Ativo',
    },
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600 mt-2">Gerenciar clientes e dados comerciais</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Lista de Clientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nome</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">CNPJ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cidade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Faturamento</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.cnpj}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">R$ {customer.revenue.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
