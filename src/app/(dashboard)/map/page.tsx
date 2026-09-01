'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useBrandStore } from '@/store/brandStore';
import { useRealtimeCustomers } from '@/hooks/useRealtime';

const HeatmapInteractive = dynamic(
  () => import('@/components/HeatmapInteractive').then((mod) => mod.HeatmapInteractive),
  { ssr: false, loading: () => <div className="h-96 bg-gray-200 rounded-lg animate-pulse" /> }
);

interface Customer {
  id: string;
  razaoSocial: string;
  cnpj: string;
  latitude: number;
  longitude: number;
  status: string;
  cidade: string;
  estado: string;
  representante?: string;
  revenue?: number;
}

export default function MapPage() {
  const { selectedBrandId } = useBrandStore();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Usar realtime para atualizar dados
  useRealtimeCustomers(selectedBrandId);

  useEffect(() => {
    fetchCustomers();
  }, [selectedBrandId]);

  const fetchCustomers = async () => {
    if (!selectedBrandId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/customers?brandId=${selectedBrandId}`);
      if (!response.ok) throw new Error('Erro ao buscar clientes');

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mapa de Cobertura</h1>
        <p className="text-gray-600 mt-2">Visualize a distribuição geográfica de seus clientes</p>
      </div>

      {loading ? (
        <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <HeatmapInteractive
                customers={customers}
                onCustomerClick={setSelectedCustomer}
              />
            </div>
          </div>

          {/* Painel de Detalhes */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h2>

            {selectedCustomer ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-600 uppercase">Razão Social</div>
                  <div className="font-medium text-gray-900">{selectedCustomer.razaoSocial}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 uppercase">CNPJ</div>
                  <div className="font-medium text-gray-900">{selectedCustomer.cnpj}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 uppercase">Localização</div>
                  <div className="font-medium text-gray-900">
                    {selectedCustomer.cidade}, {selectedCustomer.estado}
                  </div>
                </div>

                {selectedCustomer.representante && (
                  <div>
                    <div className="text-xs text-gray-600 uppercase">Representante</div>
                    <div className="font-medium text-gray-900">{selectedCustomer.representante}</div>
                  </div>
                )}

                {selectedCustomer.revenue && (
                  <div>
                    <div className="text-xs text-gray-600 uppercase">Faturamento</div>
                    <div className="font-medium text-gray-900">
                      R$ {selectedCustomer.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-600 uppercase">Status</div>
                  <div className="mt-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedCustomer.status === 'ativo'
                          ? 'bg-green-100 text-green-800'
                          : selectedCustomer.status === 'inativo'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Clique em um cliente no mapa para ver detalhes
              </div>
            )}
          </div>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total de Clientes</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">{customers.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Clientes Ativos</div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {customers.filter((c) => c.status === 'ativo').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Clientes Inativos</div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            {customers.filter((c) => c.status === 'inativo').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Prospects</div>
          <div className="text-2xl font-bold text-orange-600 mt-2">
            {customers.filter((c) => c.status === 'prospect').length}
          </div>
        </div>
      </div>
    </div>
  );
}
