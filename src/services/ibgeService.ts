interface IBGEMunicipioData {
  id: number;
  nome: string;
  microrregiao: {
    id: number;
    nome: string;
    mesorregiao: {
      id: number;
      nome: string;
      regiao: {
        id: number;
        nome: string;
        sigla: string;
      };
    };
  };
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

export async function getIBGEData(city: string, state: string) {
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

    const result = {
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

export function calculatePotential(
  population: number,
  gdpPerCapita: number,
  commercialRate: number = 0.15
): number {
  if (!population || !gdpPerCapita) return 0;
  return (population * gdpPerCapita * commercialRate) / 100;
}

export function calculateGap(potential: number, revenue: number) {
  if (!potential || potential === 0) return { percentage: 0, reais: 0 };

  const gapPercentage = ((potential - revenue) / potential) * 100;
  const gapReais = potential - revenue;

  return {
    percentage: Math.max(0, gapPercentage),
    reais: Math.max(0, gapReais),
  };
}
