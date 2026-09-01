'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import Supercluster from 'supercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Customer {
  id: string;
  razaoSocial: string;
  cnpj: string;
  latitude: number;
  longitude: number;
  status: string;
  cidade: string;
  estado: string;
  representante?: string;
  revenue?: number;
}

interface ClusterPoint {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    customerId: string;
    name: string;
    status: string;
    cnpj: string;
    cidade: string;
    estado: string;
    representante?: string;
    revenue?: number;
  };
}

interface Cluster {
  id: number | string;
  type: 'cluster' | 'point';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    cluster?: boolean;
    cluster_id?: number;
    point_count?: number;
    point_count_abbreviated?: string;
    customerId?: string;
    name?: string;
    status?: string;
    cnpj?: string;
    cidade?: string;
    estado?: string;
    representante?: string;
    revenue?: number;
  };
}

interface HeatmapProps {
  customers: Customer[];
  onCustomerClick?: (customer: Customer) => void;
}

const statusColors: Record<string, string> = {
  ativo: '#22c55e',
  inativo: '#ef4444',
  prospect: '#f97316',
  default: '#9ca3af',
};

function MapContent({ customers, onCustomerClick }: HeatmapProps) {
  const map = useMap();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [visibleStatuses, setVisibleStatuses] = useState({
    ativo: true,
    inativo: true,
    prospect: true,
    default: true,
  });
  const superclusterRef = useRef<Supercluster<ClusterPoint['properties']> | null>(null);

  useEffect(() => {
    if (!customers.length) return;

    // Criar instância Supercluster
    const index = new Supercluster({
      radius: 40,
      maxZoom: 16,
    });

    // Transformar clientes para formato Supercluster
    const points: ClusterPoint[] = customers
      .filter((c) => c.latitude && c.longitude)
      .map((c) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [c.longitude, c.latitude],
        },
        properties: {
          customerId: c.id,
          name: c.razaoSocial,
          status: c.status || 'default',
          cnpj: c.cnpj,
          cidade: c.cidade,
          estado: c.estado,
          representante: c.representante,
          revenue: c.revenue,
        },
      }));

    index.load(points);
    superclusterRef.current = index;

    // Atualizar clusters ao carregar
    updateClusters();

    // Listener para zoom/move
    const handleZoomEnd = () => updateClusters();
    const handleMoveEnd = () => updateClusters();

    map.on('zoomend', handleZoomEnd);
    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('zoomend', handleZoomEnd);
      map.off('moveend', handleMoveEnd);
    };
  }, [customers, map]);

  const updateClusters = () => {
    if (!superclusterRef.current) return;

    const bounds = map.getBounds();
    const zoom = map.getZoom();

    const clusters = superclusterRef.current.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

    setClusters(clusters);
  };

  const handleClusterClick = (cluster: Cluster) => {
    if (!superclusterRef.current) return;

    const expansionZoom = superclusterRef.current.getClusterExpansionZoom(
      cluster.properties.cluster_id!
    );

    const [lng, lat] = cluster.geometry.coordinates;
    map.flyTo([lat, lng], expansionZoom, { duration: 0.6 });
  };

  const filteredClusters = clusters.filter((cluster) => {
    if (cluster.properties.cluster) return true;
    const status = cluster.properties.status || 'default';
    return visibleStatuses[status as keyof typeof visibleStatuses];
  });

  return (
    <>
      {/* Legenda */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[400] max-w-xs">
        <h3 className="font-bold text-sm mb-3">Filtros</h3>
        <div className="space-y-2">
          {Object.entries(statusColors).map(([status, color]) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleStatuses[status as keyof typeof visibleStatuses]}
                onChange={(e) =>
                  setVisibleStatuses((prev) => ({
                    ...prev,
                    [status]: e.target.checked,
                  }))
                }
                className="w-4 h-4"
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm capitalize">{status}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Marcadores */}
      {filteredClusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;

        if (cluster.properties.cluster) {
          const size = cluster.properties.point_count || 0;
          const radius = Math.min(30, 15 + Math.sqrt(size) * 5);

          return (
            <CircleMarker
              key={`cluster-${cluster.properties.cluster_id}`}
              center={[lat, lng]}
              radius={radius}
              fillColor="#3b82f6"
              color="#1e40af"
              weight={2}
              opacity={0.8}
              fillOpacity={0.7}
              eventHandlers={{
                click: () => handleClusterClick(cluster),
              }}
            >
              <Popup>
                <div className="text-center">
                  <div className="font-bold">{cluster.properties.point_count} clientes</div>
                  <button
                    onClick={() => handleClusterClick(cluster)}
                    className="text-blue-600 text-sm mt-2 hover:underline"
                  >
                    Zoom para cluster
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        }

        const status = cluster.properties.status || 'default';
        const color = statusColors[status];

        return (
          <CircleMarker
            key={`point-${cluster.properties.customerId}`}
            center={[lat, lng]}
            radius={6}
            fillColor={color}
            color={color}
            weight={2}
            opacity={1}
            fillOpacity={0.8}
            eventHandlers={{
              click: () => {
                if (onCustomerClick) {
                  const customer = customers.find(
                    (c) => c.id === cluster.properties.customerId
                  );
                  if (customer) onCustomerClick(customer);
                }
              },
            }}
          >
            <Popup>
              <div className="w-64">
                <div className="font-bold text-sm">{cluster.properties.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  <div>CNPJ: {cluster.properties.cnpj}</div>
                  <div>Cidade: {cluster.properties.cidade}, {cluster.properties.estado}</div>
                  {cluster.properties.representante && (
                    <div>Representante: {cluster.properties.representante}</div>
                  )}
                  {cluster.properties.revenue && (
                    <div>Faturamento: R$ {cluster.properties.revenue.toLocaleString('pt-BR')}</div>
                  )}
                </div>
                <div className="mt-2">
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: color }}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export function HeatmapInteractive({ customers, onCustomerClick }: HeatmapProps) {
  const [center, setCenter] = useState<[number, number]>([-15.8, -48.0]); // Centro do Brasil

  useEffect(() => {
    if (customers.length > 0) {
      const lats = customers
        .filter((c) => c.latitude)
        .map((c) => c.latitude);
      const lngs = customers
        .filter((c) => c.longitude)
        .map((c) => c.longitude);

      if (lats.length > 0 && lngs.length > 0) {
        const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        setCenter([avgLat, avgLng]);
      }
    }
  }, [customers]);

  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: '600px', width: '100%' }}
      className="rounded-lg shadow-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapContent customers={customers} onCustomerClick={onCustomerClick} />
    </MapContainer>
  );
}
