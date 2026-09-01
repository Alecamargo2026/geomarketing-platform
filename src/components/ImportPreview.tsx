'use client';

import { useState } from 'react';
import { ParsedImportData } from '@/services/excelParser';
import { CustomerImportSchema, PriorityImportSchema, SaleImportSchema } from '@/lib/validators/importSchema';
import { ZodError } from 'zod';

interface ImportPreviewProps {
  data: ParsedImportData;
  onImport: (data: ParsedImportData) => Promise<void>;
  onCancel: () => void;
}

export function ImportPreview({ data, onImport, onCancel }: ImportPreviewProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'analysis' | 'priority' | 'transaction'>('analysis');

  const validateData = () => {
    const errors: Record<string, string[]> = {};

    // Validar dados de análise
    data.analysisData.forEach((row, idx) => {
      try {
        CustomerImportSchema.parse(row);
      } catch (error) {
        if (error instanceof ZodError) {
          errors[`analysis_${idx}`] = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        }
      }
    });

    // Validar dados de prioridade
    data.priorityData.forEach((row, idx) => {
      try {
        PriorityImportSchema.parse(row);
      } catch (error) {
        if (error instanceof ZodError) {
          errors[`priority_${idx}`] = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        }
      }
    });

    // Validar dados de transação
    data.transactionData.forEach((row, idx) => {
      try {
        SaleImportSchema.parse(row);
      } catch (error) {
        if (error instanceof ZodError) {
          errors[`transaction_${idx}`] = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImport = async () => {
    if (!validateData()) {
      alert('Existem erros de validação. Corrija antes de importar.');
      return;
    }

    setIsImporting(true);
    try {
      await onImport(data);
      alert('Importação realizada com sucesso!');
      onCancel();
    } catch (error) {
      alert(`Erro ao importar: ${error}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gray-50 border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Pré-visualização de Importação</h2>
          <p className="text-gray-600 mt-1">Revise os dados antes de importar</p>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'analysis'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Análise ({data.analysisData.length} linhas)
            </button>
            <button
              onClick={() => setActiveTab('priority')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'priority'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Prioridade ({data.priorityData.length} linhas)
            </button>
            <button
              onClick={() => setActiveTab('transaction')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'transaction'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Transações ({data.transactionData.length} linhas)
            </button>
          </div>

          {/* Dados de Análise */}
          {activeTab === 'analysis' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">CNPJ</th>
                    <th className="px-4 py-2 text-left">Razão Social</th>
                    <th className="px-4 py-2 text-left">Cidade</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.analysisData.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{row.cnpj}</td>
                      <td className="px-4 py-2">{row.razao_social}</td>
                      <td className="px-4 py-2">{row.cidade}</td>
                      <td className="px-4 py-2">{row.estado}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          row.status === 'ativo' ? 'bg-green-100 text-green-800' :
                          row.status === 'inativo' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.analysisData.length > 10 && (
                <p className="text-gray-600 mt-2">... e mais {data.analysisData.length - 10} linhas</p>
              )}
            </div>
          )}

          {/* Dados de Prioridade */}
          {activeTab === 'priority' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">CNPJ</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Urgência</th>
                    <th className="px-4 py-2 text-left">Última Visita</th>
                  </tr>
                </thead>
                <tbody>
                  {data.priorityData.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{row.cnpj}</td>
                      <td className="px-4 py-2">{row.priority_score}</td>
                      <td className="px-4 py-2">{row.urgency}</td>
                      <td className="px-4 py-2">{row.last_visit || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.priorityData.length > 10 && (
                <p className="text-gray-600 mt-2">... e mais {data.priorityData.length - 10} linhas</p>
              )}
            </div>
          )}

          {/* Dados de Transação */}
          {activeTab === 'transaction' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">CNPJ</th>
                    <th className="px-4 py-2 text-left">Data</th>
                    <th className="px-4 py-2 text-left">Valor</th>
                    <th className="px-4 py-2 text-left">Produto</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactionData.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{row.cnpj}</td>
                      <td className="px-4 py-2">{new Date(row.data_venda).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-2">R$ {row.valor.toFixed(2)}</td>
                      <td className="px-4 py-2">{row.produto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.transactionData.length > 10 && (
                <p className="text-gray-600 mt-2">... e mais {data.transactionData.length - 10} linhas</p>
              )}
            </div>
          )}

          {/* Erros de Validação */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
              <h3 className="font-semibold text-red-900 mb-2">Erros de Validação:</h3>
              <ul className="text-sm text-red-800 space-y-1">
                {Object.entries(validationErrors).slice(0, 5).map(([key, errors]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {errors.join(', ')}
                  </li>
                ))}
              </ul>
              {Object.keys(validationErrors).length > 5 && (
                <p className="text-red-800 mt-2">... e mais {Object.keys(validationErrors).length - 5} erros</p>
              )}
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-6 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting || Object.keys(validationErrors).length > 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  );
}
