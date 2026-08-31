import { NextRequest, NextResponse } from 'next/server'
import { ibgeService } from '@/services/ibgeService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const state = searchParams.get('state')
    const minPotential = searchParams.get('minPotential')
    const maxPotential = searchParams.get('maxPotential')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Buscar todos os municípios
    const municipalities = await ibgeService.fetchAllMunicipalities()

    // Enriquecer com dados demográficos (primeiros 50 para demo)
    const demographicsData = await ibgeService.fetchDemographicsForCities(
      municipalities.slice(0, 50).map((m) => m.id)
    )

    // Aplicar filtros
    let filtered = demographicsData

    if (state) {
      filtered = filtered.filter((d) => d.state === state.toUpperCase())
    }

    if (minPotential) {
      const min = parseFloat(minPotential)
      filtered = filtered.filter((d) => d.potentialScore >= min)
    }

    if (maxPotential) {
      const max = parseFloat(maxPotential)
      filtered = filtered.filter((d) => d.potentialScore <= max)
    }

    // Ordenar por potencial (decrescente)
    filtered.sort((a, b) => b.potentialScore - a.potentialScore)

    // Aplicar paginação
    const total = filtered.length
    const paginated = filtered.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar dados demográficos:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar dados demográficos' },
      { status: 500 }
    )
  }
}
