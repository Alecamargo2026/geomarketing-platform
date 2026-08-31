-- ============================================================================
-- FASE 1: ESTRUTURA DE DADOS COM POSTGIS
-- ============================================================================
-- Tabelas para suportar geomarketing dinâmico com dados reais
-- ============================================================================

-- 1. TABELA: geo_neighborhoods (Bairros com Metadados Completos)
-- ============================================================================

CREATE TABLE IF NOT EXISTS geo_neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Identificação
  name VARCHAR(255) NOT NULL,
  city_id UUID,
  city_name VARCHAR(255),
  state VARCHAR(2) NOT NULL,
  
  -- Geoespacial (PostGIS)
  geometry GEOMETRY(Polygon, 4326),
  centroid GEOMETRY(Point, 4326),
  area_km2 DECIMAL(10, 2),
  
  -- Demográficos (IBGE)
  population INT,
  population_density DECIMAL(10, 2),
  urbanization_rate DECIMAL(5, 2),
  age_distribution JSONB, -- { "0-14": 20, "15-64": 65, "65+": 15 }
  
  -- Econômicos
  gdp_total DECIMAL(15, 2),
  gdp_per_capita DECIMAL(10, 2),
  income_per_capita DECIMAL(10, 2),
  purchasing_power DECIMAL(15, 2),
  unemployment_rate DECIMAL(5, 2),
  
  -- Comercial
  commercial_establishments INT,
  commercial_density DECIMAL(10, 2), -- estabelecimentos/km²
  saturation_index DECIMAL(5, 2), -- 0-100
  
  -- Concorrentes
  competitor_count INT DEFAULT 0,
  competitor_data JSONB, -- [{ name, type, distance, rating }]
  
  -- Infraestrutura
  infrastructure JSONB, -- { "hospitals": 5, "schools": 12, "transport": "metro" }
  
  -- Vendas e Cobertura
  total_clients INT DEFAULT 0,
  total_revenue DECIMAL(15, 2) DEFAULT 0,
  coverage_percentage DECIMAL(5, 2) DEFAULT 0,
  potential_market DECIMAL(15, 2) DEFAULT 0,
  uncovered_potential DECIMAL(15, 2) DEFAULT 0,
  
  -- Metadados
  data_source VARCHAR(100), -- "IBGE", "OpenCNPJ", "Base dos Dados", "Manual"
  last_updated TIMESTAMP,
  confidence_score DECIMAL(3, 2), -- 0-1
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tenant_id, name, city_name, state)
);

-- Índices para geo_neighborhoods
CREATE INDEX IF NOT EXISTS idx_geo_neighborhoods_tenant ON geo_neighborhoods(tenant_id);
CREATE INDEX IF NOT EXISTS idx_geo_neighborhoods_geometry ON geo_neighborhoods USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_geo_neighborhoods_centroid ON geo_neighborhoods USING GIST(centroid);
CREATE INDEX IF NOT EXISTS idx_geo_neighborhoods_city ON geo_neighborhoods(city_name, state);
CREATE INDEX IF NOT EXISTS idx_geo_neighborhoods_state ON geo_neighborhoods(state);
CREATE INDEX IF NOT EXISTS idx_geo_neighborhoods_coverage ON geo_neighborhoods(coverage_percentage DESC);
CREATE INDEX IF NOT EXISTS idx_geo_neighborhoods_potential ON geo_neighborhoods(potential_market DESC);

-- ============================================================================
-- 2. TABELA: customer_locations (Clientes com Geolocalização)
-- ============================================================================

