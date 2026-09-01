import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generatePDFReport } from '@/services/reportGenerator';
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

    if (!brandId || !month) {
      return NextResponse.json(
        { error: 'Brand ID e month são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar marca
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

    // Buscar clientes da marca
    const { data: customers } = await supabase
      .from('customers')
      .select('cnpj, razaoSocial, revenue, status, representante')
      .eq('brand_id', brandId)
      .order('revenue', { ascending: false });

    // Buscar vendas do período
    const [year, monthNum] = month.split('-');
    const monthStart = `${year}-${monthNum}-01`;
    const monthEnd = new Date(parseInt(year), parseInt(monthNum), 0)
      .toISOString()
      .split('T')[0];

    const { data: sales } = await supabase
      .from('sales')
      .select('amount, created_at, product')
      .eq('brand_id', brandId)
      .gte('created_at', monthStart)
      .lte('created_at', monthEnd);

    // Buscar gaps
    const { data: gaps } = await supabase
      .from('geo_neighborhoods')
      .select('cityName, state, potentialMarket, uncoveredPotential')
      .order('uncoveredPotential', { ascending: false })
      .limit(15);

    // Calcular KPIs
    const totalRevenue = (customers || []).reduce((sum, c) => sum + (c.revenue || 0), 0);
    const activeCustomers = (customers || []).filter((c) => c.status === 'ativo').length;
    const coverage = customers && customers.length > 0 ? (activeCustomers / customers.length) * 100 : 0;
    const gapCount = (gaps || []).filter((g: any) => g.uncoveredPotential > 0).length;

    const reportData = {
      brand: brand.name,
      month: new Date(`${month}-01`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      totalRevenue,
      coverage,
      gapCount,
      customers: (customers || []).slice(0, 10).map((c: any) => ({
        cnpj: c.cnpj,
        razaoSocial: c.razaoSocial,
        faturamento: c.revenue || 0,
        status: c.status,
        representante: c.representante,
      })),
      sales: (sales || []).map((s: any) => ({
        cnpj: '',
        data: new Date(s.created_at).toLocaleDateString('pt-BR'),
        valor: s.amount || 0,
        produto: s.product || '',
      })),
      gaps: (gaps || []).map((g: any) => ({
        cidade: g.cityName,
        estado: g.state,
        potencial: g.potentialMarket || 0,
        faturamento: (g.potentialMarket || 0) - (g.uncoveredPotential || 0),
        gap: g.uncoveredPotential || 0,
      })),
      summary: {
        totalRevenue,
        coverage,
        gapCount,
      },
    } as any;

    if (format === 'pdf') {
      const pdfBuffer = generatePDFReport(reportData);
      return new NextResponse(pdfBuffer as any, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="relatorio_${brandId}_${month}.pdf"`,
        },
      });
    } else if (format === 'excel') {
      const excelBuffer = generateExcelBuffer(reportData);

      return new NextResponse(excelBuffer as any, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="relatorio_${brandId}_${month}.xlsx"`,
        },
      });
    }

    return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar relatório' },
      { status: 500 }
    );
  }
}
