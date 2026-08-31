# GeoMarketing Platform

Plataforma de Inteligência Comercial Territorial com autenticação multi-tenant.

## 🚀 Quick Start

### 1. Clonar o Repositório

```bash
git clone <seu-repositorio>
cd geomarketing-platform
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=sua-chave-secreta-aqui
```

### 4. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 5. Credenciais de Teste

```
Email: demo@example.com
Senha: demo123456
```

---

## 📋 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha os dados:
   - Project Name: `geomarketing-platform`
   - Database Password: (gere uma senha forte)
   - Region: (escolha a mais próxima)
4. Clique em "Create new project"

### 2. Obter Credenciais

1. Vá para "Settings" → "API"
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Criar Tabelas

1. Vá para "SQL Editor"
2. Execute o SQL do arquivo `prisma/schema.prisma`

Ou use Prisma:

```bash
npx prisma db push
```

---

## 🔐 Autenticação

### Fluxo de Login

1. Usuário acessa `/login`
2. Insere email e senha
3. Sistema valida credenciais
4. Gera JWT token
5. Armazena token no Zustand store
6. Redireciona para `/dashboard`

### Fluxo de Registro

1. Usuário acessa `/register`
2. Preenche formulário (nome, email, senha, empresa)
3. Sistema cria tenant (empresa)
4. Sistema cria usuário
5. Gera JWT token
6. Redireciona para `/dashboard`

### Proteção de Rotas

Todas as rotas em `/dashboard` são protegidas:
- Se não houver usuário logado, redireciona para `/login`
- Se houver usuário, mostra o conteúdo

---

## 📁 Estrutura do Projeto

```
geomarketing-platform/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Rotas protegidas
│   │   │   ├── layout.tsx        # Layout com sidebar
│   │   │   ├── dashboard/
│   │   │   ├── import/
│   │   │   ├── customers/
│   │   │   ├── zones/
│   │   │   ├── priorities/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       └── register/
│   │   ├── login/
│   │   ├── register/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   │   └── supabase.ts
│   ├── store/
│   │   └── authStore.ts
│   └── styles/
│       └── globals.css
├── prisma/
│   └── schema.prisma
├── public/
├── .env.example
├── .env.local (gitignored)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Deploy no Vercel

### 1. Preparar Repositório Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <seu-repositorio>
git push -u origin main
```

### 2. Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Selecione seu repositório
4. Clique em "Import"

### 3. Configurar Variáveis de Ambiente

1. Em "Environment Variables", adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL`
   - `JWT_SECRET`

2. Clique em "Deploy"

### 4. Acessar Aplicação

Sua aplicação estará disponível em:
```
https://seu-projeto.vercel.app
```

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | ✅ |
| `DATABASE_URL` | URL de conexão PostgreSQL | ✅ |
| `JWT_SECRET` | Chave secreta para JWT | ✅ |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Token do Mapbox (opcional) | ❌ |
| `NODE_ENV` | Ambiente (development/production) | ❌ |

---

## 📚 Próximas Funcionalidades

- [ ] Importação de dados (Excel/CSV)
- [ ] Mapa interativo (Mapbox)
- [ ] Análise de zonas brancas
- [ ] Priorização de visitas
- [ ] Roteirização inteligente
- [ ] Dashboards executivos
- [ ] Relatórios customizados
- [ ] Integração com CRM

---

## 🐛 Troubleshooting

### Erro: "Missing Supabase environment variables"

Verifique se `.env.local` contém:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Erro: "Cannot find module '@supabase/supabase-js'"

Execute:
```bash
npm install
```

### Erro: "Port 3000 already in use"

Use outra porta:
```bash
npm run dev -- -p 3001
```

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ por Verdent AI**
