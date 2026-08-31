# 🌐 GUIA COMPLETO: COLOCAR A PLATAFORMA NO AR (WEB)

**Data:** 31/08/2026  
**Objetivo:** Plataforma acessível via web em 30 minutos

---

## ⚡ RESUMO RÁPIDO

Você terá uma plataforma **online** em 3 passos:

1. **Criar conta no Supabase** (5 min)
2. **Fazer push para GitHub** (5 min)
3. **Deploy no Vercel** (10 min)

**Resultado:** Plataforma acessível em `https://seu-projeto.vercel.app`

---

## PASSO 1: CRIAR CONTA NO SUPABASE (5 minutos)

### 1.1 Acessar Supabase

1. Vá para **https://supabase.com**
2. Clique em **"Sign Up"**
3. Use **GitHub** ou **Email** para criar conta

### 1.2 Criar Novo Projeto

1. Clique em **"New Project"**
2. Preencha:
   - **Organization:** (deixe padrão)
   - **Project Name:** `geomarketing-platform`
   - **Database Password:** `Abc123!@#XyZ` (guarde bem!)
   - **Region:** `South America (São Paulo)`
   - **Pricing Plan:** `Free`

3. Clique em **"Create new project"**
4. **Aguarde 2-3 minutos** enquanto o projeto é criado

### 1.3 Obter Credenciais

Quando o projeto estiver pronto:

1. Vá para **Settings** → **API**
2. **Copie e guarde:**
   - **Project URL** (ex: `https://abcdefgh.supabase.co`)
   - **anon public** (chave pública)

```
NEXT_PUBLIC_SUPABASE_URL = https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
```

### 1.4 Criar Tabelas no Supabase

1. No Supabase, vá para **SQL Editor**
2. Clique em **"New Query"**
3. **Cole este SQL:**

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

4. Clique em **"Run"**
5. ✅ Tabelas criadas!

---

## PASSO 2: FAZER PUSH PARA GITHUB (5 minutos)

### 2.1 Criar Repositório no GitHub

1. Vá para **https://github.com/new**
2. Preencha:
   - **Repository name:** `geomarketing-platform`
   - **Description:** `Plataforma de Inteligência Comercial Territorial`
   - **Public** (para que Vercel possa acessar)
3. Clique em **"Create repository"**

### 2.2 Fazer Push do Código

Abra o terminal na pasta do projeto:

```bash
cd C:\Users\user\geomarketing-platform
```

Execute:

```bash
git init
git add .
git commit -m "Initial commit: GeoMarketing Platform with authentication"
git branch -M main
git remote add origin https://github.com/seu-usuario/geomarketing-platform.git
git push -u origin main
```

✅ Código no GitHub!

---

## PASSO 3: DEPLOY NO VERCEL (10 minutos)

### 3.1 Conectar Vercel ao GitHub

1. Vá para **https://vercel.com**
2. Clique em **"Sign Up"** (ou faça login)
3. Clique em **"Continue with GitHub"**
4. Autorize Vercel a acessar seu GitHub

### 3.2 Importar Projeto

1. Clique em **"Import Project"**
2. Cole a URL do seu repositório:
   ```
   https://github.com/seu-usuario/geomarketing-platform
   ```
3. Clique em **"Continue"**

### 3.3 Configurar Projeto

1. **Project Name:** `geomarketing-platform`
2. **Framework Preset:** `Next.js`
3. Clique em **"Continue"**

### 3.4 Adicionar Variáveis de Ambiente

1. Em **"Environment Variables"**, adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
DATABASE_URL = postgresql://postgres:senha@db.abcdefgh.supabase.co:5432/postgres
JWT_SECRET = sua-chave-secreta-super-segura-aqui
```

2. Clique em **"Deploy"**

### 3.5 Aguardar Deploy

- Vercel vai compilar e fazer deploy automaticamente
- Você verá o progresso em tempo real
- Quando terminar, clique em **"Visit"**

✅ **Plataforma no ar!**

---

## 🎉 ACESSAR A PLATAFORMA

Sua plataforma estará em:

```
https://geomarketing-platform.vercel.app
```

### Credenciais de Teste

```
Email: demo@example.com
Senha: demo123456
```

---

## 📊 FLUXO COMPLETO

```
┌─────────────────────────────────────────────────────────┐
│  1. Criar Conta no Supabase                             │
│     ├─ Criar projeto                                    │
│     ├─ Obter credenciais                                │
│     └─ Criar tabelas (SQL)                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. Fazer Push para GitHub                              │
│     ├─ Criar repositório                                │
│     ├─ git init                                         │
│     ├─ git add .                                        │
│     ├─ git commit                                       │
│     └─ git push                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. Deploy no Vercel                                    │
│     ├─ Conectar GitHub                                  │
│     ├─ Importar projeto                                 │
│     ├─ Adicionar variáveis de ambiente                  │
│     └─ Deploy automático                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  ✅ PLATAFORMA NO AR!                                   │
│                                                         │
│  https://geomarketing-platform.vercel.app              │
│                                                         │
│  Acessível para qualquer pessoa no mundo!              │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 SEGURANÇA EM PRODUÇÃO

