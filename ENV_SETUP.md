# 📋 Arquivo de Configuração de Ambiente

## Como Criar `.env.local`

Na raiz do projeto (`C:\Users\user\geomarketing-platform\`), crie um arquivo chamado `.env.local` com o seguinte conteúdo:

```
# ============================================
# SUPABASE CONFIGURATION
# ============================================
# Obtenha essas chaves em: https://supabase.com/dashboard
# Settings → API → Project URL e Keys

# URL do seu projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co

# Chave pública (anon) - segura para usar no frontend
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Chave privada (service_role) - NUNCA compartilhe ou commit!
# Use apenas no backend/API routes
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# AUTHENTICATION
# ============================================
# Chave secreta para JWT (gere uma string aleatória forte)
JWT_SECRET=seu-secret-key-super-seguro-aqui-mude-em-producao

# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV=development
```

## Passo a Passo

1. Abra um editor de texto (Notepad, VS Code, etc.)
2. Copie o conteúdo acima
3. Substitua os valores:
   - `https://seu-projeto.supabase.co` → URL real do seu projeto
   - `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → Chaves reais do Supabase
   - `seu-secret-key-super-seguro-aqui-mude-em-producao` → String aleatória forte
4. Salve como `.env.local` na raiz do projeto
5. **NUNCA** commit este arquivo no Git

## Onde Obter as Chaves

1. Acesse https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## ⚠️ Segurança

- **NUNCA** compartilhe `SUPABASE_SERVICE_ROLE_KEY`
- **NUNCA** commit `.env.local` no Git
- **NUNCA** exponha chaves em logs ou console
- Em produção (Vercel), configure variáveis no painel do Vercel, não em `.env.local`
