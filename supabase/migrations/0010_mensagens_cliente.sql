-- Abre a tabela de mensagens para também servir de chat cliente <-> admin,
-- reaproveitando a mesma estrutura do chat parceiro <-> admin. Cada linha
-- pertence a exatamente uma conversa: ou de um parceiro, ou de um cliente.
alter table mensagens alter column parceiro_id drop not null;
alter table mensagens add column cliente_id uuid references profiles(id) on delete cascade;

alter table mensagens add constraint mensagens_uma_conversa_apenas check (
  (parceiro_id is not null and cliente_id is null)
  or (parceiro_id is null and cliente_id is not null)
);

create index mensagens_cliente_id_idx on mensagens (cliente_id, created_at);

-- Substitui as policies antigas (só pensavam em parceiro_id) por versões
-- que também cobrem cliente_id.
drop policy "ve mensagens do proprio negocio ou admin ve todas" on mensagens;
create policy "ve mensagens da propria conversa ou admin ve todas" on mensagens
  for select using (
    parceiro_id = auth_parceiro_id()
    or cliente_id = auth.uid()
    or auth_role() = 'admin'
  );

drop policy "parceiro envia mensagem no proprio negocio" on mensagens;
create policy "parceiro envia mensagem no proprio negocio" on mensagens
  for insert with check (
    remetente_id = auth.uid()
    and remetente_role = 'parceiro'
    and parceiro_id = auth_parceiro_id()
    and cliente_id is null
  );

create policy "cliente envia mensagem na propria conversa" on mensagens
  for insert with check (
    remetente_id = auth.uid()
    and remetente_role = 'cliente'
    and cliente_id = auth.uid()
    and parceiro_id is null
  );

drop policy "admin envia mensagem em qualquer negocio" on mensagens;
create policy "admin envia mensagem em qualquer conversa" on mensagens
  for insert with check (
    remetente_id = auth.uid()
    and remetente_role = 'admin'
    and auth_role() = 'admin'
  );

drop policy "marca mensagem como lida" on mensagens;
create policy "marca mensagem como lida" on mensagens
  for update using (
    parceiro_id = auth_parceiro_id()
    or cliente_id = auth.uid()
    or auth_role() = 'admin'
  ) with check (
    parceiro_id = auth_parceiro_id()
    or cliente_id = auth.uid()
    or auth_role() = 'admin'
  );
