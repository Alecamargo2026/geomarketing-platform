# 🏗️ ARQUITETURA DO SISTEMA

## Diagrama Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIO FINAL                            │
│                    (Navegador Web)                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL (Frontend)                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js 14 + React 18                       │  │
│  │                                                          │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │  │
│  │  │   Login     │  │  Register   │  │  Dashboard   │    │  │
│  │  │   Page      │  │   Page      │  │   (Protected)│    │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘    │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Zustand Auth Store                       │   │  │
│  │  │  (user, token, isLoading)                        │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                          │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │         Tailwind CSS + Responsive Design         │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Next.js API Routes                         │  │
│  │                                                          │  │
│  │  POST /api/auth/login                                   │  │
│  │  POST /api/auth/register                                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE (Backend)                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           PostgreSQL Database                           │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐    │  │
│  │  │   Tenants    │  │    Users     │  │  Brands    │    │  │
│  │  │              │  │              │  │            │    │  │
│  │  │ • id         │  │ • id         │  │ • id       │    │  │
│  │  │ • name       │  │ • email      │  │ • name     │    │  │
│  │  │ • slug       │  │ • password   │  │ • slug     │    │  │
│  │  │ • email      │  │ • name       │  │ • color    │    │  │
│  │  │ • phone      │  │ • role       │  │ • tenant   │    │  │
│  │  │ • website    │  │ • tenant_id  │  │            │    │  │
│  │  │ • logo       │  │ • active     │  │            │    │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘    │  │
│  │                                                          │  │
│  │  ┌──────────────┐  ┌──────────────┐                     │  │
│  │  │  Customers   │  │    Sales     │                     │  │
│  │  │              │  │              │                     │  │
│  │  │ • id         │  │ • id         │                     │  │
│  │  │ • cnpj       │  │ • data       │                     │  │
│  │  │ • razao      │  │ • valor      │                     │  │
│  │  │ • telefone   │  │ • customer   │                     │  │
│  │  │ • endereco   │  │ • brand      │                     │  │
│  │  │ • cidade     │  │ • tenant     │                     │  │
│  │  │ • estado     │  │              │                     │  │
│  │  │ • lat/long   │  │              │                     │  │
│  │  │ • tenant     │  │              │                     │  │
│  │  │ • brand      │  │              │                     │  │
│  │  └──────────────┘  └──────────────┘                     │  │
│  │                                                          │  │
│  │  Índices:                                                │  │
│  │  • idx_users_tenant_id                                  │  │
│  │  • idx_customers_tenant_id                              │  │
│  │  • idx_customers_cidade                                 │  │
│  │  • idx_sales_customer_id                                │  │
│  │  • idx_sales_data_emissao                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           Authentication & Security                      │  │
│  │                                                          │  │
│  │  • JWT Tokens (7 dias de expiração)                     │  │
│  │  • Bcrypt Password Hashing                              │  │
│  │  • Row-Level Security (RLS)                             │  │
│  │  • Multi-Tenancy Isolation                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOVO USUÁRIO                                 │
└─────────────────────────────────────────────────────────────────┘

1. Usuário acessa /register
   ↓
2. Preenche formulário:
   - Nome
   - Email
   - Senha
   - Nome da Empresa
   ↓
3. Clica em "Criar Conta"
   ↓
4. POST /api/auth/register
   ├─ Valida entrada
   ├─ Verifica se email já existe
   ├─ Hash da senha (bcryptjs)
   ├─ Cria Tenant (empresa)
   ├─ Cria User (usuário)
   ├─ Gera JWT token
   └─ Retorna user + token
   ↓
5. Frontend armazena token no Zustand
   ↓
6. Redireciona para /dashboard
   ↓
7. Dashboard protegido verifica token
   ├─ Se válido → mostra conteúdo
   └─ Se inválido → redireciona para /login

┌─────────────────────────────────────────────────────────────────┐
│                    USUÁRIO EXISTENTE                            │
└─────────────────────────────────────────────────────────────────┘

1. Usuário acessa /login
   ↓
2. Preenche formulário:
   - Email
   - Senha
   ↓
3. Clica em "Entrar"
   ↓
4. POST /api/auth/login
   ├─ Valida entrada
   ├─ Busca usuário no banco
   ├─ Verifica senha (bcryptjs.compare)
   ├─ Gera JWT token
   └─ Retorna user + token
   ↓
5. Frontend armazena token no Zustand
   ↓
6. Redireciona para /dashboard
   ↓
7. Dashboard protegido verifica token
   ├─ Se válido → mostra conteúdo
   └─ Se inválido → redireciona para /login

┌─────────────────────────────────────────────────────────────────┐
│                    LOGOUT                                       │
└─────────────────────────────────────────────────────────────────┘

1. Usuário clica em "Sair"
   ↓
2. Frontend limpa Zustand store
   ├─ user = null
   ├─ token = null
   └─ isLoading = false
   ↓
