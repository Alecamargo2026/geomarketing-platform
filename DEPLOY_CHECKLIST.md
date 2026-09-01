# 🚀 CHECKLIST DE DEPLOY - GeoMarketing Platform

## ✅ PRÉ-REQUISITOS

- [ ] Node.js 18+ instalado
- [ ] npm ou yarn disponível
- [ ] Conta Supabase criada (https://supabase.com)
- [ ] Conta Vercel criada (https://vercel.com)
- [ ] Repositório GitHub criado
- [ ] Git instalado e configurado

---

## 📋 FASE 1: SUPABASE SETUP

### Criar Projeto
- [ ] Acessar https://supabase.com
- [ ] Criar novo projeto
- [ ] Aguardar criação (2-3 minutos)
- [ ] Copiar chaves de API:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Configurar Banco de Dados
- [ ] Acessar SQL Editor no Supabase
- [ ] Copiar SQL completo de `SETUP_SUPABASE.md`
- [ ] Executar SQL
- [ ] Verificar 8 tabelas criadas:
  - [ ] `states`
  - [ ] `cities`
  - [ ] `neighborhoods`
  - [ ] `customers`
  - [ ] `white_zones`
  - [ ] `visit_priorities`
  - [ ] `import_logs`
  - [ ] `user_settings`
- [ ] Verificar dados seed populados
- [ ] Verificar RLS policies ativas

---

## 🔐 FASE 2: VARIÁVEIS DE AMBIENTE

### Arquivo `.env.local`
- [ ] Criar arquivo `.env.local` na raiz do projeto
- [ ] Adicionar variáveis (ver `ENV_SETUP.md`):
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  JWT_SECRET=seu-secret-key-super-seguro-aqui
  NODE_ENV=development
  ```
- [ ] Salvar arquivo
- [ ] Verificar `.gitignore` contém `.env.local`

---

## 🧪 FASE 3: TESTES LOCAIS

### Instalar Dependências
- [ ] Rodar `npm install`
- [ ] Aguardar conclusão (2-3 minutos)
- [ ] Verificar sem erros

### Build Local
- [ ] Rodar `npm run build`
- [ ] Verificar exit code 0
- [ ] Verificar sem erros TypeScript

### Servidor de Desenvolvimento
- [ ] Rodar `npm run dev`
- [ ] Acessar http://localhost:3000
- [ ] Verificar página inicial carrega
- [ ] Verificar sem erros no console

### Testar Funcionalidades
- [ ] Dashboard carrega dados reais
- [ ] Mapa interativo funciona
- [ ] Importação de arquivos funciona
- [ ] Autenticação funciona (login/register)
- [ ] APIs retornam dados corretos

---

## 📤 FASE 4: GITHUB SETUP

### Preparar Repositório
- [ ] Criar repositório no GitHub
- [ ] Clonar repositório localmente
- [ ] Copiar arquivos do projeto para o repositório
- [ ] Verificar `.gitignore` contém:
  - [ ] `node_modules/`
  - [ ] `.env.local`
  - [ ] `.next/`
  - [ ] `dist/`

### Fazer Commit Inicial
```bash
git add .
git commit -m "feat: setup completo com Supabase"
git push origin main
```
- [ ] Commit realizado
- [ ] Push realizado
- [ ] Repositório atualizado no GitHub

---

## 🚀 FASE 5: VERCEL DEPLOY

### Conectar Vercel
- [ ] Acessar https://vercel.com
- [ ] Clicar em "New Project"
- [ ] Selecionar repositório GitHub
- [ ] Clicar em "Import"

### Configurar Variáveis de Ambiente
- [ ] Na página de configuração, ir para "Environment Variables"
- [ ] Adicionar variáveis:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `JWT_SECRET`
- [ ] Verificar todas as variáveis adicionadas

### Deploy
- [ ] Clicar em "Deploy"
- [ ] Aguardar 2-3 minutos
- [ ] Verificar status "Ready"
- [ ] Copiar URL de produção

### Testar em Produção
- [ ] Acessar URL de produção
- [ ] Verificar página inicial carrega
- [ ] Verificar dashboard funciona
- [ ] Verificar mapa funciona
- [ ] Verificar importação funciona
- [ ] Verificar autenticação funciona

---

## 📊 FASE 6: VERIFICAÇÃO FINAL

### Funcionalidades
- [ ] Login/Registro funciona
- [ ] Dashboard mostra dados reais
- [ ] Mapa interativo funciona
- [ ] Importação de XLSX/CSV funciona
- [ ] Filtros funcionam
- [ ] Exportação funciona
- [ ] Navegação funciona
- [ ] Dark mode funciona

### Performance
- [ ] Página carrega em < 3 segundos
- [ ] Mapa com 1000+ pontos funciona
- [ ] Sem erros de console
- [ ] Sem memory leaks

### Segurança
- [ ] Autenticação funciona
- [ ] RLS policies ativas
- [ ] Dados do usuário isolados
- [ ] Sem exposição de chaves
- [ ] HTTPS ativo

### Banco de Dados
- [ ] Dados salvam corretamente
- [ ] Queries executam rápido
- [ ] Índices funcionam
- [ ] Triggers funcionam

---

## 📝 DOCUMENTAÇÃO

- [ ] `SETUP_SUPABASE.md` - Guia completo de setup
- [ ] `ENV_SETUP.md` - Configuração de variáveis
- [ ] `STATUS_FINAL_PROJETO.txt` - Status do projeto
- [ ] `README.md` - Documentação geral
- [ ] Código comentado - Funções principais documentadas

---

## 🎯 PRÓXIMOS PASSOS (APÓS DEPLOY)

- [ ] Importar dados reais via página de importação
- [ ] Configurar filtros personalizados
- [ ] Criar dashboards executivos
- [ ] Integrar APIs externas (IBGE, OpenCNPJ)
- [ ] Implementar testes automatizados
- [ ] Configurar monitoramento (Sentry, LogRocket)
- [ ] Otimizar performance
- [ ] Adicionar mais funcionalidades

---

## 🆘 TROUBLESHOOTING

### Erro: "supabaseUrl is required"
- [ ] Verificar se `.env.local` existe
- [ ] Verificar se `NEXT_PUBLIC_SUPABASE_URL` está correto
- [ ] Verificar se variáveis estão no Vercel (se em produção)

### Erro: "Unauthorized" nas APIs
- [ ] Verificar se `SUPABASE_SERVICE_ROLE_KEY` está correto
- [ ] Verificar se token Bearer é válido
- [ ] Verificar RLS policies no Supabase

### Build falha no Vercel
- [ ] Verificar se todas as variáveis de ambiente estão configuradas
- [ ] Rodar `npm run build` localmente para debug
- [ ] Verificar erros de TypeScript
- [ ] Verificar logs do Vercel

### Mapa não carrega
- [ ] Verificar se Leaflet está instalado
- [ ] Verificar console do navegador para erros
- [ ] Verificar se coordenadas são válidas
- [ ] Verificar se API de mapa retorna dados

### Importação não funciona
- [ ] Verificar se arquivo é XLSX ou CSV válido
- [ ] Verificar se colunas têm nomes corretos
- [ ] Verificar se dados estão no formato correto
- [ ] Verificar logs da API de importação

---

## ✅ CONCLUSÃO

Após completar todos os itens acima, seu sistema de GeoMarketing estará:

✅ Totalmente funcional
✅ Seguro e protegido
✅ Pronto para produção
✅ Escalável e performático
✅ Bem documentado

**Status**: 🚀 PRONTO PARA USAR

---

## 📞 SUPORTE

- **Documentação Supabase**: https://supabase.com/docs
- **Documentação Next.js**: https://nextjs.org/docs
- **Documentação Leaflet**: https://leafletjs.com/
- **Documentação Vercel**: https://vercel.com/docs
- **GitHub Issues**: Abra uma issue no repositório

---

**Data**: 31/08/2026
**Versão**: 1.0.0
**Status**: ✅ PRONTO PARA DEPLOY
