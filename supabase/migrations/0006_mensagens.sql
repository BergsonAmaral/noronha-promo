-- Chat 1:1 entre cada parceiro e o admin. Uma "conversa" = todas as
-- mensagens de um parceiro_id, misturando remetentes (parceiro ou admin).
create table mensagens (
  id uuid primary key default gen_random_uuid(),
  parceiro_id uuid not null references parceiros(id) on delete cascade,
  remetente_id uuid not null references profiles(id) on delete cascade,
  remetente_role user_role not null,
  mensagem text not null,
  lida boolean not null default false,
  created_at timestamptz not null default now()
);

create index mensagens_parceiro_id_idx on mensagens (parceiro_id, created_at);

alter table mensagens enable row level security;

create policy "ve mensagens do proprio negocio ou admin ve todas" on mensagens
  for select using (
    parceiro_id = auth_parceiro_id() or auth_role() = 'admin'
  );

create policy "parceiro envia mensagem no proprio negocio" on mensagens
  for insert with check (
    remetente_id = auth.uid()
    and remetente_role = 'parceiro'
    and parceiro_id = auth_parceiro_id()
  );

create policy "admin envia mensagem em qualquer negocio" on mensagens
  for insert with check (
    remetente_id = auth.uid()
    and remetente_role = 'admin'
    and auth_role() = 'admin'
  );

-- Permite marcar como lida (quem recebeu passa lida=true ao abrir a conversa).
create policy "marca mensagem como lida" on mensagens
  for update using (
    parceiro_id = auth_parceiro_id() or auth_role() = 'admin'
  ) with check (
    parceiro_id = auth_parceiro_id() or auth_role() = 'admin'
  );
