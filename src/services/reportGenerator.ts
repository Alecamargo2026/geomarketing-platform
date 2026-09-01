import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportData {
  brand: string;
  month: string;
  totalRevenue: number;
  coverage: number;
  gapCount: number;
  customers: Array<{
    cnpj: string;
    razaoSocial: string;
    faturamento: number;
    status: string;
    representante?: string;
  }>;
  gaps: Array<{
    cidade: string;
    estado: string;
    potencial: number;
    faturamento: number;
    gap: number;
  }>;
}

export function generatePDFReport(data: ReportData): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Página de Título
  doc.setFontSize(24);
  doc.text('Relatório Mensal de Vendas', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  doc.setFontSize(14);
  doc.text(`Marca: ${data.brand}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  doc.setFontSize(12);
  doc.text(`Período: ${data.month}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 20;

  // KPIs
  doc.setFontSize(14);
  doc.text('Indicadores Principais', 20, yPosition);

  yPosition += 12;
  doc.setFontSize(11);

  const kpis = [
    { label: 'Faturamento Total', value: `R$ ${data.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
    { label: 'Cobertura', value: `${data.coverage.toFixed(1)}%` },
    { label: 'Zonas Brancas Identificadas', value: data.gapCount.toString() },
  ];

  kpis.forEach((kpi) => {
    doc.text(`${kpi.label}: ${kpi.value}`, 30, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Tabela de Top Clientes
  if (data.customers.length > 0) {
    doc.setFontSize(12);
    doc.text('Top 10 Clientes', 20, yPosition);
    yPosition += 8;

    const topCustomers = data.customers.slice(0, 10);
    autoTable(doc, {
      startY: yPosition,
      head: [['CNPJ', 'Razão Social', 'Faturamento', 'Status']],
      body: topCustomers.map((c) => [
        c.cnpj,
        c.razaoSocial,
        `R$ ${c.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        c.status,
      ]),
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }

  // Nova página para Gaps
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(12);
  doc.text('Análise de Zonas Brancas', 20, yPosition);
  yPosition += 8;

  if (data.gaps.length > 0) {
    const gapData = data.gaps.slice(0, 15);
    autoTable(doc, {
      startY: yPosition,
      head: [['Cidade', 'Estado', 'Potencial', 'Faturamento', 'Gap']],
      body: gapData.map((g) => [
        g.cidade,
        g.estado,
        `R$ ${g.potencial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `R$ ${g.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        `R$ ${g.gap.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      ]),
      margin: { left: 20, right: 20 },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
  }

  // Rodapé
  const pageCount = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Gerado em ${new Date().toLocaleString('pt-BR')}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  return Buffer.from(doc.output('arraybuffer'));
}
