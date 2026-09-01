import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePDFReport, ReportData } from '@/services/reportGenerator';
import { generateExcelBuffer } from '@/services/excelExporter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const searchParams = request.nextUrl.searchParams;
    const brandId = searchParams.get('brand');
    const month = searchParams.get('month');
    const format = searchParams.get('format') || 'pdf';

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar dados da marca
    const { data: brand } = await supabase
      .from('brands')
      .select('name')
      .eq('id', brandId)
      .single();

    if (!brand) {
      return NextResponse.json(
        { error: 'Marca não encontrada' },
        { status: 404 }
      );
    }

    // Buscar clientes e vendas
    const { data: customers } = await supabase
      .from('customers')
      .select('cnpj, name, revenue, status')
      .eq('brand_id', brandId);

    const { data: sales } = await supabase
      .from('sales')
      .select('customer_id, amount, created_at, product')
      .eq('brand_id', brandId);

    // Calcular KPIs
    const totalRevenue = (customers || []).reduce((sum, c) => sum + (c.revenue || 0), 0);
    const coverage = customers ? (customers.length / 1000) * 100 : 0; // Placeholder
    const gaps = (customers || []).filter(c => c.status === 'prospect').length;

    // Top clientes
    const topCustomers = (customers || [])
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 10)
      .map(c => ({
        name: c.name,
        revenue: c.revenue || 0,
        status: c.status,
      }));

    // Análise de gaps (placeholder)
    const gapAnalysis = [
      {
        city: 'Rio de Janeiro',
        state: 'RJ',
        potential: 500000,
        revenue: 250000,
        gap: 250000,
      },
    ];

    const reportData: ReportData = {
      brandName: brand.name,
      month: month || new Date().toLocaleDateString('pt-BR'),
      totalRevenue,
      coverage,
      gaps,
      topCustomers,
      gapAnalysis,
    };

    if (format === 'pdf') {
      const pdfBuffer = generatePDFReport(reportData);
      return new NextResponse(pdfBuffer as any, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="relatorio_${brandId}_${month}.pdf"`,
        },
      });
    } else if (format === 'excel') {
      const excelBuffer = generateExcelBuffer({
        customers: (customers || []).map(c => ({
          cnpj: c.cnpj || '',
          razao_social: c.name || '',
          cidade: '',
          estado: '',
          faturamento: c.revenue || 0,
          status: c.status || '',
        })),
        sales: (sales || []).map(s => ({
          cnpj: '',
          data: s.created_at || '',
          valor: s.amount || 0,
          produto: s.product || '',
        })),
        gaps: (gapAnalysis || []).map(g => ({
          cidade: g.city || '',
          estado: g.state || '',
          potencial: g.potential || 0,
          faturamento: g.revenue || 0,
          gap: g.gap || 0,
        })),
        summary: {
          totalRevenue,
          coverage,
          gapCount: gaps,
        },
      });

      return new NextResponse(excelBuffer as any, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="relatorio_${brandId}_${month}.xlsx"`,
        },
      });
    }

    return NextResponse.json(reportData);
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}
