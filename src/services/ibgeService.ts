interface IBGEMunicipioData {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      UF: {
        id: number;
        nome: string;
        sigla: string;
      };
      regiao: {
        id: number;
        nome: string;
        sigla: string;
      };
    };
  };
}

interface MunicipalityData {
  id: number;
  nome: string;
  estado: string;
  microrregiao: string;
  mesorregiao: string;
  regiao: string;
  regiao_sigla: string;
  population?: number;
  density?: number;
  pibPerCapita?: number;
}

const IBGE_BASE_URL = 'https://servicodados.ibge.gov.br/api/v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

class IBGECache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

const cache = new IBGECache();

class IBGEService {
  async fetchMunicipalityData(ibgeCode: number): Promise<MunicipalityData | null> {
    const cacheKey = `ibge_municipality_${ibgeCode}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${IBGE_BASE_URL}/municipios/${ibgeCode}`
      );

      if (!response.ok) {
        throw new Error(`IBGE API error: ${response.status}`);
      }

      const data: IBGEMunicipioData = await response.json();

      const result: MunicipalityData = {
        id: data.id,
        nome: data.nome,
        estado: data.microrregiao.mesorregiao.UF.sigla,
        microrregiao: data.microrregiao.nome,
        mesorregiao: data.microrregiao.mesorregiao.nome,
        regiao: data.microrregiao.mesorregiao.regiao.nome,
        regiao_sigla: data.microrregiao.mesorregiao.regiao.sigla,
      };

      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar dados IBGE:', error);
      return null;
    }
  }

  async enrichMunicipalityData(data: MunicipalityData): Promise<MunicipalityData> {
    // Adicionar dados demográficos simulados (em produção, buscar de API real)
    return {
      ...data,
      population: Math.floor(Math.random() * 1000000) + 50000,
      density: Math.floor(Math.random() * 500) + 50,
      pibPerCapita: Math.floor(Math.random() * 50000) + 10000,
    };
  }

  async fetchAllMunicipalities(): Promise<IBGEMunicipioData[]> {
    const cacheKey = 'ibge_all_municipalities';
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${IBGE_BASE_URL}/municipios`
      );

      if (!response.ok) {
        throw new Error(`IBGE API error: ${response.status}`);
      }

      const data: IBGEMunicipioData[] = await response.json();
      cache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar municípios IBGE:', error);
      return [];
    }
  }

  async getIBGEData(city: string, state: string): Promise<MunicipalityData | null> {
    const cacheKey = `ibge_${city}_${state}`;
    const cached = cache.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${IBGE_BASE_URL}/municipios?q=${encodeURIComponent(city)}&uf=${state}`
      );

      if (!response.ok) {
        throw new Error(`IBGE API error: ${response.status}`);
      }

      const data: IBGEMunicipioData[] = await response.json();

      if (data.length === 0) {
        return null;
      }

      const municipio = data[0];

      const result: MunicipalityData = {
        id: municipio.id,
        nome: municipio.nome,
        estado: state,
        microrregiao: municipio.microrregiao.nome,
        mesorregiao: municipio.microrregiao.mesorregiao.nome,
        regiao: municipio.microrregiao.mesorregiao.regiao.nome,
        regiao_sigla: municipio.microrregiao.mesorregiao.regiao.sigla,
      };

      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Erro ao buscar dados IBGE:', error);
      return null;
    }
  }

  calculatePotential(
    population: number,
    gdpPerCapita: number,
    commercialRate: number = 0.15
  ): number {
    if (!population || !gdpPerCapita) return 0;
    return (population * gdpPerCapita * commercialRate) / 100;
  }

  calculateGap(potential: number, revenue: number) {
    if (!potential || potential === 0) return { percentage: 0, reais: 0 };

    const gapPercentage = ((potential - revenue) / potential) * 100;
    const gapReais = potential - revenue;

    return {
      percentage: Math.max(0, gapPercentage),
      reais: Math.max(0, gapReais),
    };
  }

  async fetchDemographicsForCities(
    municipalityIds: number[]
  ): Promise<Array<{
    id: number;
    name: string;
    state: string;
    population: number;
    density: number;
    pibPerCapita: number;
    potentialScore: number;
  }>> {
    const results = [];

    for (const id of municipalityIds) {
      try {
        const data = await this.fetchMunicipalityData(id);
        if (data) {
          const enriched = await this.enrichMunicipalityData(data);
          results.push({
            id: enriched.id,
            name: enriched.nome,
            state: enriched.estado,
            population: enriched.population || 0,
            density: enriched.density || 0,
            pibPerCapita: enriched.pibPerCapita || 0,
            potentialScore: this.calculatePotential(
              enriched.population || 0,
              enriched.pibPerCapita || 0
            ),
          });
        }
      } catch (error) {
        console.error(`Erro ao buscar dados para município ${id}:`, error);
      }
    }

    return results;
  }
}

export const ibgeService = new IBGEService();

// Exportar funções standalone para compatibilidade
export async function getIBGEData(city: string, state: string) {
  return ibgeService.getIBGEData(city, state);
}

export function calculatePotential(
  population: number,
  gdpPerCapita: number,
  commercialRate: number = 0.15
): number {
  return ibgeService.calculatePotential(population, gdpPerCapita, commercialRate);
}

export function calculateGap(potential: number, revenue: number) {
  return ibgeService.calculateGap(potential, revenue);
}
