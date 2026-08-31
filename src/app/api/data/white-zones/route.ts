import { NextResponse } from 'next/server';
import { identifyWhiteZones } from '@/services/geoDataService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');

    if (!estado) {
      return NextResponse.json(
        { error: 'Parâmetro obrigatório: estado' },
        { status: 400 }
      );
    }

    const whiteZones = await identifyWhiteZones(estado);

    return NextResponse.json({
      success: true,
      data: whiteZones,
      count: whiteZones.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao identificar zonas brancas:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
