'use client';

import { useState } from 'react';
import { useBrandStore } from '@/store/brandStore';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const { selectedBrandId } = useBrandStore();
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleGenerateReport = async (format: 'pdf' | 'excel') => {
    if (!selectedBrandId) {
      toast.error('Selecione uma marca primeiro');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/reports/generate?brand=${selectedBrandId}&month=${month}&format=${format}`
      );

      if (!response.ok) throw new Error('Erro ao gerar relatório');

      // Fazer download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio_${selectedBrandId}_${month}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Relatório gerado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-2">Gere relatórios mensais de vendas e análise de gaps</p>
      </div>

      {/* Gerador de Relatórios */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Gerar Novo Relatório</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Período
          </label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleGenerateReport('pdf')}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
          >
            {loading ? 'Gerando...' : 'Gerar PDF'}
          </button>
          <button
            onClick={() => handleGenerateReport('excel')}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
          >
            {loading ? 'Gerando...' : 'Gerar Excel'}
          </button>
        </div>
      </div>

      {/* Informações */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">O que está incluído no relatório?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Indicadores principais (faturamento, cobertura, gaps)</li>
          <li>✓ Top 10 clientes por faturamento</li>
          <li>✓ Análise de zonas brancas</li>
          <li>✓ Gráficos de faturamento e status</li>
          <li>✓ Dados detalhados em abas separadas (Excel)</li>
        </ul>
      </div>
    </div>
  );
}
