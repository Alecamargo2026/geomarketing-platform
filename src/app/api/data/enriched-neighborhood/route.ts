import { NextResponse } from 'next/server';
import { enrichNeighborhoodData } from '@/services/geoDataService';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bairro = searchParams.get('bairro');
    const municipio = searchParams.get('municipio');
    const estado = searchParams.get('estado');

    if (!bairro || !municipio || !estado) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: bairro, municipio, estado' },
        { status: 400 }
      );
    }

    const enrichedData = await enrichNeighborhoodData(bairro, municipio, estado);

    if (!enrichedData) {
      return NextResponse.json(
        { error: 'Dados não encontrados' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enrichedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar dados enriquecidos:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
