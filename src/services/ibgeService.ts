import axios from 'axios'
import Decimal from 'decimal.js'

const IBGE_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1'

interface Municipality {
  id: number
  nome: string
  microrregiao: {
    id: number
    nome: string
    mesorregiao: {
      id: number
      nome: string
      UF: {
        id: number
        nome: string
        sigla: string
      }
    }
  }
}

interface DemographicData {
  ibgeCode: number
  cityName: string
  state: string
  region: string
  population: number
  areaKm2: number
  density: number
  pibTotal: number
  pibPerCapita: number
  incomePerCapita: number
  numCompanies: number
  commercialDensity: number
  potentialScore: number
}

class IBGEService {
  /**
   * Busca todos os municípios do Brasil
   */
  async fetchAllMunicipalities(): Promise<Municipality[]> {
    try {
      const response = await axios.get(`${IBGE_BASE_URL}/localidades/municipios`)
      return response.data
    } catch (error) {
      console.error('Erro ao buscar municípios:', error)
      throw error
    }
  }

  /**
   * Busca dados de um município específico
   */
  async fetchMunicipalityData(ibgeCode: number): Promise<Municipality | null> {
    try {
      const response = await axios.get(`${IBGE_BASE_URL}/localidades/municipios/${ibgeCode}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar município ${ibgeCode}:`, error)
      return null
    }
  }

  /**
   * Calcula score de potencial baseado em múltiplos fatores
   */
  calculatePotentialScore(data: Partial<DemographicData>): number {
    try {
      // Valores máximos para normalização (Brasil)
      const maxPopulation = 12000000 // São Paulo
      const maxPibPerCapita = 80000 // Regiões mais ricas
      const maxDensity = 8000 // Densidade máxima
      const maxCompanies = 500000 // Máximo de empresas

      const population = new Decimal(data.population || 0)
      const pibPerCapita = new Decimal(data.pibPerCapita || 0)
      const density = new Decimal(data.density || 0)
      const numCompanies = new Decimal(data.numCompanies || 0)

      const score = population
        .dividedBy(maxPopulation)
        .times(0.25)
        .plus(
          pibPerCapita
            .dividedBy(maxPibPerCapita)
            .times(0.25)
        )
        .plus(
          density
            .dividedBy(maxDensity)
            .times(0.20)
        )
        .plus(
          numCompanies
            .dividedBy(maxCompanies)
            .times(0.30)
        )
        .times(100)
        .toNumber()

      return Math.min(100, Math.max(0, score))
    } catch (error) {
      console.error('Erro ao calcular score de potencial:', error)
      return 0
    }
  }

  /**
   * Enriquece dados de um município com informações demográficas
   */
  async enrichMunicipalityData(municipality: Municipality): Promise<DemographicData | null> {
    try {
      const ibgeCode = municipality.id
      const cityName = municipality.nome
      const state = municipality.microrregiao.mesorregiao.UF.sigla
      const region = municipality.microrregiao.mesorregiao.nome

      // Dados simulados (em produção, buscar de APIs reais)
      // Para este MVP, usamos dados estimados baseados em padrões IBGE
      const population = Math.floor(Math.random() * 500000) + 10000
      const areaKm2 = Math.floor(Math.random() * 5000) + 100
      const density = population / areaKm2
      const pibPerCapita = Math.floor(Math.random() * 50000) + 15000
      const pibTotal = population * pibPerCapita
      const incomePerCapita = pibPerCapita * 0.7 // Renda é ~70% do PIB per capita
      const numCompanies = Math.floor(population / 50) // ~1 empresa a cada 50 pessoas
      const commercialDensity = numCompanies / areaKm2

      const demographicData: DemographicData = {
        ibgeCode,
        cityName,
        state,
        region,
        population,
        areaKm2,
        density: Math.round(density * 100) / 100,
        pibTotal: Math.round(pibTotal),
        pibPerCapita,
        incomePerCapita: Math.round(incomePerCapita),
        numCompanies,
        commercialDensity: Math.round(commercialDensity * 100) / 100,
        potentialScore: 0, // Será calculado abaixo
      }

      // Calcular score de potencial
      demographicData.potentialScore = this.calculatePotentialScore(demographicData)

      return demographicData
    } catch (error) {
      console.error('Erro ao enriquecer dados do município:', error)
      return null
    }
  }

  /**
   * Busca dados demográficos para múltiplos municípios
   */
  async fetchDemographicsForCities(ibgeCodes: number[]): Promise<DemographicData[]> {
    const results: DemographicData[] = []

    for (const code of ibgeCodes) {
      const municipality = await this.fetchMunicipalityData(code)
      if (municipality) {
        const enriched = await this.enrichMunicipalityData(municipality)
        if (enriched) {
          results.push(enriched)
        }
      }
    }

    return results
  }

  /**
   * Classifica potencial em categorias
   */
  classifyPotential(score: number): string {
    if (score >= 80) return 'Muito Alto'
    if (score >= 60) return 'Alto'
    if (score >= 40) return 'Médio'
    if (score >= 20) return 'Baixo'
    return 'Muito Baixo'
  }
}

export const ibgeService = new IBGEService()
