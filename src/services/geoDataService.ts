/**
 * Serviço consolidado de dados geográficos e comerciais
 * Integra IBGE, OpenCNPJ, Base dos Dados e Geocodificação
 */

import { ibgeService } from './ibgeService';
import { fetchCompaniesByCity } from './opencnpjService';
import {
  fetchIncomeData,
  fetchInfrastructureData,
  fetchCommercialPotential,
  calculateCombinedPotentialScore,
} from './basedosdadosService';
import { geocodeBairro } from './geocodingService';

export interface EnrichedNeighborhoodData {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  population: number;
  density: number;
  pibPerCapita: number;
  rendaMedia: number;
  numCompanies: number;
  numHospitals: number;
  numSchools: number;
  commercialPotential: number;
  potentialScore: number;
  classification: 'Zona Branca Crítica' | 'Zona Branca Moderada' | 'Zona Madura' | 'Zona Saturada';
}

/**
 * Enriquecer dados de um bairro com informações de múltiplas fontes
 */
export const enrichNeighborhoodData = async (
  bairro: string,
  municipio: string,
  estado: string
): Promise<EnrichedNeighborhoodData | null> => {
  try {
    // 1. Geocodificar bairro
    const coords = await geocodeBairro(bairro, municipio, estado);

    // 2. Buscar dados do IBGE
    const ibgeMunicipality = await ibgeService.fetchMunicipalityData(
      getIBGECodeForCity(municipio, estado)
    );

    if (!ibgeMunicipality) {
      return null;
    }

    const demographicData = await ibgeService.enrichMunicipalityData(ibgeMunicipality);

    // 3. Buscar dados de renda (Base dos Dados)
    const incomeData = await fetchIncomeData(municipio, estado);

    // 4. Buscar dados de infraestrutura (Base dos Dados)
    const infrastructureData = await fetchInfrastructureData(municipio, estado);

    // 5. Buscar potencial comercial (Base dos Dados)
    const commercialData = await fetchCommercialPotential(municipio, estado);

    // 6. Buscar empresas (OpenCNPJ)
    const companies = await fetchCompaniesByCity(municipio, estado);

    // 7. Calcular score de potencial combinado
    const potentialScore = await calculateCombinedPotentialScore(municipio, estado);

    // 8. Classificar zona
    const classification = classifyZone(
      potentialScore,
      companies.length,
      demographicData?.population || 0
    );

    return {
      id: `${bairro}-${municipio}-${estado}`,
      name: bairro,
      city: municipio,
      state: estado,
      lat: coords.latitude,
      lng: coords.longitude,
      population: demographicData?.population || 0,
      density: demographicData?.density || 0,
      pibPerCapita: demographicData?.pibPerCapita || 0,
      rendaMedia: incomeData?.rendaMedia || 0,
      numCompanies: companies.length,
      numHospitals: infrastructureData?.numHospitais || 0,
      numSchools: infrastructureData?.numEscolas || 0,
      commercialPotential: commercialData?.potencialComercial || 0,
      potentialScore,
      classification,
    };
  } catch (error) {
    console.error('Erro ao enriquecer dados do bairro:', error);
    return null;
  }
};

/**
 * Classificar zona baseado em potencial e cobertura
 */
function classifyZone(
  potentialScore: number,
  numCompanies: number,
  population: number
): 'Zona Branca Crítica' | 'Zona Branca Moderada' | 'Zona Madura' | 'Zona Saturada' {
  const coverage = numCompanies / (population / 1000); // Empresas por 1000 habitantes

  if (potentialScore >= 70 && coverage < 0.5) {
    return 'Zona Branca Crítica';
  }

  if (potentialScore >= 50 && coverage < 1.0) {
    return 'Zona Branca Moderada';
  }

  if (coverage >= 2.0) {
    return 'Zona Saturada';
  }

  return 'Zona Madura';
}

/**
 * Obter código IBGE para uma cidade
 */
function getIBGECodeForCity(municipio: string, estado: string): number {
  // Mapeamento de cidades para códigos IBGE
  const ibgeCodes: Record<string, number> = {
    'Rio de Janeiro-RJ': 3304557,
    'Niterói-RJ': 3303302,
    'Duque de Caxias-RJ': 3304144,
    'São Gonçalo-RJ': 3304201,
  };

  return ibgeCodes[`${municipio}-${estado}`] || 0;
}

/**
 * Enriquecer múltiplos bairros em batch
 */
export const enrichMultipleNeighborhoods = async (
  neighborhoods: Array<{ bairro: string; municipio: string; estado: string }>
): Promise<EnrichedNeighborhoodData[]> => {
  const results: EnrichedNeighborhoodData[] = [];

  for (const neighborhood of neighborhoods) {
    try {
      const enriched = await enrichNeighborhoodData(
        neighborhood.bairro,
        neighborhood.municipio,
        neighborhood.estado
      );

      if (enriched) {
        results.push(enriched);
      }

      // Rate limit: 500ms entre requisições
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(
        `Erro ao enriquecer ${neighborhood.bairro}:`,
        error
      );
    }
  }

  return results;
};

/**
 * Identificar zonas brancas em um estado
 */
export const identifyWhiteZones = async (
  estado: string
): Promise<EnrichedNeighborhoodData[]> => {
  try {
    // Buscar todos os municípios do estado
    const municipalities = await ibgeService.fetchAllMunicipalities();
    const stateMunicipalities = municipalities.filter(
      (m) => m.microrregiao.mesorregiao.UF.sigla === estado
    );

    // Enriquecer dados de cada município
    const enrichedData: EnrichedNeighborhoodData[] = [];

    for (const municipality of stateMunicipalities.slice(0, 10)) {
      // Limitar a 10 para não sobrecarregar
      const enriched = await enrichNeighborhoodData(
        'Centro', // Usar bairro padrão
        municipality.nome,
        estado
      );

      if (enriched) {
        enrichedData.push(enriched);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Filtrar apenas zonas brancas
    return enrichedData.filter(
      (d) =>
        d.classification === 'Zona Branca Crítica' ||
        d.classification === 'Zona Branca Moderada'
    );
  } catch (error) {
    console.error('Erro ao identificar zonas brancas:', error);
    return [];
  }
};
