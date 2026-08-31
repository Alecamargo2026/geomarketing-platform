# ⚡ QUICK START - COMEÇAR EM 5 MINUTOS

## 1️⃣ Clonar Projeto

```bash
cd C:\Users\user\geomarketing-platform
```

## 2️⃣ Instalar Dependências

```bash
npm install
```

## 3️⃣ Criar .env.local

```bash
cp .env.example .env.local
```

Edite `.env.local` com:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
DATABASE_URL=postgresql://postgres:senha@db.seu-projeto.supabase.co:5432/postgres
JWT_SECRET=sua-chave-secreta-aqui
```

## 4️⃣ Testar Localmente

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 5️⃣ Credenciais de Teste

```
Email: demo@example.com
Senha: demo123456
```

---

## 🚀 DEPLOY NO VERCEL

1. Fazer push para GitHub
2. Conectar ao Vercel
3. Adicionar variáveis de ambiente
4. Deploy automático

---

## 📚 GUIAS COMPLETOS

- **README.md** - Guia de uso
- **SETUP_SUPABASE_VERCEL.md** - Setup passo-a-passo
- **SISTEMA_CRIADO.md** - O que foi criado

---

**Pronto! 🎉**
