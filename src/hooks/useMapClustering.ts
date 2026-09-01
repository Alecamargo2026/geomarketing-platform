'use client';

import { useEffect, useState, useCallback } from 'react';
import Supercluster from 'supercluster';

export interface ClusterPoint {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  status: 'ativo' | 'inativo' | 'prospect';
  revenue?: number;
}

export interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  points: ClusterPoint[];
  isCluster: boolean;
}

export function useMapClustering(points: ClusterPoint[], zoom: number) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [supercluster, setSupercluster] = useState<Supercluster<ClusterPoint, any> | null>(null);

  // Inicializar Supercluster
  useEffect(() => {
    const index = new Supercluster({
      radius: 40,
      maxZoom: 16,
      minZoom: 0,
    });

    const formattedPoints = points.map((point) => ({
      type: 'Feature' as const,
      properties: point,
      geometry: {
        type: 'Point' as const,
        coordinates: [point.longitude, point.latitude],
      },
    }));

    index.load(formattedPoints);
    setSupercluster(index);
  }, [points]);

  // Calcular clusters baseado no zoom
  useEffect(() => {
    if (!supercluster) return;

    const bounds = [-180, -85, 180, 85]; // Mundo inteiro
    const clusterData = supercluster.getClusters(bounds, zoom);

    const formattedClusters: Cluster[] = clusterData.map((item: any) => {
      if (item.properties.cluster) {
        // É um cluster
        const clusterId = item.properties.cluster_id;
        const clusterPoints = supercluster.getLeaves(clusterId);

        return {
          id: `cluster_${clusterId}`,
          latitude: item.geometry.coordinates[1],
          longitude: item.geometry.coordinates[0],
          count: item.properties.point_count,
          points: clusterPoints.map((p: any) => p.properties),
          isCluster: true,
        };
      } else {
        // É um ponto individual
        return {
          id: item.properties.id,
          latitude: item.geometry.coordinates[1],
          longitude: item.geometry.coordinates[0],
          count: 1,
          points: [item.properties],
          isCluster: false,
        };
      }
    });

    setClusters(formattedClusters);
  }, [supercluster, zoom]);

  const getClusterColor = useCallback((cluster: Cluster) => {
    if (!cluster.isCluster) {
      const point = cluster.points[0];
      switch (point.status) {
        case 'ativo':
          return '#10b981'; // Verde
        case 'inativo':
          return '#ef4444'; // Vermelho
        case 'prospect':
          return '#f59e0b'; // Laranja
        default:
          return '#9ca3af'; // Cinza
      }
    }

    // Para clusters, usar cor baseada na quantidade
    if (cluster.count > 100) return '#dc2626'; // Vermelho escuro
    if (cluster.count > 50) return '#f97316'; // Laranja
    if (cluster.count > 10) return '#eab308'; // Amarelo
    return '#84cc16'; // Verde claro
  }, []);

  return {
    clusters,
    getClusterColor,
  };
}
