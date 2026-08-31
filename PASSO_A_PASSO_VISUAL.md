# 🌐 PASSO-A-PASSO VISUAL: COLOCAR NO AR

**Tempo total:** 30 minutos  
**Resultado:** Plataforma acessível em `https://seu-projeto.vercel.app`

---

## PASSO 1: SUPABASE (5 minutos)

### 1️⃣ Acessar Supabase

```
https://supabase.com
↓
Clique em "Sign Up"
↓
Use GitHub ou Email
```

### 2️⃣ Criar Projeto

```
Clique em "New Project"
↓
Project Name: geomarketing-platform
Database Password: Abc123!@#XyZ
Region: South America (São Paulo)
Pricing: Free
↓
Clique em "Create new project"
↓
Aguarde 2-3 minutos
```

### 3️⃣ Obter Credenciais

```
Settings → API
↓
Copie:
- Project URL
- anon public key
↓
Guarde em um arquivo de texto
```

### 4️⃣ Criar Tabelas

```
SQL Editor → New Query
↓
Cole o SQL (veja DEPLOY_WEB.md)
↓
Clique em "Run"
↓
✅ Tabelas criadas!
```

---

## PASSO 2: GITHUB (5 minutos)

### 1️⃣ Criar Repositório

```
https://github.com/new
↓
Repository name: geomarketing-platform
Description: Plataforma de Inteligência Comercial Territorial
Public: ✓
↓
Clique em "Create repository"
```

### 2️⃣ Fazer Push do Código

Abra terminal na pasta do projeto:

```bash
cd C:\Users\user\geomarketing-platform

git init
git add .
git commit -m "Initial commit: GeoMarketing Platform"
git branch -M main
git remote add origin https://github.com/seu-usuario/geomarketing-platform.git
git push -u origin main
```

✅ Código no GitHub!

---

## PASSO 3: VERCEL (10 minutos)

### 1️⃣ Acessar Vercel

```
https://vercel.com
↓
Clique em "Sign Up"
↓
Clique em "Continue with GitHub"
↓
Autorize Vercel
```

### 2️⃣ Importar Projeto

```
Clique em "Import Project"
↓
Cole a URL do repositório:
https://github.com/seu-usuario/geomarketing-platform
↓
Clique em "Continue"
```

### 3️⃣ Configurar Projeto

```
Project Name: geomarketing-platform
Framework Preset: Next.js
↓
Clique em "Continue"
```

### 4️⃣ Adicionar Variáveis de Ambiente

```
Environment Variables:

NEXT_PUBLIC_SUPABASE_URL = https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
DATABASE_URL = postgresql://postgres:senha@db.abcdefgh.supabase.co:5432/postgres
JWT_SECRET = sua-chave-secreta-aqui

↓
Clique em "Deploy"
```

### 5️⃣ Aguardar Deploy

```
Vercel vai compilar e fazer deploy
↓
Você verá o progresso em tempo real
↓
Quando terminar, clique em "Visit"
↓
✅ Plataforma no ar!
```

---

## 🎉 ACESSAR A PLATAFORMA

Sua plataforma estará em:

```
https://geomarketing-platform.vercel.app
```

### Fazer Login

```
Email: demo@example.com
Senha: demo123456
↓
Clique em "Entrar"
↓
✅ Você está no dashboard!
```

### Criar Nova Conta

```
Clique em "Criar conta"
↓
Preencha:
- Nome: Seu Nome
- Email: seu@email.com
- Empresa: Sua Empresa
- Senha: SenhaForte123!
↓
Clique em "Criar Conta"
↓
Faça login com suas credenciais
↓
✅ Você está no dashboard!
```

---

## 📊 FLUXO VISUAL

```
┌─────────────────────────────────────────────────────────┐
│  SUPABASE                                               │
│  ├─ Criar projeto                                       │
│  ├─ Obter credenciais                                   │
│  └─ Criar tabelas                                       │
│  ⏱️ 5 minutos                                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  GITHUB                                                 │
│  ├─ Criar repositório                                   │
│  └─ Fazer push do código                                │
│  ⏱️ 5 minutos                                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  VERCEL                                                 │
│  ├─ Conectar GitHub                                     │
│  ├─ Importar projeto                                    │
│  ├─ Adicionar variáveis                                 │
│  └─ Deploy automático                                   │
│  ⏱️ 10 minutos                                           │
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

## 🔑 CREDENCIAIS IMPORTANTES

### Supabase

```
Project URL: https://abcdefgh.supabase.co
Anon Key: eyJhbGc...
Database URL: postgresql://postgres:senha@db.abcdefgh.supabase.co:5432/postgres
```

### Vercel

```
Project URL: https://geomarketing-platform.vercel.app
GitHub: https://github.com/seu-usuario/geomarketing-platform
```

### Plataforma

```
Email de teste: demo@example.com
Senha de teste: demo123456
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] Criar conta no Supabase
- [ ] Criar projeto no Supabase
- [ ] Copiar credenciais
- [ ] Criar tabelas (SQL)
- [ ] Criar repositório no GitHub
- [ ] Fazer push do código
- [ ] Criar conta no Vercel
- [ ] Importar projeto
- [ ] Adicionar variáveis de ambiente
- [ ] Deploy
- [ ] Acessar plataforma
- [ ] Testar login
- [ ] Testar registro

---

## 🎯 RESULTADO

Você terá:

✅ **Plataforma online**
- Acessível em `https://geomarketing-platform.vercel.app`
- Qualquer pessoa pode acessar
- Funciona em qualquer dispositivo

✅ **Autenticação completa**
- Login com email e senha
- Registro de novos usuários
- Multi-tenancy

✅ **Banco de dados seguro**
- PostgreSQL no Supabase
- Backup automático
- Escalável

✅ **Deploy automático**
- Vercel faz deploy a cada push
- HTTPS automático
- Performance otimizada

---

## 🚀 PRÓXIMAS FUNCIONALIDADES

Agora que está no ar, você pode adicionar:

1. Importação de dados (Excel/CSV)
2. Mapa interativo (Mapbox)
3. Análise de zonas brancas
4. Priorização de visitas
5. Roteirização inteligente
6. Dashboards executivos

---

**Plataforma no ar em 30 minutos! 🎉**

---

**Desenvolvido com ❤️ por Verdent AI**