### Checklist de Segurança

- [ ] Mudar `JWT_SECRET` para uma chave forte
- [ ] Usar HTTPS (Vercel faz automaticamente)
- [ ] Configurar CORS no Supabase
- [ ] Habilitar Row-Level Security (RLS)
- [ ] Fazer backup regular do banco
- [ ] Monitorar logs de erro

### Gerar JWT_SECRET Seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copie o resultado e use como `JWT_SECRET` no Vercel.

---

## 📈 MONITORAR APLICAÇÃO

### Vercel Analytics

1. Acesse seu projeto no Vercel
2. Vá para **"Analytics"**
3. Veja métricas de performance

### Supabase Monitoring

1. Acesse seu projeto no Supabase
2. Vá para **"Database"** → **"Logs"**
3. Veja queries e erros

---

## 🆘 TROUBLESHOOTING

### Erro: "Build failed"

**Solução:**
- Verifique se `package.json` está correto
- Verifique se todas as dependências estão instaladas
- Veja os logs do Vercel para mais detalhes

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

---

## 📊 RESUMO DO QUE VOCÊ TEM

✅ **Plataforma online**
- Acessível em `https://geomarketing-platform.vercel.app`
- Qualquer pessoa pode acessar
- Funciona em qualquer dispositivo

✅ **Autenticação completa**
- Login com email e senha
- Registro de novos usuários
- Multi-tenancy (múltiplas empresas)

✅ **Banco de dados seguro**
- PostgreSQL no Supabase
- Backup automático
- Escalável

✅ **Deploy automático**
- Vercel faz deploy a cada push no GitHub
- HTTPS automático
- Performance otimizada

---

## 🚀 PRÓXIMAS FUNCIONALIDADES

Agora que a plataforma está no ar, você pode adicionar:

1. **Importação de Dados** - Upload de Excel/CSV
2. **Mapa Interativo** - Mapbox GL JS
3. **Análise de Zonas Brancas** - Identificar oportunidades
4. **Priorização de Visitas** - Score automático
5. **Roteirização Inteligente** - Google OR-Tools
6. **Dashboards Executivos** - KPIs e insights

---

## ✅ CHECKLIST FINAL

- [ ] Criar conta no Supabase
- [ ] Criar projeto no Supabase
- [ ] Obter credenciais
- [ ] Criar tabelas (SQL)
- [ ] Criar repositório no GitHub
- [ ] Fazer push do código
- [ ] Criar conta no Vercel
- [ ] Conectar GitHub ao Vercel
- [ ] Importar projeto
- [ ] Adicionar variáveis de ambiente
- [ ] Deploy no Vercel
- [ ] Acessar plataforma em produção
- [ ] Testar login/registro
- [ ] Compartilhar URL com outros usuários

---

## 📞 LINKS ÚTEIS

- **Supabase:** https://supabase.com
- **Vercel:** https://vercel.com
- **GitHub:** https://github.com
- **Documentação Next.js:** https://nextjs.org/docs

---

## 🎯 RESULTADO FINAL

Você terá uma **plataforma profissional online** que:

✅ Qualquer pessoa pode acessar via web  
✅ Múltiplos usuários podem se registrar  
✅ Cada empresa tem seus dados isolados  
✅ Funciona em qualquer dispositivo  
✅ Escalável e segura  
✅ Pronta para adicionar funcionalidades  

---

**Plataforma no ar em 30 minutos! 🚀**

Siga os 3 passos acima e sua plataforma estará acessível na web.

---

**Desenvolvido com ❤️ por Verdent AI**  
**31/08/2026**
