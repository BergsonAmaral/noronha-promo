-- Fecha brechas de escalonamento de privilégio.

-- 1) O papel (role) só pode vir de raw_app_meta_data, que só a service_role
--    consegue gravar. raw_user_meta_data é controlado por quem se cadastra.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, nome, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce((new.raw_app_meta_data->>'role')::user_role, 'cliente'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 2) Ninguém além do admin altera o próprio role.
create or replace function proteger_role_profile()
returns trigger as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and auth_role() is distinct from 'admin' then
    raise exception 'Apenas o admin pode alterar o papel de um usuário.';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists proteger_role_profile on profiles;
create trigger proteger_role_profile
  before update on profiles
  for each row execute function proteger_role_profile();

-- 3) Parceiro não aprova a si mesmo nem mexe em vínculo/observações do admin.
create or replace function proteger_campos_parceiro()
returns trigger as $$
begin
  if auth.uid() is not null and auth_role() is distinct from 'admin' then
    if new.status is distinct from old.status
       or new.user_id is distinct from old.user_id
       or new.observacoes_admin is distinct from old.observacoes_admin then
      raise exception 'Apenas o admin pode alterar status, vínculo ou observações.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists proteger_campos_parceiro on parceiros;
create trigger proteger_campos_parceiro
  before update on parceiros
  for each row execute function proteger_campos_parceiro();

-- 4) Cliente não insere resgate direto: a compra passa por uma função que
--    define status e valor no servidor.
drop policy if exists "cliente cria resgate para si mesmo" on resgates;

create or replace function comprar_beneficio(p_beneficio_id uuid)
returns text as $$
declare
  v_preco numeric;
  v_codigo text;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado.';
  end if;

  select b.preco into v_preco
  from beneficios b
  join parceiros p on p.id = b.parceiro_id
  where b.id = p_beneficio_id
    and b.status = 'ativo'
    and p.status = 'aprovado'
    and (b.validade_fim is null or b.validade_fim >= current_date);

  if not found then
    raise exception 'Esse benefício não está mais disponível.';
  end if;

  insert into resgates (beneficio_id, cliente_id, status, valor_pago, pago_em)
  values (p_beneficio_id, auth.uid(), 'pago', v_preco, now())
  returning codigo into v_codigo;

  return v_codigo;
end;
$$ language plpgsql security definer set search_path = public;

revoke all on function comprar_beneficio(uuid) from public, anon;
grant execute on function comprar_beneficio(uuid) to authenticated;

-- 5) Limites básicos nos formulários anônimos (anti-lixo).
alter table leads
  add constraint leads_tamanho check (char_length(nome) <= 120 and char_length(email) <= 200) not valid;
alter table parceiros
  add constraint parceiros_tamanho check (
    char_length(nome_negocio) <= 120 and char_length(coalesce(descricao, '')) <= 1000
  ) not valid;
