# 🚀 GUIA COMPLETO DE DEPLOY NO VERCEL

## GeoMarketing Platform V2 - Deploy em Produção

---

## ✅ PRÉ-REQUISITOS

- ✅ Conta GitHub (com repositório `geomarketing-platform`)
- ✅ Conta Vercel (https://vercel.com)
- ✅ Credenciais Supabase (URL, chaves, DATABASE_URL)
- ✅ JWT_SECRET gerado

---

## 📋 STEP 1: ACESSAR VERCEL DASHBOARD

1. Abra https://vercel.com/dashboard
2. Faça login com sua conta GitHub
3. Você verá a página principal do Vercel

---

## 📋 STEP 2: CRIAR NOVO PROJETO

1. Clique no botão **"Add New"** (canto superior direito)
2. Selecione **"Project"** no menu dropdown
3. Você será redirecionado para a página de seleção de repositório

---

## 📋 STEP 3: CONECTAR REPOSITÓRIO GITHUB

1. Na página de seleção de repositório, procure por **"geomarketing-platform"**
2. Clique no repositório para selecioná-lo
3. Clique em **"Import"**
4. Vercel carregará as configurações do projeto

---

## 📋 STEP 4: CONFIGURAR VARIÁVEIS DE AMBIENTE

Na página de configuração do projeto, você verá uma seção **"Environment Variables"**.

**Adicione EXATAMENTE estas 6 variáveis:**

### Variável 1: NEXT_PUBLIC_SUPABASE_URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://seu-projeto.supabase.co
```
(Copie de seu projeto Supabase → Settings → API)

### Variável 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sua chave anônima)
```
(Copie de seu projeto Supabase → Settings → API → anon key)

### Variável 3: SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sua chave service role)
```
(Copie de seu projeto Supabase → Settings → API → service_role key)

### Variável 4: DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres:senha@db.supabase.co:5432/postgres
```
(Copie de seu projeto Supabase → Settings → Database → Connection string → URI)

### Variável 5: JWT_SECRET
```
Name: JWT_SECRET
Value: seu_jwt_secret_aleatorio_muito_seguro_aqui
```
(Gere um valor aleatório seguro, ex: `openssl rand -base64 32`)

### Variável 6: NODE_ENV
```
Name: NODE_ENV
Value: production
```

**Após adicionar todas as 6 variáveis, clique "Deploy"**

---

## 📋 STEP 5: DEPLOY

1. Clique no botão **"Deploy"** (canto inferior direito)
2. Vercel iniciará o build automático
3. Você verá o progresso em tempo real:
   - ✅ Cloning repository
   - ✅ Installing dependencies
   - ✅ Building project
   - ✅ Generating static files
   - ✅ Deploying to production

**Tempo estimado: 5-10 minutos**

4. Quando completar, você verá:
   ```
   ✅ Production Deployment
   https://seu-projeto.vercel.app
   ```

5. Copie a URL de produção

---

## 📋 STEP 6: VERIFICAÇÃO EM PRODUÇÃO

Após o deploy completar, teste cada funcionalidade:

### ✅ TESTE 1: Acesso à Aplicação
- Abra: `https://seu-projeto.vercel.app`
- Esperado: Página carrega sem erros
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 2: Login
- Tente fazer login com credenciais válidas
- Esperado: Redireciona para dashboard
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 3: Multi-Brand Selector
- Vá para `/dashboard`
- Procure seletor de marca no header
- Esperado: Seletor visível com múltiplas marcas
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 4: Importação de Dados
- Vá para `/dashboard/import`
- Tente fazer upload de arquivo Excel
- Esperado: Preview funciona, importação bem-sucedida
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 5: RBAC (Representante vê apenas seus dados)
- Faça logout
- Faça login como representante
- Vá para `/dashboard/customers`
- Esperado: Vê apenas seus clientes
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 6: Mapa Dinâmico
- Vá para `/dashboard/map`
- Aguarde 2-3 segundos para carregar
- Esperado: Mapa carrega com clusters
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 7: Relatórios
- Vá para `/dashboard/reports`
- Clique "Gerar Relatório"
- Esperado: PDF/Excel gera e baixa
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 8: Gap Analysis
- Vá para `/dashboard/gap-analysis`
- Esperado: Tabela com dados de gaps carrega
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 9: Audit Logs
- Faça login como admin
- Vá para `/dashboard/audit-logs`
- Esperado: Logs de ações aparecem
- Status: ✅ PASSOU / ❌ FALHOU

### ✅ TESTE 10: Realtime Updates
- Abra 2 abas do navegador
- Em uma aba, vá para `/dashboard/customers`
- Na outra aba, vá para `/dashboard/import`
- Importe um arquivo
- Esperado: A primeira aba atualiza automaticamente (sem F5)
- Status: ✅ PASSOU / ❌ FALHOU

---

## 🎯 RESULTADO ESPERADO

Se todos os 10 testes passarem:

```
✅ DEPLOY VERCEL COMPLETO
✅ URL: https://seu-projeto.vercel.app
✅ SISTEMA 100% FUNCIONAL EM PRODUÇÃO
```

---

## 🔧 TROUBLESHOOTING

### Erro: "Build failed"
- Verifique se todas as variáveis de ambiente estão corretas
- Verifique se DATABASE_URL está acessível
- Verifique logs no Vercel dashboard

### Erro: "Cannot find module"
- Verifique se `npm install` foi executado
- Verifique se package.json está correto
- Limpe cache: `npm cache clean --force`

### Erro: "Supabase connection failed"
- Verifique NEXT_PUBLIC_SUPABASE_URL
- Verifique SUPABASE_SERVICE_ROLE_KEY
- Verifique DATABASE_URL
- Teste conexão localmente: `npm run dev`

### Erro: "RLS policy violation"
- Verifique se RLS policies foram criadas no Supabase
- Verifique se user está autenticado
- Verifique se tenant_id está correto

---

## 📞 SUPORTE

Se encontrar problemas:

1. **Verifique logs locais**
   ```bash
   npm run dev
   # Abra DevTools (F12) e veja console
   ```

2. **Verifique logs do Vercel**
   - Acesse Vercel Dashboard
   - Clique no projeto
   - Vá em "Deployments"
   - Clique no deployment
   - Veja "Logs"

3. **Verifique Supabase**
   - Acesse Supabase console
   - Vá em "Logs"
   - Procure por erros de conexão

4. **Verifique GitHub**
   - Confirme que o repositório está atualizado
   - Confirme que o branch `main` tem os últimos commits

---

## ✅ CHECKLIST FINAL

- [ ] Conta Vercel criada
- [ ] Repositório GitHub conectado
- [ ] 6 variáveis de ambiente configuradas
- [ ] Build passou sem erros
- [ ] Deploy completado
- [ ] 10 testes de verificação passaram
- [ ] URL de produção acessível
- [ ] Sistema 100% funcional

---

## 🎉 PARABÉNS!

Seu sistema **GeoMarketing Platform V2** está **100% em produção** no Vercel!

**URL de Produção**: `https://seu-projeto.vercel.app`

**Próximos passos:**
1. Compartilhe URL com sua equipe
2. Configure domínio customizado (opcional)
3. Configure CI/CD automático (já está configurado)
4. Monitore performance no Vercel Analytics

---

**Data**: 2024  
**Versão**: 2.0  
**Status**: ✅ Production Ready
