-- Avaliação (estrelas + comentário) que o cliente deixa para o parceiro,
-- sempre amarrada a um cupom que ele realmente utilizou (resgate_id),
-- pra evitar avaliação de quem nunca usou o serviço.
create table avaliacoes (
  id uuid primary key default gen_random_uuid(),
  parceiro_id uuid not null references parceiros(id) on delete cascade,
  cliente_id uuid not null references profiles(id) on delete cascade,
  resgate_id uuid references resgates(id) on delete set null,
  nota smallint not null check (nota between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  unique (resgate_id)
);

create index avaliacoes_parceiro_id_idx on avaliacoes (parceiro_id);

alter table avaliacoes enable row level security;

create policy "avaliacoes sao publicas" on avaliacoes
  for select using (true);

create policy "cliente avalia cupom proprio ja utilizado" on avaliacoes
  for insert with check (
    cliente_id = auth.uid()
    and resgate_id in (
      select id from resgates where cliente_id = auth.uid() and status = 'utilizado'
    )
  );

create policy "cliente edita a propria avaliacao" on avaliacoes
  for update using (cliente_id = auth.uid() or auth_role() = 'admin')
  with check (cliente_id = auth.uid() or auth_role() = 'admin');

create policy "cliente ou admin exclui avaliacao" on avaliacoes
  for delete using (cliente_id = auth.uid() or auth_role() = 'admin');
