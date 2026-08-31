import { useState, useCallback } from 'react';

interface MapData {
  id: string;
  name: string;
  type: 'neighborhood' | 'client' | 'competitor';
  lat: number;
  lng: number;
  data: Record<string, any>;
}

export const useMapData = () => {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do mapa
  const loadMapData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [neighborhoodsRes, clientsRes, competitorsRes] = await Promise.all([
        fetch('/api/map/neighborhoods'),
        fetch('/api/map/clients'),
        fetch('/api/map/competitors'),
      ]);

      if (!neighborhoodsRes.ok || !clientsRes.ok || !competitorsRes.ok) {
        throw new Error('Erro ao carregar dados do mapa');
      }

      const neighborhoodsData = await neighborhoodsRes.json();
      const clientsData = await clientsRes.json();
      const competitorsData = await competitorsRes.json();

      setNeighborhoods(neighborhoodsData.data || []);
      setClients(clientsData.data || []);
      setCompetitors(competitorsData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Combinar todos os dados para o mapa
  const getAllMapData = useCallback((): MapData[] => {
    const allData: MapData[] = [];

    neighborhoods.forEach((n) => {
      allData.push({
        id: n.id,
        name: n.name,
        type: 'neighborhood',
        lat: n.lat,
        lng: n.lng,
        data: {
          Cidade: n.city,
          Estado: n.state,
          Clientes: n.clients,
          Faturamento: `R$ ${n.revenue.toLocaleString('pt-BR')}`,
          Cobertura: `${n.coverage}%`,
          Potencial: `R$ ${n.potential.toLocaleString('pt-BR')}`,
          Concorrentes: n.competitors,
        },
      });
    });

    clients.forEach((c) => {
      allData.push({
        id: c.id,
        name: c.name,
        type: 'client',
        lat: c.lat,
        lng: c.lng,
        data: {
          CNPJ: c.cnpj,
          Cidade: c.city,
          Bairro: c.neighborhood,
          Faturamento: `R$ ${c.revenue.toLocaleString('pt-BR')}`,
          'Última Compra': c.lastPurchase,
          Frequência: c.frequency,
          Prioridade: c.priority,
        },
      });
    });

    competitors.forEach((comp) => {
      allData.push({
        id: comp.id,
        name: comp.name,
        type: 'competitor',
        lat: comp.lat,
        lng: comp.lng,
        data: {
          Cidade: comp.city,
          Bairro: comp.neighborhood,
          'Market Share': `${comp.marketShare}%`,
          Presença: comp.presence,
        },
      });
    });

    return allData;
  }, [neighborhoods, clients, competitors]);

  // Filtrar dados por tipo
  const filterByType = useCallback(
    (type: 'neighborhood' | 'client' | 'competitor') => {
      const allData = getAllMapData();
      return allData.filter((item) => item.type === type);
    },
    [getAllMapData]
  );

  // Filtrar dados por região
  const filterByRegion = useCallback(
    (state: string) => {
      const allData = getAllMapData();
      return allData.filter((item) => {
        const itemState = item.data.Estado || item.data.state;
        return itemState === state;
      });
    },
    [getAllMapData]
  );

  // Buscar por nome
  const searchByName = useCallback(
    (query: string) => {
      const allData = getAllMapData();
      const lowerQuery = query.toLowerCase();
      return allData.filter((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      );
    },
    [getAllMapData]
  );

  return {
    neighborhoods,
    clients,
    competitors,
    loading,
    error,
    loadMapData,
    getAllMapData,
    filterByType,
    filterByRegion,
    searchByName,
  };
};
