'use client';

import { useEffect, useState } from 'react';
import { useBrandStore } from '@/store/brandStore';

interface GapData {
  id: string;
  city: string;
  state: string;
  population: number;
  potentialMarket: number;
  totalRevenue: number;
  coveragePercentage: number;
  uncoveredPotential: number;
}

export default function GapAnalysisPage() {
  const { selectedBrandId } = useBrandStore();
  const [gaps, setGaps] = useState<GapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyWhiteZones, setShowOnlyWhiteZones] = useState(false);

  useEffect(() => {
    fetchGaps();
  }, [selectedBrandId, showOnlyWhiteZones]);

  const fetchGaps = async () => {
    if (!selectedBrandId) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('brand', selectedBrandId);
      if (showOnlyWhiteZones) params.append('whiteZonesOnly', 'true');

      const response = await fetch(`/api/data/gap-analysis?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao buscar análise de gaps');

      const data = await response.json();
      setGaps(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'bg-green-100 text-green-800';
    if (coverage >= 50) return 'bg-yellow-100 text-yellow-800';
    if (coverage >= 20) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const totalPotential = gaps.reduce((sum, g) => sum + g.potentialMarket, 0);
  const totalRevenue = gaps.reduce((sum, g) => sum + g.totalRevenue, 0);
  const totalGap = totalPotential - totalRevenue;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Análise de Zonas Brancas</h1>
        <p className="text-gray-600 mt-2">Identificação de oportunidades de expansão territorial</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Potencial Total</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            R$ {totalPotential.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Receita Atual</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            R$ {totalRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Gap Identificado</div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            R$ {totalGap.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Cobertura Média</div>
          <div className="text-2xl font-bold text-gray-900 mt-2">
            {gaps.length > 0 ? (totalRevenue / totalPotential * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyWhiteZones}
            onChange={(e) => setShowOnlyWhiteZones(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">
            Mostrar apenas zonas brancas (cobertura &lt; 20%)
          </span>
        </label>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Carregando...</div>
        ) : gaps.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Nenhum dado encontrado</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Localidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    População
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Potencial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Receita Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Gap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Cobertura
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gaps.map((gap) => (
                  <tr key={gap.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {gap.city}, {gap.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {gap.population?.toLocaleString('pt-BR') || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {gap.potentialMarket.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {gap.totalRevenue.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      R$ {gap.uncoveredPotential.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCoverageColor(gap.coveragePercentage)}`}>
                        {gap.coveragePercentage.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
