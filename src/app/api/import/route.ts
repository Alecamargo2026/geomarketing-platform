import { NextRequest, NextResponse } from 'next/server'
import { parseExcelFile, groupByBairro, normalizeBairro } from '@/services/excelService'
import { batchGeocode } from '@/services/geocodingService'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const brandId = formData.get('brandId') as string
    const tenantId = formData.get('tenantId') as string

    if (!file || !brandId || !tenantId) {
      return NextResponse.json(
        { error: 'Missing file, brandId, or tenantId' },
        { status: 400 }
      )
    }

    // Converter arquivo para buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parsear Excel
    const rows = parseExcelFile(buffer)
    console.log(`Parsed ${rows.length} rows from Excel`)

    // Agrupar por bairro
    const grouped = groupByBairro(rows)
    const bairros = Object.keys(grouped)
    console.log(`Found ${bairros.length} neighborhoods`)

    // Geocodificar bairros
    console.log('Geocoding neighborhoods...')
    const coords = await batchGeocode(bairros)

    // Importar clientes e vendas
    let importedCount = 0
    const errors: string[] = []

    for (const row of rows) {
      try {
        const bairroNormalizado = normalizeBairro(row.bairro)
        const { latitude, longitude } = coords[row.bairro] || { latitude: -22.90, longitude: -43.20 }

        // Criar ou atualizar cliente
        const customer = await prisma.customer.upsert({
          where: {
            tenantId_cnpj_brandId: {
              tenantId,
              cnpj: row.cnpj,
              brandId,
            },
          },
          update: {
            razaoSocial: row.razaoSocial,
            nomeFantasia: row.nomeFantasia,
            telefone: row.telefone,
            bairro: bairroNormalizado,
            cep: row.cep,
            cidade: row.cidade,
            estado: row.estado,
            latitude,
            longitude,
          },
          create: {
            tenantId,
            cnpj: row.cnpj,
            razaoSocial: row.razaoSocial,
            nomeFantasia: row.nomeFantasia,
            telefone: row.telefone,
            bairro: bairroNormalizado,
            cep: row.cep,
            cidade: row.cidade,
            estado: row.estado,
            latitude,
            longitude,
            brandId,
            status: 'ativo',
          },
        })

        // Criar vendas
        for (const [month, valor] of Object.entries(row.faturamento)) {
          // Parsear data (formato: "2025-09-01 00:00:00" ou "2025-09")
          let dataEmissao: Date
          try {
            if (month.includes('-')) {
              const parts = month.split('-')
              if (parts.length >= 2) {
                dataEmissao = new Date(`${parts[0]}-${parts[1]}-01`)
              } else {
                dataEmissao = new Date(month)
              }
            } else {
              dataEmissao = new Date(month)
            }
          } catch {
            dataEmissao = new Date()
          }

          // Verificar se venda já existe
          const existingSale = await prisma.sale.findFirst({
            where: {
              customerId: customer.id,
              brandId,
              dataEmissao: {
                gte: new Date(dataEmissao.getFullYear(), dataEmissao.getMonth(), 1),
                lt: new Date(dataEmissao.getFullYear(), dataEmissao.getMonth() + 1, 1),
              },
            },
          })

          if (!existingSale) {
            await prisma.sale.create({
              data: {
                tenantId,
                customerId: customer.id,
                brandId,
                dataEmissao,
                valorTotal: valor,
              },
            })
          }
        }

        importedCount++
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error)
        errors.push(`${row.cnpj}: ${errorMsg}`)
        console.error(`Error importing ${row.cnpj}:`, error)
      }
    }

    // Calcular estatísticas
    const totalRevenue = rows.reduce((sum, row) => {
      return sum + Object.values(row.faturamento).reduce((a, b) => a + b, 0)
    }, 0)

    return NextResponse.json({
      success: true,
      imported: importedCount,
      total: rows.length,
      errors,
      neighborhoods: bairros,
      totalRevenue,
      message: `Imported ${importedCount} customers from ${bairros.length} neighborhoods`,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    )
  }
}
