'use client';

import { useEffect, useState } from 'react';
import { useBrandStore } from '@/store/brandStore';

interface WhiteZone {
  id: string;
  city: string;
  state: string;
  population: number;
  potential_market: number;
  gap_percentage: number;
  gap_reais: number;
}

interface GapAnalysisData {
  whiteZones: WhiteZone[];
  statistics: {
    totalNeighborhoods: number;
    whiteZonesCount: number;
    coverage: string;
    totalPotential: number;
    totalGap: number;
    averageGapPercentage: string;
  };
}

export default function GapAnalysisPage() {
  const { selectedBrandId } = useBrandStore();
  const [data, setData] = useState<GapAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('');

  useEffect(() => {
    const fetchGapAnalysis = async () => {
      if (!selectedBrandId) {
        setLoading(false);
        return;
      }

      try {
        const url = new URL('/api/data/gap-analysis', window.location.origin);
        url.searchParams.append('brand', selectedBrandId);
        if (selectedState) {
          url.searchParams.append('state', selectedState);
        }

        const response = await fetch(url.toString());
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Erro ao buscar análise de gaps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGapAnalysis();
  }, [selectedBrandId, selectedState]);

  if (!selectedBrandId) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Selecione uma marca para ver a análise de zonas brancas</p>
      </div>
    );
  }

  if (loading) {
    return <div className="animate-pulse">Carregando...</div>;
  }

  if (!data) {
    return <div className="text-gray-600">Nenhum dado disponível</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análise de Zonas Brancas</h1>
        <p className="text-gray-600 mt-2">Identifique oportunidades de expansão territorial</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Cobertura Territorial</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.statistics.coverage}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Zonas Brancas</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{data.statistics.whiteZonesCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Potencial Total</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            R$ {(data.statistics.totalPotential / 1000000).toFixed(1)}M
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-gray-600 text-sm">Gap em Reais</p>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            R$ {(data.statistics.totalGap / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Filtro por Estado */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-900 mb-2">Filtrar por Estado</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os estados</option>
          <option value="RJ">Rio de Janeiro</option>
          <option value="SP">São Paulo</option>
          <option value="MG">Minas Gerais</option>
          <option value="BA">Bahia</option>
          <option value="RS">Rio Grande do Sul</option>
        </select>
      </div>

      {/* Tabela de Zonas Brancas */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Top Zonas Brancas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Localidade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">População</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Potencial</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Gap %</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Gap (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.whiteZones.map((zone) => (
                <tr key={zone.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {zone.city}, {zone.state}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {zone.population?.toLocaleString('pt-BR') || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    R$ {zone.potential_market?.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {zone.gap_percentage?.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600">
                    R$ {zone.gap_reais?.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