3. Redireciona para /login
```

---

## Estrutura de Dados (Multi-Tenancy)

```
┌─────────────────────────────────────────────────────────────────┐
│                    TENANT 1 (Empresa A)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tenant ID: tenant-1                                      │  │
│  │ Name: Empresa A                                          │  │
│  │ Email: admin@empresaa.com                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Users:                                                         │
│  ├─ User 1: admin@empresaa.com (admin)                        │
│  ├─ User 2: vendedor@empresaa.com (user)                      │
│  └─ User 3: gerente@empresaa.com (manager)                    │
│                                                                 │
│  Brands:                                                        │
│  ├─ Brand 1: Produto A                                        │
│  └─ Brand 2: Produto B                                        │
│                                                                 │
│  Customers:                                                     │
│  ├─ Customer 1: CNPJ 123 (Brand 1)                            │
│  ├─ Customer 2: CNPJ 456 (Brand 1)                            │
│  └─ Customer 3: CNPJ 789 (Brand 2)                            │
│                                                                 │
│  Sales:                                                         │
│  ├─ Sale 1: Customer 1, Brand 1, R$ 1000                      │
│  ├─ Sale 2: Customer 2, Brand 1, R$ 2000                      │
│  └─ Sale 3: Customer 3, Brand 2, R$ 1500                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    TENANT 2 (Empresa B)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Tenant ID: tenant-2                                      │  │
│  │ Name: Empresa B                                          │  │
│  │ Email: admin@empresab.com                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Users:                                                         │
│  ├─ User 1: admin@empresab.com (admin)                        │
│  └─ User 2: vendedor@empresab.com (user)                      │
│                                                                 │
│  Brands:                                                        │
│  └─ Brand 1: Produto C                                        │
│                                                                 │
│  Customers:                                                     │
│  ├─ Customer 1: CNPJ 111 (Brand 1)                            │
│  └─ Customer 2: CNPJ 222 (Brand 1)                            │
│                                                                 │
│  Sales:                                                         │
│  ├─ Sale 1: Customer 1, Brand 1, R$ 500                       │
│  └─ Sale 2: Customer 2, Brand 1, R$ 750                       │
└─────────────────────────────────────────────────────────────────┘

ISOLAMENTO:
- Cada tenant vê apenas seus dados
- Queries filtram por tenant_id
- Sem possibilidade de acesso cruzado
```

---

## Stack Tecnológico

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND                                   │
├─────────────────────────────────────────────────────────────────┤
│ • Next.js 14 (React Framework)                                  │
│ • React 18 (UI Library)                                         │
│ • TypeScript (Type Safety)                                      │
│ • Tailwind CSS (Styling)                                        │
│ • Zustand (State Management)                                    │
│ • React Hot Toast (Notifications)                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND                                    │
├─────────────────────────────────────────────────────────────────┤
│ • Next.js API Routes (Serverless Functions)                     │
│ • JWT (Authentication)                                          │
│ • Bcryptjs (Password Hashing)                                   │
│ • Prisma (ORM - opcional)                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                   │
├─────────────────────────────────────────────────────────────────┤
│ • Supabase (PostgreSQL + Auth)                                  │
│ • PostgreSQL 14+ (Database)                                     │
│ • Row-Level Security (RLS)                                      │
│ • Automatic Backups                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT                                 │
├─────────────────────────────────────────────────────────────────┤
│ • Vercel (Frontend Hosting)                                     │
│ • Supabase (Database Hosting)                                   │
│ • GitHub (Version Control)                                      │
│ • Automatic CI/CD                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Requisição

```
┌──────────────────────────────────────────────────────────────────┐
│                    USUÁRIO CLICA EM "ENTRAR"                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  1. Frontend (React)                                             │
│     - Coleta email e senha                                       │
│     - Valida entrada (cliente)                                   │
│     - Envia POST /api/auth/login                                 │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  2. Next.js API Route                                            │
│     - Recebe email e senha                                       │
│     - Valida entrada (servidor)                                  │
│     - Busca usuário no Supabase                                  │
│     - Verifica senha com bcryptjs                                │
│     - Gera JWT token                                             │
│     - Retorna user + token                                       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  3. Supabase (PostgreSQL)                                        │
│     - Query: SELECT * FROM users WHERE email = ?                │
│     - Retorna usuário com senha hash                             │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  4. Frontend (React)                                             │
│     - Recebe user + token                                        │
│     - Armazena no Zustand store                                  │
│     - Armazena token em localStorage (opcional)                  │
│     - Redireciona para /dashboard                                │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│  5. Dashboard Protegido                                          │
│     - Verifica se user existe no store                           │
│     - Se sim → mostra conteúdo                                   │
│     - Se não → redireciona para /login                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Segurança

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADAS DE SEGURANÇA                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. FRONTEND                                                    │
│     ├─ Validação de entrada (email, senha)                     │
│     ├─ Proteção de rotas (redirect se não logado)              │
│     └─ Armazenamento seguro de token                           │
│                                                                 │
│  2. BACKEND                                                     │
│     ├─ Validação de entrada (servidor)                         │
│     ├─ Hash de senha (bcryptjs)                                │
│     ├─ JWT tokens com expiração                                │
│     └─ Isolamento de dados por tenant                          │
│                                                                 │
│  3. DATABASE                                                    │
│     ├─ Row-Level Security (RLS)                                │
│     ├─ Índices para performance                                │
│     ├─ Backup automático                                       │
│     └─ Criptografia em trânsito (SSL/TLS)                      │
│                                                                 │
│  4. DEPLOYMENT                                                  │
│     ├─ HTTPS automático (Vercel)                               │
│     ├─ Variáveis de ambiente seguras                           │
│     ├─ Sem exposição de chaves privadas                        │
│     └─ Monitoramento de segurança                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

**Arquitetura completa e segura! 🔐**
