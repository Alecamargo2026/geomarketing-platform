import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
  brandName: string;
  month: string;
  totalRevenue: number;
  coverage: number;
  gaps: number;
  topCustomers: Array<{
    name: string;
    revenue: number;
    status: string;
  }>;
  gapAnalysis: Array<{
    city: string;
    state: string;
    potential: number;
    revenue: number;
    gap: number;
  }>;
}

export function generatePDFReport(data: ReportData): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Cabeçalho
  doc.setFontSize(20);
  doc.text('Relatório Mensal de Vendas', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Informações básicas
  doc.setFontSize(12);
  doc.text(`Marca: ${data.brandName}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Período: ${data.month}`, 20, yPosition);
  yPosition += 15;

  // KPIs
  doc.setFontSize(14);
  doc.text('KPIs Principais', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.text(`Faturamento Total: R$ ${data.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, yPosition);
  yPosition += 8;
  doc.text(`Cobertura Territorial: ${data.coverage.toFixed(1)}%`, 20, yPosition);
  yPosition += 8;
  doc.text(`Zonas Brancas Identificadas: ${data.gaps}`, 20, yPosition);
  yPosition += 15;

  // Top Clientes
  doc.setFontSize(14);
  doc.text('Top 10 Clientes', 20, yPosition);
  yPosition += 10;

  const topCustomersData = data.topCustomers.map((customer) => [
    customer.name,
    `R$ ${customer.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    customer.status,
  ]);

  autoTable(doc, {
    head: [['Cliente', 'Faturamento', 'Status']],
    body: topCustomersData,
    startY: yPosition,
    margin: { left: 20, right: 20 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Análise de Gaps
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text('Análise de Zonas Brancas', 20, yPosition);
  yPosition += 10;

  const gapData = data.gapAnalysis.map((gap) => [
    `${gap.city}, ${gap.state}`,
    `R$ ${gap.potential.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `R$ ${gap.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    `R$ ${gap.gap.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  ]);

  autoTable(doc, {
    head: [['Localidade', 'Potencial', 'Faturamento', 'Gap']],
    body: gapData,
    startY: yPosition,
    margin: { left: 20, right: 20 },
  });

  // Rodapé
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
      20,
      pageHeight - 10
    );
  }

  return Buffer.from(doc.output('arraybuffer'));
}
