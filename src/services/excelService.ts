import * as XLSX from 'xlsx'

export interface ExcelRow {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  telefone?: string
  bairro: string
  cep?: string
  cidade: string
  estado: string
  faturamento: Record<string, number>
}

/**
 * Parseia arquivo Excel do formato "ANALISE RJ"
 * Esperado: skiprows=5, coluna "Bairro" como chave
 */
export function parseExcelFile(buffer: Buffer): ExcelRow[] {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    
    // Converter para JSON (skiprows=5)
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
    
    // Encontrar linha de headers (linha 5, índice 5)
    const headerRowIndex = 5
    const headers = data[headerRowIndex] as string[]
    
    if (!headers) {
      throw new Error('Headers not found at row 5')
    }
    
    // Índices das colunas principais
    const cnpjIndex = headers.findIndex(h => h?.toLowerCase().includes('cnpj'))
    const razaoIndex = headers.findIndex(h => h?.toLowerCase().includes('razão'))
    const fantasyIndex = headers.findIndex(h => h?.toLowerCase().includes('fantasia'))
    const telefoneIndex = headers.findIndex(h => h?.toLowerCase().includes('telefone'))
    const bairroIndex = headers.findIndex(h => h?.toLowerCase().includes('bairro'))
    const cepIndex = headers.findIndex(h => h?.toLowerCase().includes('cep'))
    
    // Colunas de faturamento (datas)
    const faturamentoIndices = headers
      .map((h, i) => ({ index: i, header: h }))
      .filter(({ header }) => {
        if (!header) return false
        const str = header.toString()
        return /\d{4}-\d{2}-\d{2}/.test(str) || /\d{4}/.test(str)
      })
    
    const rows: ExcelRow[] = []
    
    // Processar linhas de dados (a partir da linha 6, índice 6)
    for (let i = headerRowIndex + 1; i < data.length; i++) {
      const row = data[i] as any[]
      
      if (!row[cnpjIndex]) continue // Pular linhas vazias
      
      const cnpj = String(row[cnpjIndex]).trim()
      const razaoSocial = String(row[razaoIndex] || '').trim()
      const nomeFantasia = String(row[fantasyIndex] || '').trim()
      const telefone = String(row[telefoneIndex] || '').trim()
      const bairro = String(row[bairroIndex] || '').trim()
      const cep = String(row[cepIndex] || '').trim()
      
      // Agregar faturamento por data
      const faturamento: Record<string, number> = {}
      for (const { index, header } of faturamentoIndices) {
        const valor = parseFloat(row[index])
        if (!isNaN(valor) && valor > 0) {
          faturamento[header] = valor
        }
      }
      
      rows.push({
        cnpj,
        razaoSocial,
        nomeFantasia: nomeFantasia || undefined,
        telefone: telefone || undefined,
        bairro,
        cep: cep || undefined,
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        faturamento,
      })
    }
    
    return rows
  } catch (error) {
    console.error('Error parsing Excel:', error)
    throw error
  }
}

/**
 * Normaliza nome de bairro (trim, uppercase, corrige duplicatas)
 */
export function normalizeBairro(bairro: string): string {
  return bairro
    .trim()
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/Á/g, 'A')
    .replace(/É/g, 'E')
    .replace(/Í/g, 'I')
    .replace(/Ó/g, 'O')
    .replace(/Ú/g, 'U')
    .replace(/Ã/g, 'A')
    .replace(/Õ/g, 'O')
    .replace(/Ç/g, 'C')
}

/**
 * Agrupa clientes por bairro
 */
export function groupByBairro(rows: ExcelRow[]): Record<string, ExcelRow[]> {
  const grouped: Record<string, ExcelRow[]> = {}
  
  for (const row of rows) {
    const bairro = normalizeBairro(row.bairro)
    if (!grouped[bairro]) {
      grouped[bairro] = []
    }
    grouped[bairro].push(row)
  }
  
  return grouped
}


