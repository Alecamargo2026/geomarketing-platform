import * as XLSX from 'xlsx';

export interface ExcelData {
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

export function generateExcelBuffer(data: ExcelData): Buffer {
  const workbook = XLSX.utils.book_new();

  // Aba Resumo
  const summaryData = [
    ['Métrica', 'Valor'],
    ['Faturamento Total', `R$ ${data.summary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
    ['Cobertura', `${data.summary.coverage.toFixed(1)}%`],
    ['Zonas Brancas', data.summary.gapCount],
  ];
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

  // Aba Clientes
  const customersData = [
    ['CNPJ', 'Razão Social', 'Cidade', 'Estado', 'Faturamento', 'Status'],
    ...data.customers.map((c) => [
      c.cnpj,
      c.razao_social,
      c.cidade,
      c.estado,
      c.faturamento,
      c.status,
    ]),
  ];
  const customersSheet = XLSX.utils.aoa_to_sheet(customersData);
  XLSX.utils.book_append_sheet(workbook, customersSheet, 'Clientes');

  // Aba Vendas
  const salesData = [
    ['CNPJ', 'Data', 'Valor', 'Produto'],
    ...data.sales.map((s) => [s.cnpj, s.data, s.valor, s.produto]),
  ];
  const salesSheet = XLSX.utils.aoa_to_sheet(salesData);
  XLSX.utils.book_append_sheet(workbook, salesSheet, 'Vendas');

  // Aba Gaps
  const gapsData = [
    ['Cidade', 'Estado', 'Potencial', 'Faturamento', 'Gap'],
    ...data.gaps.map((g) => [g.cidade, g.estado, g.potencial, g.faturamento, g.gap]),
  ];
  const gapsSheet = XLSX.utils.aoa_to_sheet(gapsData);
  XLSX.utils.book_append_sheet(workbook, gapsSheet, 'Gaps');

  // Converter para buffer
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  return buffer as Buffer;
}
