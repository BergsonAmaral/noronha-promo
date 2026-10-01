# Noronha Promo — Admin

Portal administrativo (Next.js + Supabase).

## Como rodar localmente

1. Copie `.env.local.example` para `.env.local` e preencha com os dados do
   projeto Supabase (Project Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Rode a migração do banco (`../supabase/migrations/0001_init.sql`) no
   SQL Editor do painel Supabase, ou via CLI:
   ```bash
   supabase link --project-ref <seu-project-ref>
   supabase db push
   ```

3. Crie o primeiro usuário admin:
   - Crie um usuário normal pelo painel do Supabase (Authentication → Add user)
   - No SQL Editor, rode:
     ```sql
     update profiles set role = 'admin' where id = '<uuid-do-usuario>';
     ```

4. Instale e rode:
   ```bash
   npm install
   npm run dev
   ```

## Estrutura

- `/login` — autenticação
- `/dashboard` — visão geral
- `/dashboard/categorias` — categorias de benefícios
- `/dashboard/parceiros` — aprovação de negócios parceiros
- `/dashboard/beneficios` — cupons/descontos cadastrados
- `/dashboard/leads` — cadastros do formulário público ("Entre na lista do clube")
- `/dashboard/solicitacoes` — pedidos de parceria do site público
