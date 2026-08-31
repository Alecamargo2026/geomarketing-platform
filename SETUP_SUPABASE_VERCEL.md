# 🚀 GUIA COMPLETO: SETUP SUPABASE + VERCEL

**Data:** 31/08/2026  
**Objetivo:** Montar a plataforma com autenticação em produção

---

## PASSO 1: CRIAR PROJETO NO SUPABASE

### 1.1 Acessar Supabase

1. Vá para [supabase.com](https://supabase.com)
2. Clique em "Sign Up" (ou faça login se já tem conta)
3. Use email ou GitHub para criar conta

### 1.2 Criar Novo Projeto

1. Clique em "New Project"
2. Preencha os dados:
   - **Organization:** (deixe padrão ou crie uma)
   - **Project Name:** `geomarketing-platform`
   - **Database Password:** (gere uma senha forte, ex: `Abc123!@#XyZ`)
   - **Region:** Escolha a mais próxima (ex: `South America (São Paulo)`)
   - **Pricing Plan:** `Free` (para começar)

3. Clique em "Create new project"
4. Aguarde 2-3 minutos enquanto o projeto é criado

### 1.3 Obter Credenciais

1. Quando o projeto estiver pronto, vá para **Settings** → **API**
2. Copie e guarde:
   - **Project URL** (ex: `https://abcdefgh.supabase.co`)
   - **anon public** (chave pública)
   - **service_role secret** (chave privada - não compartilhe!)

---

## PASSO 2: CRIAR TABELAS NO SUPABASE

### 2.1 Acessar SQL Editor

1. No Supabase, vá para **SQL Editor**
2. Clique em "New Query"

### 2.2 Executar SQL

Cole e execute este SQL para criar as tabelas:

```sql
-- Criar tabela de tenants (empresas)
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  website TEXT,
  logo TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de usuários
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  active BOOLEAN DEFAULT TRUE,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar tabela de marcas
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  color TEXT,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- Criar tabela de clientes
CREATE TABLE customers (
  id TEXT PRIMARY KEY,
  cnpj TEXT NOT NULL,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cep TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  representante TEXT,
  segmento TEXT,
  canal TEXT,
  status TEXT DEFAULT 'ativo',
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, cnpj, brand_id)
);

-- Criar tabela de vendas
CREATE TABLE sales (
  id TEXT PRIMARY KEY,
  data_emissao TIMESTAMP NOT NULL,
  valor_total FLOAT NOT NULL,
  quantidade INT,
  representante TEXT,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_brands_tenant_id ON brands(tenant_id);
CREATE INDEX idx_customers_tenant_id ON customers(tenant_id);
CREATE INDEX idx_customers_brand_id ON customers(brand_id);
CREATE INDEX idx_customers_cidade ON customers(cidade);
CREATE INDEX idx_customers_estado ON customers(estado);
CREATE INDEX idx_sales_tenant_id ON sales(tenant_id);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_brand_id ON sales(brand_id);
CREATE INDEX idx_sales_data_emissao ON sales(data_emissao);
```

3. Clique em "Run" para executar

---

## PASSO 3: CLONAR E CONFIGURAR O PROJETO

### 3.1 Clonar Repositório

```bash
git clone <seu-repositorio>
cd geomarketing-platform
```

### 3.2 Instalar Dependências

```bash
npm install
```

### 3.3 Criar .env.local

```bash
cp .env.example .env.local
```

### 3.4 Preencher Variáveis de Ambiente

Edite `.env.local` com suas credenciais do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
DATABASE_URL=postgresql://postgres:sua-senha@db.abcdefgh.supabase.co:5432/postgres
JWT_SECRET=sua-chave-secreta-super-segura-aqui-mude-em-producao
```

### 3.5 Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

**Credenciais de teste:**
- Email: `demo@example.com`
- Senha: `demo123456`

---

## PASSO 4: FAZER PUSH PARA GIT

### 4.1 Inicializar Git (se não tiver)

```bash
git init
git add .
git commit -m "Initial commit: GeoMarketing Platform with auth"
git branch -M main
git remote add origin <seu-repositorio>
git push -u origin main
```

### 4.2 Atualizar Repositório (se já tem)

```bash
git add .
git commit -m "Add authentication system"
git push
```

---

## PASSO 5: DEPLOY NO VERCEL

### 5.1 Conectar Vercel ao GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up" (ou faça login)
3. Clique em "Import Project"
4. Selecione "GitHub"
5. Autorize Vercel a acessar seu GitHub
6. Selecione o repositório `geomarketing-platform`

### 5.2 Configurar Projeto

1. Em "Project Name", deixe como `geomarketing-platform`
2. Em "Framework Preset", selecione `Next.js`
3. Clique em "Continue"

### 5.3 Adicionar Variáveis de Ambiente

1. Em "Environment Variables", adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sua-chave-anonima-aqui
DATABASE_URL = postgresql://postgres:sua-senha@db.abcdefgh.supabase.co:5432/postgres
JWT_SECRET = sua-chave-secreta-super-segura-aqui-mude-em-producao
```

2. Clique em "Deploy"

### 5.4 Aguardar Deploy

- Vercel vai compilar e fazer deploy automaticamente
- Você verá o progresso em tempo real
- Quando terminar, clique em "Visit" para acessar a aplicação

---

## PASSO 6: TESTAR APLICAÇÃO EM PRODUÇÃO

### 6.1 Acessar Aplicação

Sua aplicação estará em:
```
https://geomarketing-platform.vercel.app
```

### 6.2 Testar Login

1. Acesse a URL acima
2. Clique em "Fazer login"
3. Use credenciais de teste:
   - Email: `demo@example.com`
   - Senha: `demo123456`

### 6.3 Testar Registro

1. Clique em "Criar conta"
2. Preencha o formulário:
   - Nome: `Seu Nome`
   - Email: `seu@email.com`
   - Empresa: `Sua Empresa`
   - Senha: `SenhaForte123!`
3. Clique em "Criar Conta"
4. Você será redirecionado para o dashboard

---

## 🔐 SEGURANÇA EM PRODUÇÃO

### Checklist de Segurança

- [ ] Mudar `JWT_SECRET` para uma chave forte e aleatória
- [ ] Usar HTTPS (Vercel faz automaticamente)
- [ ] Configurar CORS no Supabase
- [ ] Habilitar Row-Level Security (RLS) no Supabase
- [ ] Fazer backup regular do banco de dados
- [ ] Monitorar logs de erro
- [ ] Implementar rate limiting
- [ ] Usar variáveis de ambiente para todas as chaves

### Gerar JWT_SECRET Seguro

```bash
# No terminal, execute:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e use como `JWT_SECRET`.

---

## 📊 MONITORAR APLICAÇÃO

### Vercel Analytics

1. Acesse seu projeto no Vercel
2. Vá para "Analytics"
3. Veja métricas de performance

### Supabase Monitoring

1. Acesse seu projeto no Supabase
2. Vá para "Database" → "Logs"
3. Veja queries e erros

---

## 🆘 TROUBLESHOOTING

### Erro: "Cannot connect to Supabase"

**Solução:**
- Verifique se `NEXT_PUBLIC_SUPABASE_URL` está correto
- Verifique se `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto
- Teste a conexão no Supabase Studio

### Erro: "Relation does not exist"

**Solução:**
- Execute novamente o SQL para criar as tabelas
- Verifique se as tabelas foram criadas em "Table Editor"

### Erro: "Invalid JWT"

**Solução:**
- Verifique se `JWT_SECRET` está configurado
- Limpe cookies do navegador
- Faça login novamente

### Aplicação lenta em produção

**Solução:**
- Adicione índices nas colunas frequentemente filtradas
- Use caching (Redis)
- Otimize queries
- Aumente recursos no Supabase (plano pago)

---

## 📈 PRÓXIMOS PASSOS

1. ✅ Autenticação com login/senha
2. ✅ Multi-tenancy (cada empresa tem seus dados)
3. ✅ Deploy em produção (Vercel + Supabase)
4. ⏳ Importação de dados (Excel/CSV)
5. ⏳ Mapa interativo (Mapbox)
6. ⏳ Análise de zonas brancas
7. ⏳ Priorização de visitas
8. ⏳ Roteirização inteligente
9. ⏳ Dashboards executivos

---

## 📞 SUPORTE

- **Supabase Docs:** https://supabase.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Pronto para começar? 🚀**

Você agora tem uma plataforma completa com:
- ✅ Autenticação segura (JWT)
- ✅ Multi-tenancy (múltiplas empresas)
- ✅ Banco de dados PostgreSQL
- ✅ Deploy automático no Vercel
- ✅ Escalável e pronto para produção
