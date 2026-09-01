'use client';

import { useEffect, useState } from 'react';
import { useBrandStore } from '@/store/brandStore';

interface ImportLog {
  id: string;
  filename: string;
  imported_count: number;
  error_count: number;
  status: string;
  created_at: string;
  completed_at?: string;
}

export default function ImportHistoryPage() {
  const { selectedBrandId } = useBrandStore();
  const [imports, setImports] = useState<ImportLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImports = async () => {
      if (!selectedBrandId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/import/history?brand=${selectedBrandId}`);
        if (response.ok) {
          const data = await response.json();
          setImports(data);
        }
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImports();
  }, [selectedBrandId]);

  if (!selectedBrandId) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Selecione uma marca para ver o histórico de importações</p>
      </div>
    );
  }

  if (loading) {
    return <div className="animate-pulse">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Histórico de Importações</h1>
        <p className="text-gray-600 mt-2">Visualize todos os arquivos importados</p>
      </div>

      {imports.length === 0 ? (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">Nenhuma importação realizada ainda</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Arquivo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Importados</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Erros</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {imports.map((imp) => (
                <tr key={imp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{imp.filename}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      imp.status === 'completed' ? 'bg-green-100 text-green-800' :
                      imp.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {imp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{imp.imported_count}</td>
                  <td className="px-6 py-4 text-sm text-red-600">{imp.error_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(imp.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
