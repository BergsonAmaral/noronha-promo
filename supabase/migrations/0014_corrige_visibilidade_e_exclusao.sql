-- Benefício só é público se o parceiro estiver aprovado.
drop policy if exists "beneficios ativos são públicos" on beneficios;
create policy "beneficios ativos são públicos" on beneficios
  for select using (
    (status = 'ativo' and exists (
      select 1 from parceiros p where p.id = beneficios.parceiro_id and p.status = 'aprovado'
    ))
    or auth_role() = 'admin'
    or parceiro_id = auth_parceiro_id()
  );

-- Excluir benefício (ou parceiro, em cascata) apagaria cupons já vendidos.
create or replace function bloquear_exclusao_com_resgates()
returns trigger as $$
begin
  if exists (select 1 from resgates where beneficio_id = old.id) then
    raise exception 'Este benefício já tem cupons vendidos. Pause-o em vez de excluir.';
  end if;
  return old;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists bloquear_exclusao_com_resgates on beneficios;
create trigger bloquear_exclusao_com_resgates
  before delete on beneficios
  for each row execute function bloquear_exclusao_com_resgates();
