/**
 * Serviço de integração com OpenCNPJ
 * Fornece dados de empresas brasileiras
 */

interface CompanyData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  segmento: string;
  porte: 'Microempresa' | 'Pequena' | 'Média' | 'Grande';
  dataAbertura: string;
  situacao: 'Ativa' | 'Inativa' | 'Suspensa';
  municipio: string;
  estado: string;
  cep: string;
  endereco: string;
  telefone?: string;
  email?: string;
}

/**
 * Buscar dados de empresa por CNPJ
 */
export const fetchCompanyByCNPJ = async (cnpj: string): Promise<CompanyData | null> => {
  try {
    // Remover formatação do CNPJ
    const cleanCNPJ = cnpj.replace(/\D/g, '');

    // Usar API OpenCNPJ (gratuita, sem autenticação)
    const response = await fetch(
      `https://www.receitaws.com.br/v1/cnpj/${cleanCNPJ}`
    );

    if (!response.ok) {
      throw new Error('Empresa não encontrada');
    }

    const data = await response.json();

    return {
      cnpj: data.cnpj,
      razaoSocial: data.nome,
      nomeFantasia: data.fantasia || data.nome,
      segmento: data.atividade_principal?.[0]?.text || 'Não informado',
      porte: classifyCompanySize(data.qsa?.length || 1),
      dataAbertura: data.abertura,
      situacao: data.status === 'OK' ? 'Ativa' : 'Inativa',
      municipio: data.municipio,
      estado: data.uf,
      cep: data.cep,
      endereco: `${data.logradouro}, ${data.numero}`,
      telefone: data.telefone,
      email: data.email,
    };
  } catch (error) {
    console.error('Erro ao buscar empresa no OpenCNPJ:', error);
    return null;
  }
};

/**
 * Buscar empresas por município
 */
export const fetchCompaniesByCity = async (
  municipio: string,
  estado: string
): Promise<CompanyData[]> => {
  try {
    // Simulando dados de empresas por município
    // Em produção, isso viria de uma API ou banco de dados
    const mockCompanies: Record<string, CompanyData[]> = {
      'Rio de Janeiro-RJ': [
        {
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Decorações RJ LTDA',
          nomeFantasia: 'Decorações RJ',
          segmento: 'Comércio de artigos de decoração',
          porte: 'Pequena',
          dataAbertura: '2015-03-15',
          situacao: 'Ativa',
          municipio: 'Rio de Janeiro',
          estado: 'RJ',
          cep: '20000-000',
          endereco: 'Rua A, 100',
          telefone: '(21) 3333-3333',
          email: 'contato@decoracoesrj.com.br',
        },
        {
          cnpj: '98.765.432/0001-12',
          razaoSocial: 'Flores e Plantas LTDA',
          nomeFantasia: 'Flores Brasil',
          segmento: 'Comércio de flores e plantas',
          porte: 'Microempresa',
          dataAbertura: '2018-06-20',
          situacao: 'Ativa',
          municipio: 'Rio de Janeiro',
          estado: 'RJ',
          cep: '20100-000',
          endereco: 'Avenida B, 250',
          telefone: '(21) 2222-2222',
          email: 'vendas@floresbrasil.com.br',
        },
      ],
      'Niterói-RJ': [
        {
          cnpj: '55.555.555/0001-55',
          razaoSocial: 'Utilidades Domésticas Niterói',
          nomeFantasia: 'Utilidades Niterói',
          segmento: 'Comércio de artigos de uso doméstico',
          porte: 'Pequena',
          dataAbertura: '2016-09-10',
          situacao: 'Ativa',
          municipio: 'Niterói',
          estado: 'RJ',
          cep: '24000-000',
          endereco: 'Rua C, 500',
          telefone: '(21) 4444-4444',
          email: 'contato@utilidadesniteroi.com.br',
        },
      ],
    };

    const key = `${municipio}-${estado}`;
    return mockCompanies[key] || [];
  } catch (error) {
    console.error('Erro ao buscar empresas por município:', error);
    return [];
  }
};

/**
 * Classificar tamanho da empresa
 */
function classifyCompanySize(
  numPartners: number
): 'Microempresa' | 'Pequena' | 'Média' | 'Grande' {
  if (numPartners === 1) return 'Microempresa';
  if (numPartners <= 5) return 'Pequena';
  if (numPartners <= 20) return 'Média';
  return 'Grande';
}

/**
 * Buscar segmentos econômicos de um município
 */
export const fetchEconomicSegments = async (
  municipio: string,
  estado: string
): Promise<Array<{ segmento: string; quantidade: number }>> => {
  try {
    const companies = await fetchCompaniesByCity(municipio, estado);

    const segments: Record<string, number> = {};
    companies.forEach((company) => {
      segments[company.segmento] = (segments[company.segmento] || 0) + 1;
    });

    return Object.entries(segments).map(([segmento, quantidade]) => ({
      segmento,
      quantidade,
    }));
  } catch (error) {
    console.error('Erro ao buscar segmentos econômicos:', error);
    return [];
  }
};
