# 🚀 GUIA SUPER SIMPLIFICADO - FAÇA AGORA!

**Tempo total:** 15 minutos  
**Dificuldade:** Muito fácil (só clicar e copiar)

---

## PASSO 1: CRIAR CONTA NO SUPABASE (3 minutos)

### 1️⃣ Abra o navegador

Vá para: **https://supabase.com**

### 2️⃣ Clique em "Sign Up"

Você verá um botão no canto superior direito.

### 3️⃣ Escolha como criar conta

Clique em **"Continue with GitHub"** (mais fácil)

Ou use **Email** se preferir.

### 4️⃣ Autorize o Supabase

Se usar GitHub, clique em "Authorize supabase"

### 5️⃣ Crie um novo projeto

Clique em **"New Project"**

### 6️⃣ Preencha os dados

```
Project Name: geomarketing-platform
Database Password: Abc123!@#XyZ
Region: South America (São Paulo)
Pricing Plan: Free
```

### 7️⃣ Clique em "Create new project"

**Aguarde 2-3 minutos** enquanto o projeto é criado.

---

## PASSO 2: COPIAR CREDENCIAIS (2 minutos)

Quando o projeto estiver pronto:

### 1️⃣ Vá para Settings

Clique em **"Settings"** no menu esquerdo.

### 2️⃣ Clique em "API"

Você verá as credenciais.

### 3️⃣ Copie estas 2 informações

```
NEXT_PUBLIC_SUPABASE_URL = [copie aqui]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [copie aqui]
```

**Guarde em um arquivo de texto!**

---

## PASSO 3: CRIAR TABELAS (5 minutos)

### 1️⃣ Vá para SQL Editor

No menu esquerdo, clique em **"SQL Editor"**

### 2️⃣ Clique em "New Query"

### 3️⃣ Cole este SQL:

```sql
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

### 4️⃣ Clique em "Run"

Aguarde alguns segundos.

### 5️⃣ Veja a mensagem de sucesso

Se aparecer "Success", as tabelas foram criadas! ✅

---

## PASSO 4: ENVIAR CREDENCIAIS PARA MIM

Depois de fazer tudo acima, **copie e envie para mim:**

```
NEXT_PUBLIC_SUPABASE_URL = [seu valor aqui]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [seu valor aqui]
```

**Eu vou:**
1. ✅ Configurar as variáveis no projeto
2. ✅ Fazer push para GitHub
3. ✅ Deploy no Vercel
4. ✅ Testar a plataforma
5. ✅ Enviar o link para você acessar

---

## ✅ CHECKLIST

- [ ] Acessei https://supabase.com
- [ ] Criei conta (GitHub ou Email)
- [ ] Criei projeto "geomarketing-platform"
- [ ] Aguardei 2-3 minutos
- [ ] Copiei NEXT_PUBLIC_SUPABASE_URL
- [ ] Copiei NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Fui para SQL Editor
- [ ] Colei o SQL
- [ ] Cliquei em "Run"
- [ ] Vi a mensagem de sucesso
- [ ] Vou enviar as credenciais para você

---

## 🎯 PRÓXIMO PASSO

**Faça os 4 passos acima e me envie as credenciais!**

Eu faço o resto (GitHub + Vercel + Deploy).

---

**Tempo total: 15 minutos! ⏱️**

Você consegue! 💪
