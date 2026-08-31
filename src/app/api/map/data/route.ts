import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams
    const tenantId = searchParams.get('tenantId') as string
    const state = searchParams.get('state') || 'RJ'
    const city = searchParams.get('city') || 'Rio de Janeiro'
    const period = searchParams.get('period') // formato: "2026-01"

    if (!tenantId) {
      return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })
    }

    // Buscar clientes por estado/cidade
    const customers = await prisma.customer.findMany({
      where: {
        tenantId,
        estado: state,
        cidade: city,
      },
      include: {
        sales: {
          where: period
            ? {
                dataEmissao: {
                  gte: new Date(`${period}-01`),
                  lt: new Date(`${period.split('-')[0]}-${String(parseInt(period.split('-')[1]) + 1).padStart(2, '0')}-01`),
                },
              }
            : undefined,
        },
      },
    })

    // Agrupar por bairro
    const neighborhoodMap: Record<
      string,
      {
        name: string
        latitude: number
        longitude: number
        clients: typeof customers
        totalRevenue: number
        clientCount: number
      }
    > = {}

    for (const customer of customers) {
      const bairro = customer.bairro || 'Desconhecido'

      if (!neighborhoodMap[bairro]) {
        neighborhoodMap[bairro] = {
          name: bairro,
          latitude: customer.latitude || -22.90,
          longitude: customer.longitude || -43.20,
          clients: [],
          totalRevenue: 0,
          clientCount: 0,
        }
      }

      const revenue = customer.sales.reduce((sum, sale) => sum + sale.valorTotal, 0)
      neighborhoodMap[bairro].clients.push(customer)
      neighborhoodMap[bairro].totalRevenue += revenue
      neighborhoodMap[bairro].clientCount += 1
    }

    // Converter para array e calcular métricas
    const neighborhoods = Object.values(neighborhoodMap).map(neighborhood => {
      // Calcular potencial (simulado: baseado em população IBGE)
      const potentialMultiplier = 1.5 // Assumir que potencial é 1.5x do faturamento atual
      const potential = neighborhood.totalRevenue * potentialMultiplier
      const uncoveredPotential = potential - neighborhood.totalRevenue
      const coverage = neighborhood.totalRevenue > 0 ? (neighborhood.totalRevenue / potential) * 100 : 0

      return {
        name: neighborhood.name,
        latitude: neighborhood.latitude,
        longitude: neighborhood.longitude,
        clients: neighborhood.clientCount,
        revenue: neighborhood.totalRevenue,
        coverage: Math.min(coverage, 100),
        potential,
        uncoveredPotential,
        competitors: Math.floor(Math.random() * 5), // Simulado
        commercialDensity: neighborhood.clientCount / 5, // Simulado
        clients_list: neighborhood.clients.map(c => ({
          id: c.id,
          cnpj: c.cnpj,
          name: c.nomeFantasia || c.razaoSocial,
          razaoSocial: c.razaoSocial,
          revenue: c.sales.reduce((sum, s) => sum + s.valorTotal, 0),
          lastPurchase: c.sales.length > 0 ? c.sales[c.sales.length - 1].dataEmissao.toISOString().split('T')[0] : 'N/A',
          frequency: c.sales.length > 0 ? 'Mensal' : 'Sem vendas',
          phone: c.telefone,
        })),
      }
    })

    // Calcular resumo geral
    const summary = {
      totalClients: customers.length,
      totalRevenue: neighborhoods.reduce((sum, n) => sum + n.revenue, 0),
      averageCoverage: neighborhoods.length > 0 ? neighborhoods.reduce((sum, n) => sum + n.coverage, 0) / neighborhoods.length : 0,
      uncoveredPotential: neighborhoods.reduce((sum, n) => sum + n.uncoveredPotential, 0),
      neighborhoods: neighborhoods.length,
    }

    return NextResponse.json({
      neighborhoods: neighborhoods.sort((a, b) => b.revenue - a.revenue),
      summary,
    })
  } catch (error) {
    console.error('Map data error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch map data' },
      { status: 500 }
    )
  }
}