CREATE TABLE IF NOT EXISTS customer_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  neighborhood_id UUID REFERENCES geo_neighborhoods(id) ON DELETE SET NULL,
  
  -- Localização
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geometry GEOMETRY(Point, 4326),
  address VARCHAR(500),
  
  -- Dados Comerciais
  revenue_total DECIMAL(15, 2) DEFAULT 0,
  revenue_ytd DECIMAL(15, 2) DEFAULT 0,
  last_purchase_date DATE,
  purchase_frequency VARCHAR(50), -- "Semanal", "Mensal", "Bimestral"
  
  -- Metadados
  visit_count INT DEFAULT 0,
  days_since_visit INT,
  priority_score DECIMAL(5, 2) DEFAULT 0, -- 0-100
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para customer_locations
CREATE INDEX IF NOT EXISTS idx_customer_locations_tenant ON customer_locations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customer_locations_geometry ON customer_locations USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_customer_locations_neighborhood ON customer_locations(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_customer_locations_customer ON customer_locations(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_locations_priority ON customer_locations(priority_score DESC);

-- ============================================================================
-- 3. TABELA: geo_metadata (Metadados Estruturados)
-- ============================================================================

CREATE TABLE IF NOT EXISTS geo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Entidade
  entity_type VARCHAR(50), -- "neighborhood", "city", "state"
  entity_id UUID NOT NULL,
  
  -- Metadados Estruturados (JSON flexível)
  metadata JSONB,
  
  -- Rastreamento
  source VARCHAR(100), -- "IBGE", "OpenCNPJ", "Base dos Dados", "Manual"
  confidence_score DECIMAL(3, 2),
  last_verified TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para geo_metadata
CREATE INDEX IF NOT EXISTS idx_geo_metadata_tenant ON geo_metadata(tenant_id);
CREATE INDEX IF NOT EXISTS idx_geo_metadata_entity ON geo_metadata(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_geo_metadata_source ON geo_metadata(source);

-- ============================================================================
-- 4. TABELA: geo_competitors (Dados de Concorrentes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS geo_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  neighborhood_id UUID NOT NULL REFERENCES geo_neighborhoods(id) ON DELETE CASCADE,
  
  -- Identificação
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18),
  type VARCHAR(100), -- "Varejo", "Distribuidor", "Fabricante"
  
  -- Localização
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geometry GEOMETRY(Point, 4326),
  address VARCHAR(500),
  
  -- Dados
  distance_km DECIMAL(10, 2),
  rating DECIMAL(3, 2), -- 0-5
  market_share DECIMAL(5, 2), -- 0-100
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para geo_competitors
CREATE INDEX IF NOT EXISTS idx_geo_competitors_tenant ON geo_competitors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_geo_competitors_neighborhood ON geo_competitors(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_geo_competitors_geometry ON geo_competitors USING GIST(geometry);

-- ============================================================================
-- 5. TABELA: geo_sync_log (Log de Sincronizações)
-- ============================================================================

CREATE TABLE IF NOT EXISTS geo_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Sincronização
  sync_type VARCHAR(50), -- "IBGE", "OpenCNPJ", "Base dos Dados"
  status VARCHAR(20), -- "pending", "running", "success", "error"
  
  -- Dados
  records_processed INT DEFAULT 0,
  records_updated INT DEFAULT 0,
  records_failed INT DEFAULT 0,
  error_message TEXT,
  
  -- Timing
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_seconds INT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para geo_sync_log
CREATE INDEX IF NOT EXISTS idx_geo_sync_log_tenant ON geo_sync_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_geo_sync_log_type ON geo_sync_log(sync_type);
CREATE INDEX IF NOT EXISTS idx_geo_sync_log_status ON geo_sync_log(status);
CREATE INDEX IF NOT EXISTS idx_geo_sync_log_created ON geo_sync_log(created_at DESC);

-- ============================================================================
-- 6. FUNÇÃO: Atualizar centroide de bairro
-- ============================================================================

CREATE OR REPLACE FUNCTION update_neighborhood_centroid()
RETURNS TRIGGER AS $$
BEGIN
  NEW.centroid = ST_Centroid(NEW.geometry);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_neighborhood_centroid
BEFORE INSERT OR UPDATE ON geo_neighborhoods
FOR EACH ROW
EXECUTE FUNCTION update_neighborhood_centroid();

-- ============================================================================
-- 7. FUNÇÃO: Atualizar neighborhood_id em customer_locations
-- ============================================================================

CREATE OR REPLACE FUNCTION update_customer_neighborhood()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.geometry IS NOT NULL THEN
    NEW.neighborhood_id = (
      SELECT id FROM geo_neighborhoods
      WHERE tenant_id = NEW.tenant_id
      AND ST_Contains(geometry, NEW.geometry)
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_customer_neighborhood
BEFORE INSERT OR UPDATE ON customer_locations
FOR EACH ROW
EXECUTE FUNCTION update_customer_neighborhood();

-- ============================================================================
-- 8. FUNÇÃO: Recalcular estatísticas de bairro
-- ============================================================================

CREATE OR REPLACE FUNCTION recalculate_neighborhood_stats(p_neighborhood_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE geo_neighborhoods
  SET
    total_clients = (
      SELECT COUNT(*) FROM customer_locations
      WHERE neighborhood_id = p_neighborhood_id
    ),
    total_revenue = (
      SELECT COALESCE(SUM(revenue_total), 0) FROM customer_locations
      WHERE neighborhood_id = p_neighborhood_id
    ),
    coverage_percentage = (
      CASE
        WHEN potential_market > 0 THEN
          (COALESCE((SELECT SUM(revenue_total) FROM customer_locations WHERE neighborhood_id = p_neighborhood_id), 0) / potential_market) * 100
        ELSE 0
      END
    ),
    uncovered_potential = potential_market - COALESCE((SELECT SUM(revenue_total) FROM customer_locations WHERE neighborhood_id = p_neighborhood_id), 0),
    updated_at = NOW()
  WHERE id = p_neighborhood_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. TRIGGER: Atualizar estatísticas ao inserir/atualizar customer_locations
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_update_neighborhood_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.neighborhood_id IS NOT NULL THEN
    PERFORM recalculate_neighborhood_stats(NEW.neighborhood_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_customer_locations_stats
AFTER INSERT OR UPDATE ON customer_locations
FOR EACH ROW
EXECUTE FUNCTION trigger_update_neighborhood_stats();

-- ============================================================================
-- 10. VIEW: Dados Agregados por Bairro (para Dashboard)
-- ============================================================================

CREATE OR REPLACE VIEW v_neighborhood_summary AS
SELECT
  gn.id,
  gn.tenant_id,
  gn.name,
  gn.city_name,
  gn.state,
  gn.centroid,
  gn.population,
  gn.population_density,
  gn.gdp_per_capita,
  gn.income_per_capita,
  gn.commercial_establishments,
  gn.commercial_density,
  gn.saturation_index,
  gn.competitor_count,
  gn.total_clients,
  gn.total_revenue,
  gn.coverage_percentage,
  gn.potential_market,
  gn.uncovered_potential,
  gn.last_updated,
  gn.confidence_score,
  
  -- Clientes
  COUNT(DISTINCT cl.id) as client_count,
  COALESCE(SUM(cl.revenue_total), 0) as total_revenue_calc,
  AVG(cl.priority_score) as avg_priority_score,
  
  -- Concorrentes
  COUNT(DISTINCT gc.id) as competitor_count_calc,
  
  -- Metadados
  gn.updated_at
FROM
  geo_neighborhoods gn
LEFT JOIN customer_locations cl ON gn.id = cl.neighborhood_id
LEFT JOIN geo_competitors gc ON gn.id = gc.neighborhood_id
GROUP BY
  gn.id, gn.tenant_id, gn.name, gn.city_name, gn.state, gn.centroid,
  gn.population, gn.population_density, gn.gdp_per_capita, gn.income_per_capita,
  gn.commercial_establishments, gn.commercial_density, gn.saturation_index,
  gn.competitor_count, gn.total_clients, gn.total_revenue, gn.coverage_percentage,
  gn.potential_market, gn.uncovered_potential, gn.last_updated, gn.confidence_score,
  gn.updated_at;

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON TABLE geo_neighborhoods IS 'Bairros com metadados demográficos, econômicos e comerciais';
COMMENT ON TABLE customer_locations IS 'Localização de clientes com dados de vendas e prioridade';
COMMENT ON TABLE geo_metadata IS 'Metadados estruturados para entidades geográficas';
COMMENT ON TABLE geo_competitors IS 'Dados de concorrentes por bairro';
COMMENT ON TABLE geo_sync_log IS 'Log de sincronizações com APIs externas';

-- ============================================================================
-- FIM DA MIGRAÇÃO
-- ============================================================================
