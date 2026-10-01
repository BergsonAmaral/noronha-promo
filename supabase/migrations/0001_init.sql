-- Noronha Promo — schema inicial
-- Cobre os 3 portais: cliente, parceiro e admin.

create extension if not exists "pgcrypto";

-- =========================================================
-- ENUMS
-- =========================================================
create type user_role as enum ('cliente', 'parceiro', 'admin');
create type parceiro_status as enum ('pendente', 'aprovado', 'rejeitado', 'inativo');
create type beneficio_status as enum ('ativo', 'pausado', 'expirado');
create type tipo_desconto as enum ('percentual', 'valor_fixo', 'outro');
create type resgate_status as enum ('ativo', 'utilizado', 'expirado', 'cancelado');
create type assinatura_status as enum ('ativa', 'cancelada', 'expirada', 'pendente');

-- =========================================================
-- PROFILES (estende auth.users)
-- =========================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'cliente',
  nome text not null,
  telefone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cria o profile automaticamente quando um usuário se cadastra
create function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, nome, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'cliente')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =========================================================
-- CATEGORIAS
-- =========================================================
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  icone text not null default 'compass', -- nome do ícone lucide
  ordem int not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- PARCEIROS (negócios locais)
-- =========================================================
create table parceiros (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  categoria_id uuid references categorias(id) on delete set null,
  nome_negocio text not null,
  descricao text,
  telefone text,
  whatsapp text,
  email text,
  instagram text,
  endereco text,
  logo_url text,
  status parceiro_status not null default 'pendente',
  observacoes_admin text, -- motivo de rejeição, notas internas
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- BENEFÍCIOS / CUPONS
-- =========================================================
create table beneficios (
  id uuid primary key default gen_random_uuid(),
  parceiro_id uuid not null references parceiros(id) on delete cascade,
  categoria_id uuid references categorias(id) on delete set null,
  titulo text not null,
  descricao text,
  tipo_desconto tipo_desconto not null default 'percentual',
  valor_desconto numeric(10,2),
  condicoes text,
  imagem_url text,
  validade_inicio date,
  validade_fim date,
  limite_resgates int, -- null = ilimitado
  status beneficio_status not null default 'ativo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- PLANOS do clube (para o portal do cliente)
-- =========================================================
create table planos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  preco numeric(10,2) not null default 0,
  periodicidade text not null default 'mensal', -- mensal | anual | vitalicio
  ativo boolean not null default true,
  ordem int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- ASSINATURAS (cliente <-> plano)
-- =========================================================
create table assinaturas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references profiles(id) on delete cascade,
  plano_id uuid not null references planos(id) on delete restrict,
  status assinatura_status not null default 'pendente',
  data_inicio date,
  data_fim date,
  created_at timestamptz not null default now()
);

-- =========================================================
-- RESGATES (cupons ativados pelo cliente)
-- =========================================================
create table resgates (
  id uuid primary key default gen_random_uuid(),
  beneficio_id uuid not null references beneficios(id) on delete cascade,
  cliente_id uuid not null references profiles(id) on delete cascade,
  codigo text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  status resgate_status not null default 'ativo',
  resgatado_em timestamptz not null default now(),
  utilizado_em timestamptz
);

-- =========================================================
-- LEADS (formulário "Entre na lista do clube" do site público)
-- =========================================================
create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  consentimento boolean not null default false,
  origem text default 'site', -- site | parceiros | etc
  created_at timestamptz not null default now()
);

-- =========================================================
-- PEDIDOS DE PARCERIA (formulário "Seja um parceiro" do site público)
-- =========================================================
create table solicitacoes_parceiro (
  id uuid primary key default gen_random_uuid(),
  nome_negocio text not null,
  responsavel text not null,
  email text not null,
  telefone text,
  categoria_sugerida text,
  mensagem text,
  status parceiro_status not null default 'pendente',
  created_at timestamptz not null default now()
);

-- =========================================================
-- updated_at automático
-- =========================================================
create function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on profiles for each row execute function set_updated_at();
create trigger trg_parceiros_updated before update on parceiros for each row execute function set_updated_at();
create trigger trg_beneficios_updated before update on beneficios for each row execute function set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table profiles enable row level security;
alter table categorias enable row level security;
alter table parceiros enable row level security;
alter table beneficios enable row level security;
alter table planos enable row level security;
alter table assinaturas enable row level security;
alter table resgates enable row level security;
alter table leads enable row level security;
alter table solicitacoes_parceiro enable row level security;

