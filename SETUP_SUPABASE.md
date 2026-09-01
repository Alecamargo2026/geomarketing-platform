# 🚀 Setup Completo - GeoMarketing Platform com Supabase

## 📋 Índice
1. [Pré-requisitos](#pré-requisitos)
2. [Criar Projeto Supabase](#criar-projeto-supabase)
3. [Configurar Banco de Dados](#configurar-banco-de-dados)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Instalar Dependências](#instalar-dependências)
6. [Testar Localmente](#testar-localmente)
7. [Deploy no Vercel](#deploy-no-vercel)
8. [Checklist Final](#checklist-final)

---

## 🔧 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)
- Git instalado

---

## 🗄️ Criar Projeto Supabase

### Passo 1: Acessar Supabase
1. Vá para https://supabase.com
2. Clique em "Sign Up" ou faça login
3. Clique em "New Project"

### Passo 2: Configurar Projeto
- **Name**: `geomarketing-platform`
- **Database Password**: Crie uma senha forte (salve em local seguro!)
- **Region**: Escolha a região mais próxima (ex: `South America (São Paulo)`)
- Clique em "Create new project"

### Passo 3: Aguardar Criação
- Aguarde 2-3 minutos enquanto o projeto é criado
- Você será redirecionado para o dashboard

### Passo 4: Obter Chaves de API
1. No menu lateral, clique em **Settings** → **API**
2. Copie as seguintes chaves:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NUNCA compartilhe!)

**Exemplo:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Configurar Banco de Dados

### Passo 1: Acessar SQL Editor
1. No dashboard Supabase, clique em **SQL Editor** (menu lateral)
2. Clique em **New Query**

### Passo 2: Executar SQL Completo
Copie e cole TODO o SQL abaixo no editor:

```sql
-- ============================================
-- CRIAR EXTENSÕES
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: STATES (Estados Brasileiros)
-- ============================================
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  region VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: CITIES (Cidades)
-- ============================================
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code VARCHAR(2) NOT NULL REFERENCES states(code),
  name VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  population INTEGER,
  commercial_potential DECIMAL(15, 2),
  average_income DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(state_code, name)
);

-- ============================================
-- TABELA: NEIGHBORHOODS (Bairros)
-- ============================================
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  population INTEGER,
  average_income DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(city_id, name)
);

-- ============================================
-- TABELA: CUSTOMERS (Clientes)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  neighborhood_id UUID REFERENCES neighborhoods(id),
  city_id UUID NOT NULL REFERENCES cities(id),
  state_code VARCHAR(2) NOT NULL REFERENCES states(code),
  revenue DECIMAL(15, 2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'prospect',
  visit_frequency VARCHAR(50),
  last_visit TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: WHITE_ZONES (Zonas Brancas)
-- ============================================
CREATE TABLE IF NOT EXISTS white_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES cities(id),
  neighborhood_id UUID REFERENCES neighborhoods(id),
  market_potential DECIMAL(15, 2),
  priority_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: VISIT_PRIORITIES (Prioridades de Visita)
-- ============================================
CREATE TABLE IF NOT EXISTS visit_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  priority_level VARCHAR(20) NOT NULL,
  next_visit_date TIMESTAMP,
  visit_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- TABELA: IMPORT_LOGS (Histórico de Importações)
-- ============================================
CREATE TABLE IF NOT EXISTS import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  imported_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  errors TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================================
-- TABELA: USER_SETTINGS (Configurações do Usuário)
-- ============================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  company_email VARCHAR(255),
  phone VARCHAR(20),
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CRIAR ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_city_id ON customers(city_id);
CREATE INDEX idx_customers_state_code ON customers(state_code);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_neighborhoods_city_id ON neighborhoods(city_id);
CREATE INDEX idx_cities_state_code ON cities(state_code);
CREATE INDEX idx_white_zones_user_id ON white_zones(user_id);
CREATE INDEX idx_visit_priorities_user_id ON visit_priorities(user_id);
CREATE INDEX idx_import_logs_user_id ON import_logs(user_id);

-- ============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS: CUSTOMERS
-- ============================================
CREATE POLICY "Users can view their own customers"
ON customers FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers"
ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers"
ON customers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers"
ON customers FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: WHITE_ZONES
-- ============================================
CREATE POLICY "Users can view their own white zones"
ON white_zones FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own white zones"
ON white_zones FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own white zones"
ON white_zones FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own white zones"
ON white_zones FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: VISIT_PRIORITIES
-- ============================================
CREATE POLICY "Users can view their own priorities"
ON visit_priorities FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own priorities"
ON visit_priorities FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own priorities"
ON visit_priorities FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own priorities"
ON visit_priorities FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: IMPORT_LOGS
-- ============================================
CREATE POLICY "Users can view their own import logs"
ON import_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create import logs"
ON import_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS RLS: USER_SETTINGS
-- ============================================
CREATE POLICY "Users can view their own settings"
ON user_settings FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON user_settings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNÇÃO: UPDATE_UPDATED_AT_COLUMN
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: UPDATED_AT
-- ============================================
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER user_settings_updated_at BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POPULAR DADOS: ESTADOS BRASILEIROS
-- ============================================
INSERT INTO states (code, name, region) VALUES
('SP', 'São Paulo', 'Sudeste'),
('RJ', 'Rio de Janeiro', 'Sudeste'),
('MG', 'Minas Gerais', 'Sudeste'),
('BA', 'Bahia', 'Nordeste'),
('RS', 'Rio Grande do Sul', 'Sul'),
('SC', 'Santa Catarina', 'Sul'),
('PR', 'Paraná', 'Sul'),
('PE', 'Pernambuco', 'Nordeste'),
('CE', 'Ceará', 'Nordeste'),
('PA', 'Pará', 'Norte'),
('DF', 'Distrito Federal', 'Centro-Oeste'),
('GO', 'Goiás', 'Centro-Oeste'),
('MT', 'Mato Grosso', 'Centro-Oeste'),
('MS', 'Mato Grosso do Sul', 'Centro-Oeste'),
('ES', 'Espírito Santo', 'Sudeste'),
('RN', 'Rio Grande do Norte', 'Nordeste'),
('PI', 'Piauí', 'Nordeste'),
('AL', 'Alagoas', 'Nordeste'),
('SE', 'Sergipe', 'Nordeste'),
('AM', 'Amazonas', 'Norte'),
('RO', 'Rondônia', 'Norte'),
('AC', 'Acre', 'Norte'),
('AP', 'Amapá', 'Norte'),
('RR', 'Roraima', 'Norte'),
('TO', 'Tocantins', 'Norte')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- POPULAR DADOS: CIDADES PRINCIPAIS
-- ============================================
INSERT INTO cities (state_code, name, latitude, longitude, population, commercial_potential, average_income) VALUES
('SP', 'São Paulo', -23.5505, -46.6333, 12000000, 5000000.00, 4500.00),
('SP', 'Campinas', -22.9068, -47.0616, 1200000, 800000.00, 4200.00),
('RJ', 'Rio de Janeiro', -22.9068, -43.1729, 6800000, 2800000.00, 4200.00),
('RJ', 'Niterói', -22.8833, -43.1, 500000, 300000.00, 3900.00),
('MG', 'Belo Horizonte', -19.9167, -43.9345, 2700000, 1200000.00, 3800.00),
('BA', 'Salvador', -12.9714, -38.5014, 2900000, 1000000.00, 3200.00),
('RS', 'Porto Alegre', -30.0277, -51.2287, 1400000, 700000.00, 4100.00),
('SC', 'Florianópolis', -27.5969, -48.5495, 500000, 400000.00, 4300.00),
('PR', 'Curitiba', -25.4284, -49.2733, 1900000, 1000000.00, 4400.00),
('DF', 'Brasília', -15.8267, -47.8822, 3000000, 1500000.00, 5200.00)
ON CONFLICT (state_code, name) DO NOTHING;

-- ============================================
-- POPULAR DADOS: BAIRROS EXEMPLO (RJ)
-- ============================================
INSERT INTO neighborhoods (city_id, name, latitude, longitude, population, average_income) VALUES
((SELECT id FROM cities WHERE name = 'Rio de Janeiro' AND state_code = 'RJ'), 'Centro', -22.9068, -43.1729, 100000, 5000.00),
((SELECT id FROM cities WHERE name = 'Rio de Janeiro' AND state_code = 'RJ'), 'Copacabana', -22.9829, -43.1871, 150000, 5500.00),
((SELECT id FROM cities WHERE name = 'Rio de Janeiro' AND state_code = 'RJ'), 'Ipanema', -22.9870, -43.2033, 100000, 6000.00),
((SELECT id FROM cities WHERE name = 'Rio de Janeiro' AND state_code = 'RJ'), 'Leblon', -22.9971, -43.2256, 120000, 6500.00),
((SELECT id FROM cities WHERE name = 'Rio de Janeiro' AND state_code = 'RJ'), 'Barra da Tijuca', -23.0155, -43.3667, 200000, 5200.00),
((SELECT id FROM cities WHERE name = 'Niterói' AND state_code = 'RJ'), 'Centro', -22.8833, -43.1, 80000, 4500.00)
ON CONFLICT (city_id, name) DO NOTHING;
```

### Passo 3: Executar SQL
1. Clique em **Run** (botão azul no canto superior direito)
2. Aguarde a execução (deve levar 10-30 segundos)
3. Você verá uma mensagem de sucesso: "Query executed successfully"

### Passo 4: Verificar Tabelas
1. No menu lateral, clique em **Table Editor**
2. Você deve ver as 8 tabelas criadas:
   - `states`
   - `cities`
   - `neighborhoods`
   - `customers`
   - `white_zones`
   - `visit_priorities`
   - `import_logs`
   - `user_settings`

---

## 🔐 Variáveis de Ambiente

### Passo 1: Criar Arquivo `.env.local`
Na raiz do projeto (`C:\Users\user\geomarketing-platform\`), crie um arquivo chamado `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyzabc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (para autenticação local)
JWT_SECRET=seu-secret-key-super-seguro-aqui

# Ambiente
NODE_ENV=development
```

### Passo 2: Substituir Valores
Copie as chaves do Supabase (obtidas no passo anterior) e substitua:
- `NEXT_PUBLIC_SUPABASE_URL` → URL do seu projeto
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Chave anon public
- `SUPABASE_SERVICE_ROLE_KEY` → Chave service_role (⚠️ NUNCA compartilhe!)
- `JWT_SECRET` → Crie uma string aleatória forte

### ⚠️ IMPORTANTE
- **NUNCA** commit `.env.local` no Git
- **NUNCA** compartilhe `SUPABASE_SERVICE_ROLE_KEY`
- O arquivo `.gitignore` já está configurado para ignorar `.env.local`

---

## 📦 Instalar Dependências

```bash
cd C:\Users\user\geomarketing-platform
npm install
```

Dependências principais já instaladas:
- `@supabase/supabase-js` - Cliente Supabase
- `leaflet` + `react-leaflet` - Mapas interativos
- `recharts` - Gráficos
- `xlsx` - Importação de Excel
- `tailwindcss` - Estilos

---

## 🧪 Testar Localmente

### Passo 1: Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

Você verá:
```
> next dev
  ▲ Next.js 14.2.35
  - Local:        http://localhost:3000
```

### Passo 2: Acessar Aplicação
Abra no navegador: **http://localhost:3000**

### Passo 3: Testar Funcionalidades
- ✅ Página inicial carrega
- ✅ Clique em "Dashboard" (pode pedir login)
- ✅ Clique em "Mapa" (mostra mapa interativo)
- ✅ Clique em "Importar" (upload de arquivos)

### Passo 4: Verificar Logs
No terminal, você verá logs de requisições:
```
GET /api/customers 200 in 123ms
POST /api/import/upload 201 in 456ms
```

---

## 🚀 Deploy no Vercel

### Passo 1: Fazer Push no GitHub
```bash
cd C:\Users\user\geomarketing-platform
git add .
git commit -m "feat: setup completo com Supabase"
git push origin main
```

### Passo 2: Conectar ao Vercel
1. Vá para https://vercel.com
2. Clique em "New Project"
3. Selecione seu repositório GitHub
4. Clique em "Import"

### Passo 3: Configurar Variáveis de Ambiente
1. Na página de configuração do Vercel, vá para **Environment Variables**
2. Adicione as mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`

### Passo 4: Deploy
1. Clique em **Deploy**
2. Aguarde 2-3 minutos
3. Você receberá uma URL: `https://seu-projeto.vercel.app`

### Passo 5: Testar em Produção
Acesse a URL e teste todas as funcionalidades

---

## ✅ Checklist Final

### Banco de Dados
- [ ] Projeto Supabase criado
- [ ] SQL executado com sucesso
- [ ] 8 tabelas visíveis no Table Editor
- [ ] Dados seed populados (25 estados, 10 cidades, 6 bairros)
- [ ] RLS policies ativas

### Ambiente Local
- [ ] `.env.local` criado com todas as variáveis
- [ ] `npm install` executado
- [ ] `npm run dev` funciona
- [ ] http://localhost:3000 abre sem erros
- [ ] Build local passa: `npm run build` (exit code 0)

### Funcionalidades
- [ ] Dashboard carrega dados reais do Supabase
- [ ] Mapa interativo funciona
- [ ] Importação de arquivos funciona
- [ ] Autenticação funciona (login/registro)
- [ ] APIs retornam dados corretos

### Deploy
- [ ] Repositório GitHub atualizado
- [ ] Projeto criado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] URL de produção funciona

---

## 🆘 Troubleshooting

### Erro: "supabaseUrl is required"
**Solução**: Verifique se `.env.local` existe e tem `NEXT_PUBLIC_SUPABASE_URL`

### Erro: "Unauthorized" nas APIs
**Solução**: Verifique se `SUPABASE_SERVICE_ROLE_KEY` está correto

### Erro: "CNPJ already exists"
**Solução**: Cada cliente deve ter um CNPJ único. Verifique dados de importação

### Mapa não carrega
**Solução**: Verifique se Leaflet está instalado: `npm list leaflet`

### Build falha no Vercel
**Solução**: Verifique se todas as variáveis de ambiente estão configuradas no painel do Vercel

---

## 📞 Suporte

- **Documentação Supabase**: https://supabase.com/docs
- **Documentação Next.js**: https://nextjs.org/docs
- **Documentação Leaflet**: https://leafletjs.com/
- **Documentação Vercel**: https://vercel.com/docs

---

## 🎉 Pronto!

Seu sistema de GeoMarketing está 100% funcional com:
- ✅ Banco de dados real (Supabase PostgreSQL)
- ✅ Autenticação real (Supabase Auth)
- ✅ APIs reais (Next.js + Supabase)
- ✅ Mapa interativo (Leaflet)
- ✅ Importação de dados (XLSX/CSV)
- ✅ Deploy em produção (Vercel)

**Próximos passos:**
1. Importar seus dados reais via página de importação
2. Configurar filtros e análises
3. Compartilhar URL com sua equipe
4. Monitorar performance e ajustar conforme necessário
