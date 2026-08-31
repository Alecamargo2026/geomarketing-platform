import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DetailsPanel.css';

interface DetailsPanelProps {
  title: string;
  type: 'neighborhood' | 'client' | 'competitor';
  data?: Record<string, any>;
  stats?: Array<{
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  chartData?: any[];
  onClose?: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  title,
  type,
  data = {},
  stats = [],
  chartData = [],
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'analysis' | 'competitors'>('overview');

  const typeColor = {
    neighborhood: '#10b981',
    client: '#3b82f6',
    competitor: '#ef4444',
  }[type];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="details-panel">
      <div className="panel-header" style={{ borderBottomColor: typeColor }}>
        <h2 className="panel-title">{title}</h2>
        {onClose && (
          <button className="panel-close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="panel-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`tab-btn ${activeTab === 'clients' ? 'active' : ''}`}
          onClick={() => setActiveTab('clients')}
        >
          Clientes
        </button>
        <button
          className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Análise
        </button>
        <button
          className={`tab-btn ${activeTab === 'competitors' ? 'active' : ''}`}
          onClick={() => setActiveTab('competitors')}
        >
          Concorrentes
        </button>
      </div>

      {/* Content */}
      <div className="panel-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            {/* Stats */}
            {stats.length > 0 && (
              <div className="stats-grid">
                {stats.map((stat, idx) => (
                  <div key={idx} className="stat-card">
                    <span className="stat-label">{stat.label}</span>
                    <span className="stat-value">{stat.value}</span>
                    {stat.trend && (
                      <span className={`stat-trend trend-${stat.trend}`}>
                        {stat.trend === 'up' ? '↑' : stat.trend === 'down' ? '↓' : '→'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Data Fields */}
            {Object.keys(data).length > 0 && (
              <div className="data-fields">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="data-field">
                    <span className="field-label">{key}:</span>
                    <span className="field-value">{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="tab-content">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="empty-state">Nenhum dado de clientes disponível</p>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="tab-content">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="empty-state">Nenhum dado de análise disponível</p>
            )}
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="tab-content">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="empty-state">Nenhum dado de concorrentes disponível</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPanel;
