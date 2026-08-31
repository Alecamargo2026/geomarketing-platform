# 📋 INSTRUÇÕES: COMO PREENCHER .env.local

## PASSO 1: Criar arquivo .env.local

Na pasta `C:\Users\user\geomarketing-platform\`, crie um arquivo chamado `.env.local`

## PASSO 2: Copiar conteúdo

Copie este conteúdo para o arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
DATABASE_URL=postgresql://postgres:sua-senha@db.seu-projeto.supabase.co:5432/postgres
JWT_SECRET=sua-chave-secreta-super-segura-aqui
NODE_ENV=development
```

## PASSO 3: Preencher com suas credenciais

Substitua:
- `seu-projeto` → seu projeto do Supabase
- `sua-chave-anonima-aqui` → sua chave pública do Supabase
- `sua-senha` → sua senha do banco de dados
- `sua-chave-secreta-super-segura-aqui` → uma chave aleatória

## PASSO 4: Salvar

Salve o arquivo `.env.local`

## PASSO 5: Testar

```bash
npm run dev
```

Acesse: http://localhost:3000

---

**Pronto! Agora você pode testar localmente enquanto faz o setup do Supabase.**
