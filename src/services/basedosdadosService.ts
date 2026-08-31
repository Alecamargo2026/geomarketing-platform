/**
 * Serviço de integração com Base dos Dados
 * Fornece dados de renda, potencial comercial e infraestrutura
 */

interface IncomeData {
  municipio: string;
  estado: string;
  rendaMedia: number;
  rendaMedianiana: number;
  percentualPobreza: number;
  percentualExtremaPobreza: number;
  giniIndex: number;
}

interface InfrastructureData {
  municipio: string;
  estado: string;
  numHospitais: number;
  numEscolas: number;
  numUniversidades: number;
  numAgencias: number;
  numShoppings: number;
  indiceDesenvolvimento: number;
}

interface CommercialPotentialData {
  municipio: string;
  estado: string;
  potencialComercial: number;
  potencialTurismo: number;
  potencialAgricultura: number;
  potencialIndustria: number;
  potencialServicos: number;
}

/**
 * Buscar dados de renda de um município
 */
export const fetchIncomeData = async (
  municipio: string,
  estado: string
): Promise<IncomeData | null> => {
  try {
    // Simulando dados de renda (em produção, viria da Base dos Dados)
    const mockIncomeData: Record<string, IncomeData> = {
      'Rio de Janeiro-RJ': {
        municipio: 'Rio de Janeiro',
        estado: 'RJ',
        rendaMedia: 3500,
        rendaMedianiana: 2800,
        percentualPobreza: 18.5,
        percentualExtremaPobreza: 5.2,
        giniIndex: 0.58,
      },
      'Niterói-RJ': {
        municipio: 'Niterói',
        estado: 'RJ',
        rendaMedia: 4200,
        rendaMedianiana: 3400,
        percentualPobreza: 12.3,
        percentualExtremaPobreza: 2.8,
        giniIndex: 0.52,
      },
      'Duque de Caxias-RJ': {
        municipio: 'Duque de Caxias',
        estado: 'RJ',
        rendaMedia: 2800,
        rendaMedianiana: 2200,
        percentualPobreza: 28.5,
        percentualExtremaPobreza: 8.5,
        giniIndex: 0.62,
      },
      'São Gonçalo-RJ': {
        municipio: 'São Gonçalo',
        estado: 'RJ',
        rendaMedia: 2600,
        rendaMedianiana: 2000,
        percentualPobreza: 32.1,
        percentualExtremaPobreza: 10.2,
        giniIndex: 0.64,
      },
    };

    const key = `${municipio}-${estado}`;
    return mockIncomeData[key] || null;
  } catch (error) {
    console.error('Erro ao buscar dados de renda:', error);
    return null;
  }
};

/**
 * Buscar dados de infraestrutura de um município
 */
export const fetchInfrastructureData = async (
  municipio: string,
  estado: string
): Promise<InfrastructureData | null> => {
  try {
    // Simulando dados de infraestrutura
    const mockInfrastructure: Record<string, InfrastructureData> = {
      'Rio de Janeiro-RJ': {
        municipio: 'Rio de Janeiro',
        estado: 'RJ',
        numHospitais: 85,
        numEscolas: 2500,
        numUniversidades: 45,
        numAgencias: 1200,
        numShoppings: 35,
        indiceDesenvolvimento: 0.82,
      },
      'Niterói-RJ': {
        municipio: 'Niterói',
        estado: 'RJ',
        numHospitais: 12,
        numEscolas: 350,
        numUniversidades: 8,
        numAgencias: 150,
        numShoppings: 5,
        indiceDesenvolvimento: 0.78,
      },
      'Duque de Caxias-RJ': {
        municipio: 'Duque de Caxias',
        estado: 'RJ',
        numHospitais: 18,
        numEscolas: 450,
        numUniversidades: 5,
        numAgencias: 180,
        numShoppings: 3,
        indiceDesenvolvimento: 0.72,
      },
      'São Gonçalo-RJ': {
        municipio: 'São Gonçalo',
        estado: 'RJ',
        numHospitais: 15,
        numEscolas: 400,
        numUniversidades: 4,
        numAgencias: 160,
        numShoppings: 2,
        indiceDesenvolvimento: 0.70,
      },
    };

    const key = `${municipio}-${estado}`;
    return mockInfrastructure[key] || null;
  } catch (error) {
    console.error('Erro ao buscar dados de infraestrutura:', error);
    return null;
  }
};

/**
 * Buscar potencial comercial de um município
 */
export const fetchCommercialPotential = async (
  municipio: string,
  estado: string
): Promise<CommercialPotentialData | null> => {
  try {
    // Simulando dados de potencial comercial
    const mockPotential: Record<string, CommercialPotentialData> = {
      'Rio de Janeiro-RJ': {
        municipio: 'Rio de Janeiro',
        estado: 'RJ',
        potencialComercial: 95,
        potencialTurismo: 98,
        potencialAgricultura: 15,
        potencialIndustria: 70,
        potencialServicos: 92,
      },
      'Niterói-RJ': {
        municipio: 'Niterói',
        estado: 'RJ',
        potencialComercial: 85,
        potencialTurismo: 80,
        potencialAgricultura: 10,
        potencialIndustria: 60,
        potencialServicos: 88,
      },
      'Duque de Caxias-RJ': {
        municipio: 'Duque de Caxias',
        estado: 'RJ',
        potencialComercial: 72,
        potencialTurismo: 35,
        potencialAgricultura: 20,
        potencialIndustria: 85,
        potencialServicos: 70,
      },
      'São Gonçalo-RJ': {
        municipio: 'São Gonçalo',
        estado: 'RJ',
        potencialComercial: 68,
        potencialTurismo: 30,
        potencialAgricultura: 25,
        potencialIndustria: 75,
        potencialServicos: 65,
      },
    };

    const key = `${municipio}-${estado}`;
    return mockPotential[key] || null;
  } catch (error) {
    console.error('Erro ao buscar potencial comercial:', error);
    return null;
  }
};

/**
 * Calcular score de potencial combinado
 */
export const calculateCombinedPotentialScore = async (
  municipio: string,
  estado: string
): Promise<number> => {
  try {
    const income = await fetchIncomeData(municipio, estado);
    const infrastructure = await fetchInfrastructureData(municipio, estado);
    const commercial = await fetchCommercialPotential(municipio, estado);

    if (!income || !infrastructure || !commercial) {
      return 0;
    }

    // Calcular score ponderado
    const incomeScore = Math.min(100, (income.rendaMedia / 5000) * 100);
    const infrastructureScore = infrastructure.indiceDesenvolvimento * 100;
    const commercialScore =
      (commercial.potencialComercial +
        commercial.potencialServicos +
        commercial.potencialIndustria) /
      3;

    // Ponderação: 30% renda, 30% infraestrutura, 40% potencial comercial
    const combinedScore =
      incomeScore * 0.3 + infrastructureScore * 0.3 + commercialScore * 0.4;

    return Math.min(100, Math.max(0, combinedScore));
  } catch (error) {
    console.error('Erro ao calcular score de potencial combinado:', error);
    return 0;
  }
};
