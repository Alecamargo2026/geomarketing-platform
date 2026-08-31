import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import './DynamicGeoMap.css';

interface MapData {
  id: string;
  name: string;
  type: 'neighborhood' | 'client' | 'competitor';
  lat: number;
  lng: number;
  data: Record<string, any>;
}

interface DynamicGeoMapProps {
  data?: MapData[];
  onMarkerClick?: (marker: MapData) => void;
  zoom?: number;
  center?: [number, number];
}

const DynamicGeoMap: React.FC<DynamicGeoMapProps> = ({
  data = [],
  onMarkerClick,
  zoom = 4,
  center = [-14.2350, -51.9253], // Centro do Brasil
}) => {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const map = useMap();

  const handleZoomChange = useCallback(() => {
    if (map) {
      setCurrentZoom(map.getZoom());
    }
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on('zoomend', handleZoomChange);
      return () => {
        map.off('zoomend', handleZoomChange);
      };
    }
    return undefined;
  }, [map, handleZoomChange]);

  // Criar ícones customizados
  const createIcon = (type: 'neighborhood' | 'client' | 'competitor') => {
    const colors = {
      neighborhood: '#10b981',
      client: '#3b82f6',
      competitor: '#ef4444',
    };

    return L.divIcon({
      className: `map-marker-icon ${type}`,
      html: `<div style="background-color: ${colors[type]}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <div className="dynamic-geo-map">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="map-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Renderizar marcadores */}
        {data.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createIcon(item.type)}
            eventHandlers={{
              click: () => onMarkerClick?.(item),
            }}
          >
            <Popup>
              <div className="marker-popup">
                <strong>{item.name}</strong>
                <p>Tipo: {item.type}</p>
                {item.data && (
                  <div className="marker-data">
                    {Object.entries(item.data).map(([key, value]) => (
                      <p key={key}>
                        <small>
                          {key}: {String(value)}
                        </small>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Info do zoom */}
      <div className="map-info">
        <span>Zoom: {currentZoom}</span>
        <span>Pontos: {data.length}</span>
      </div>
    </div>
  );
};

export default DynamicGeoMap;
