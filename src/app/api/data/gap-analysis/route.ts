import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const searchParams = request.nextUrl.searchParams;
    const brandId = searchParams.get('brand');
    const state = searchParams.get('state');

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar bairros com dados de potencial e gap
    let query = supabase
      .from('geo_neighborhoods')
      .select('id, city, state, population, potential_market, gap_percentage, gap_reais');

    if (state) {
      query = query.eq('state', state);
    }

    const { data: neighborhoods, error } = await query;

    if (error) {
      throw error;
    }

    // Filtrar por gap (zonas brancas = gap > 20%)
    const whiteZones = (neighborhoods || [])
      .filter(n => (n.gap_percentage || 0) > 20)
      .sort((a, b) => (b.gap_reais || 0) - (a.gap_reais || 0));

    // Calcular estatísticas
    const totalPotential = (neighborhoods || []).reduce((sum, n) => sum + (n.potential_market || 0), 0);
    const totalGap = whiteZones.reduce((sum, n) => sum + (n.gap_reais || 0), 0);
    const coverage = neighborhoods && neighborhoods.length > 0
      ? ((neighborhoods.length - whiteZones.length) / neighborhoods.length) * 100
      : 0;

    return NextResponse.json({
      whiteZones: whiteZones.slice(0, 50), // Top 50 zonas brancas
      statistics: {
        totalNeighborhoods: neighborhoods?.length || 0,
        whiteZonesCount: whiteZones.length,
        coverage: coverage.toFixed(1),
        totalPotential,
        totalGap,
        averageGapPercentage: whiteZones.length > 0
          ? (whiteZones.reduce((sum, n) => sum + (n.gap_percentage || 0), 0) / whiteZones.length).toFixed(1)
          : 0,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar análise de gaps:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar análise de gaps' },
      { status: 500 }
    );
  }
}
