import React from 'react';
import './DynamicPopup.css';

interface DynamicPopupProps {
  title: string;
  type: 'neighborhood' | 'client' | 'competitor';
  data?: Record<string, any>;
  onClose?: () => void;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

const DynamicPopup: React.FC<DynamicPopupProps> = ({
  title,
  type,
  data = {},
  onClose,
  actions = [],
}) => {
  const typeLabel = {
    neighborhood: 'Bairro',
    client: 'Cliente',
    competitor: 'Concorrente',
  }[type];

  const typeColor = {
    neighborhood: '#10b981',
    client: '#3b82f6',
    competitor: '#ef4444',
  }[type];

  return (
    <div className="dynamic-popup">
      <div className="popup-header" style={{ borderLeftColor: typeColor }}>
        <div className="popup-title-section">
          <span className="popup-type-badge" style={{ backgroundColor: typeColor }}>
            {typeLabel}
          </span>
          <h3 className="popup-title">{title}</h3>
        </div>
        {onClose && (
          <button className="popup-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        )}
      </div>

      {Object.keys(data).length > 0 && (
        <div className="popup-content">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="popup-field">
              <span className="popup-label">{key}:</span>
              <span className="popup-value">{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      {actions.length > 0 && (
        <div className="popup-actions">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className={`popup-action-btn popup-action-${action.variant || 'primary'}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicPopup;