-- Helper: papel do usuário autenticado
create function auth_role()
returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable security definer;

-- Helper: id do parceiro vinculado ao usuário autenticado
create function auth_parceiro_id()
returns uuid as $$
  select id from parceiros where user_id = auth.uid();
$$ language sql stable security definer;

-- ---------- profiles ----------
create policy "usuário vê o próprio perfil" on profiles
  for select using (id = auth.uid() or auth_role() = 'admin');
create policy "usuário edita o próprio perfil" on profiles
  for update using (id = auth.uid() or auth_role() = 'admin');

-- ---------- categorias ----------
create policy "categorias ativas são públicas" on categorias
  for select using (ativo = true or auth_role() = 'admin');
create policy "admin gerencia categorias" on categorias
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ---------- parceiros ----------
create policy "parceiros aprovados são públicos" on parceiros
  for select using (
    status = 'aprovado' or user_id = auth.uid() or auth_role() = 'admin'
  );
create policy "parceiro edita o próprio negócio" on parceiros
  for update using (user_id = auth.uid() or auth_role() = 'admin');
create policy "admin gerencia parceiros" on parceiros
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ---------- beneficios ----------
create policy "beneficios ativos são públicos" on beneficios
  for select using (
    status = 'ativo'
    or auth_role() = 'admin'
    or parceiro_id = auth_parceiro_id()
  );
create policy "parceiro gerencia seus beneficios" on beneficios
  for all using (
    parceiro_id = auth_parceiro_id() or auth_role() = 'admin'
  ) with check (
    parceiro_id = auth_parceiro_id() or auth_role() = 'admin'
  );

-- ---------- planos ----------
create policy "planos ativos são públicos" on planos
  for select using (ativo = true or auth_role() = 'admin');
create policy "admin gerencia planos" on planos
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ---------- assinaturas ----------
create policy "cliente vê a própria assinatura" on assinaturas
  for select using (cliente_id = auth.uid() or auth_role() = 'admin');
create policy "admin gerencia assinaturas" on assinaturas
  for all using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ---------- resgates ----------
create policy "cliente vê os próprios resgates" on resgates
  for select using (
    cliente_id = auth.uid()
    or auth_role() = 'admin'
    or beneficio_id in (select id from beneficios where parceiro_id = auth_parceiro_id())
  );
create policy "cliente cria resgate para si mesmo" on resgates
  for insert with check (cliente_id = auth.uid());
create policy "admin gerencia resgates" on resgates
  for update using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- ---------- leads (formulário público) ----------
create policy "qualquer um pode se cadastrar na lista" on leads
  for insert with check (true);
create policy "admin vê os leads" on leads
  for select using (auth_role() = 'admin');

-- ---------- solicitacoes_parceiro (formulário público) ----------
create policy "qualquer um pode solicitar parceria" on solicitacoes_parceiro
  for insert with check (true);
create policy "admin vê as solicitações" on solicitacoes_parceiro
  for select using (auth_role() = 'admin');
create policy "admin atualiza solicitações" on solicitacoes_parceiro
  for update using (auth_role() = 'admin') with check (auth_role() = 'admin');

-- =========================================================
-- SEED: categorias iniciais (as mesmas do site público)
-- =========================================================
insert into categorias (nome, slug, icone, ordem) values
  ('Hospedagem', 'hospedagem', 'bed-double', 1),
  ('Gastronomia', 'gastronomia', 'utensils', 2),
  ('Passeios', 'passeios', 'compass', 3),
  ('Mergulho', 'mergulho', 'waves', 4),
  ('Carros e buggys', 'mobilidade', 'car', 5),
  ('Equipamentos', 'equipamentos', 'camera', 6),
  ('Transfers', 'transfer', 'car', 7),
  ('Trilhas', 'trilhas', 'compass', 8),
  ('Surf', 'surf', 'waves', 9),
  ('Lojas locais', 'compras', 'store', 10),
  ('Fotografia', 'fotografia', 'camera', 11),
  ('Bem-estar', 'bem-estar', 'heart', 12),
  ('Entretenimento', 'entretenimento', 'ticket', 13),
  ('A dois', 'romantico', 'heart', 14);
