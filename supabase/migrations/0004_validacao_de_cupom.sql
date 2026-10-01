-- Funções usadas pelo portal do parceiro para escanear/validar e dar
-- baixa em cupons (resgates). Ficam como funções SECURITY DEFINER com
-- lock de linha (for update) para a baixa ser atômica — dois scans
-- simultâneos do mesmo cupom nunca passam os dois.

-- Consulta um cupom pelo código (sem alterar nada) — usada para
-- mostrar os detalhes antes de confirmar a baixa.
create or replace function consultar_cupom(p_codigo text)
returns table (
  resgate_id uuid,
  status resgate_status,
  beneficio_titulo text,
  tipo_desconto tipo_desconto,
  valor_desconto numeric,
  cliente_nome text,
  resgatado_em timestamptz,
  utilizado_em timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parceiro_id uuid;
begin
  select id into v_parceiro_id from parceiros where user_id = auth.uid();
  if v_parceiro_id is null then
    raise exception 'Usuário autenticado não é um parceiro.';
  end if;

  return query
  select
    r.id,
    r.status,
    b.titulo,
    b.tipo_desconto,
    b.valor_desconto,
    p.nome,
    r.resgatado_em,
    r.utilizado_em
  from resgates r
  join beneficios b on b.id = r.beneficio_id
  join profiles p on p.id = r.cliente_id
  where r.codigo = upper(p_codigo)
    and b.parceiro_id = v_parceiro_id;
end;
$$;

-- Dá baixa no cupom. Só funciona se: o parceiro autenticado for dono
-- do benefício, e o cupom estiver com status 'pago'. Usa lock de linha
-- (for update) para ser atômica.
create or replace function usar_cupom(p_codigo text)
returns table (
  sucesso boolean,
  mensagem text,
  beneficio_titulo text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parceiro_id uuid;
  v_resgate resgates%rowtype;
  v_titulo text;
begin
  select id into v_parceiro_id from parceiros where user_id = auth.uid();
  if v_parceiro_id is null then
    return query select false, 'Usuário autenticado não é um parceiro.', null::text;
    return;
  end if;

  select r.* into v_resgate
  from resgates r
  join beneficios b on b.id = r.beneficio_id
  where r.codigo = upper(p_codigo) and b.parceiro_id = v_parceiro_id
  for update of r;

  if v_resgate.id is null then
    return query select false, 'Cupom não encontrado para este parceiro.', null::text;
    return;
  end if;

  select b.titulo into v_titulo from beneficios b where b.id = v_resgate.beneficio_id;

  if v_resgate.status = 'utilizado' then
    return query select
      false,
      'Este cupom já foi utilizado em ' || to_char(v_resgate.utilizado_em, 'DD/MM/YYYY HH24:MI') || '.',
      v_titulo;
    return;
  end if;

  if v_resgate.status <> 'pago' then
    return query select false, 'Cupom não está válido para uso (status: ' || v_resgate.status || ').', v_titulo;
    return;
  end if;

  update resgates
  set status = 'utilizado', utilizado_em = now()
  where id = v_resgate.id;

  return query select true, 'Cupom validado com sucesso!', v_titulo;
end;
$$;

grant execute on function consultar_cupom(text) to authenticated;
grant execute on function usar_cupom(text) to authenticated;

-- Faltava uma policy pro admin poder criar resgates manualmente
-- (usado para gerar cupons de teste antes do portal do cliente existir).
create policy "admin cria resgates" on resgates
  for insert with check (auth_role() = 'admin');
