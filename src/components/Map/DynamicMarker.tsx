import React from 'react';
import './DynamicMarker.css';

interface DynamicMarkerProps {
  id: string;
  name: string;
  type: 'neighborhood' | 'client' | 'competitor';
  lat: number;
  lng: number;
  data?: Record<string, any>;
  onClick?: () => void;
  isSelected?: boolean;
}

const DynamicMarker: React.FC<DynamicMarkerProps> = ({
  name,
  type,
  onClick,
  isSelected = false,
}) => {
  const markerColor =
    type === 'client' ? '#3b82f6' : type === 'competitor' ? '#ef4444' : '#10b981';

  return (
    <div
      className={`dynamic-marker ${type} ${isSelected ? 'selected' : ''}`}
      style={{ backgroundColor: markerColor }}
      onClick={onClick}
      title={name}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div className="marker-inner" />
      {isSelected && <div className="marker-pulse" />}
    </div>
  );
};

export default DynamicMarker;
