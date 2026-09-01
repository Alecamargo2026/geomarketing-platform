import * as XLSX from 'xlsx';

export interface ExportData {
  customers: Array<{
    cnpj: string;
    razao_social: string;
    cidade: string;
    estado: string;
    faturamento: number;
    status: string;
  }>;
  sales: Array<{
    cnpj: string;
    data: string;
    valor: number;
    produto: string;
  }>;
  gaps: Array<{
    cidade: string;
    estado: string;
    potencial: number;
    faturamento: number;
    gap: number;
  }>;
  summary: {
    totalRevenue: number;
    coverage: number;
    gapCount: number;
  };
}

export function exportToExcel(data: ExportData, filename: string): void {
  const workbook = XLSX.utils.book_new();

  // Aba de Resumo
  const summarySheet = XLSX.utils.json_to_sheet([
    {
      'Métrica': 'Faturamento Total',
      'Valor': data.summary.totalRevenue,
    },
    {
      'Métrica': 'Cobertura Territorial',
      'Valor': `${data.summary.coverage.toFixed(1)}%`,
    },
    {
      'Métrica': 'Zonas Brancas',
      'Valor': data.summary.gapCount,
    },
  ]);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  // Aba de Clientes
  const customersSheet = XLSX.utils.json_to_sheet(data.customers);
  XLSX.utils.book_append_sheet(workbook, customersSheet, 'Clientes');

  // Aba de Vendas
  const salesSheet = XLSX.utils.json_to_sheet(data.sales);
  XLSX.utils.book_append_sheet(workbook, salesSheet, 'Vendas');

  // Aba de Gaps
  const gapsSheet = XLSX.utils.json_to_sheet(data.gaps);
  XLSX.utils.book_append_sheet(workbook, gapsSheet, 'Zonas Brancas');

  // Salvar arquivo
  XLSX.writeFile(workbook, filename);
}

export function generateExcelBuffer(data: ExportData): Buffer {
  const workbook = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.json_to_sheet([
    {
      'Métrica': 'Faturamento Total',
      'Valor': data.summary.totalRevenue,
    },
    {
      'Métrica': 'Cobertura Territorial',
      'Valor': `${data.summary.coverage.toFixed(1)}%`,
    },
    {
      'Métrica': 'Zonas Brancas',
      'Valor': data.summary.gapCount,
    },
  ]);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  const customersSheet = XLSX.utils.json_to_sheet(data.customers);
  XLSX.utils.book_append_sheet(workbook, customersSheet, 'Clientes');

  const salesSheet = XLSX.utils.json_to_sheet(data.sales);
  XLSX.utils.book_append_sheet(workbook, salesSheet, 'Vendas');

  const gapsSheet = XLSX.utils.json_to_sheet(data.gaps);
  XLSX.utils.book_append_sheet(workbook, gapsSheet, 'Zonas Brancas');

  return XLSX.write(workbook, { type: 'buffer' });
}
