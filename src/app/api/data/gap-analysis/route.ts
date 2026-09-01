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
    const whiteZonesOnly = searchParams.get('whiteZonesOnly') === 'true';

    if (!brandId) {
      return NextResponse.json(
        { error: 'Brand ID é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar bairros com dados de potencial e gap
    let query = supabase
      .from('geo_neighborhoods')
      .select('id, name, cityName, state, population, potentialMarket, uncoveredPotential, coveragePercentage')
      .order('uncoveredPotential', { ascending: false });

    if (whiteZonesOnly) {
      query = query.lt('coveragePercentage', 20);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Mapear dados para o formato esperado
    const gaps = (data || []).map((neighborhood: any) => ({
      id: neighborhood.id,
      city: neighborhood.cityName,
      state: neighborhood.state,
      population: neighborhood.population || 0,
      potentialMarket: neighborhood.potentialMarket || 0,
      totalRevenue: (neighborhood.potentialMarket || 0) - (neighborhood.uncoveredPotential || 0),
      uncoveredPotential: neighborhood.uncoveredPotential || 0,
      coveragePercentage: neighborhood.coveragePercentage || 0,
    }));

    return NextResponse.json(gaps);
  } catch (error) {
    console.error('Erro ao buscar gap analysis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar análise de gaps' },
      { status: 500 }
    );
  }
}
