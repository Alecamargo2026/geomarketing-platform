# GeoMarketing Platform V2 - Documentação Completa

Sistema completo de geomarketing para agências de representação comercial multimarcas com importação diária de dados, análise de zonas brancas, mapas dinâmicos, relatórios automáticos e RBAC granular.

## 🚀 Funcionalidades Implementadas

✅ **Multi-Marca com Isolamento Completo** - Cada marca tem seus próprios dados, representantes e relatórios  
✅ **Importação Excel com 3 Abas** - Análise, Prioridade de Visitas, Transações  
✅ **RBAC Granular** - Admin, Manager, Representante com permissões específicas  
✅ **Supabase Realtime** - Atualizações em tempo real entre abas/dispositivos  
✅ **Heat Maps Dinâmicos** - Supercluster com zoom progressivo Brasil → Bairro  
✅ **Relatórios PDF/Excel** - Geração automática e agendada  
✅ **IBGE Integration** - Potencial teórico + análise de gaps  
✅ **Audit Logging Completo** - Rastreamento de todas as ações  
✅ **Testes Playwright E2E** - Cobertura de funcionalidades críticas  
✅ **Deploy Vercel** - CI/CD automático com GitHub  

## 📋 Setup Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Supabase
- Git

### Instalação

```bash
git clone https://github.com/Alecamargo2026/geomarketing-platform.git
cd geomarketing-platform
npm install
cp .env.example .env.local
# Edite .env.local com suas credenciais
npm run dev
```

## 🔐 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
JWT_SECRET=seu_jwt_secret
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app
NODE_ENV=development
```

## 🧪 Testes

```bash
npx playwright test
npx playwright test --ui
```

## 🚀 Deploy

```bash
git add .
git commit -m "Deploy ready"
git push origin main
```

Vercel faz deploy automático. Configure variáveis de ambiente no Vercel Dashboard.

## 📊 Arquitetura

- **Frontend**: Next.js 14 + React 19 + TypeScript
- **Backend**: Next.js API Routes + Supabase
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Auth
- **Realtime**: Supabase Channels
- **Maps**: Leaflet + Supercluster
- **Reports**: jsPDF + XLSX
- **Jobs**: node-cron

## ✅ Status

**Pronto para Produção** - Todos os 14 dias de desenvolvimento completados com sucesso.
