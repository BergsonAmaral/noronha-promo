-- Estoque (limite_resgates já existia), limite por cliente, validade no uso
-- do cupom e bucket de imagens.

alter table beneficios add column if not exists limite_por_cliente int check (limite_por_cliente > 0);

create or replace function comprar_beneficio(p_beneficio_id uuid)
returns text as $$
declare
  v_ben beneficios%rowtype;
  v_vendidos int;
  v_meus int;
  v_codigo text;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado.';
  end if;

  select b.* into v_ben
  from beneficios b
  join parceiros p on p.id = b.parceiro_id
  where b.id = p_beneficio_id
    and b.status = 'ativo'
    and p.status = 'aprovado'
    and (b.validade_inicio is null or b.validade_inicio <= current_date)
    and (b.validade_fim is null or b.validade_fim >= current_date)
  for update of b;

  if not found then
    raise exception 'Esse benefício não está mais disponível.';
  end if;

  select count(*) into v_vendidos from resgates
    where beneficio_id = p_beneficio_id and status <> 'cancelado';
  if v_ben.limite_resgates is not null and v_vendidos >= v_ben.limite_resgates then
    raise exception 'Esse benefício esgotou.';
  end if;

  select count(*) into v_meus from resgates
    where beneficio_id = p_beneficio_id and cliente_id = auth.uid() and status <> 'cancelado';
  if v_ben.limite_por_cliente is not null and v_meus >= v_ben.limite_por_cliente then
    raise exception 'Você já atingiu o limite de cupons deste benefício.';
  end if;

  insert into resgates (beneficio_id, cliente_id, status, valor_pago, pago_em)
  values (p_beneficio_id, auth.uid(), 'pago', v_ben.preco, now())
  returning codigo into v_codigo;

  return v_codigo;
end;
$$ language plpgsql security definer set search_path = public;

-- Contagem pública de cupons por benefício (cliente não enxerga resgates alheios).
create or replace function contagem_resgates()
returns table (beneficio_id uuid, vendidos bigint, meus bigint) as $$
  select r.beneficio_id,
         count(*) filter (where r.status <> 'cancelado'),
         count(*) filter (where r.status <> 'cancelado' and r.cliente_id = auth.uid())
  from resgates r
  group by r.beneficio_id;
$$ language sql stable security definer set search_path = public;

revoke all on function contagem_resgates() from public, anon;
grant execute on function contagem_resgates() to authenticated;

-- Cupom vencido não pode mais ser usado.
create or replace function usar_cupom(p_codigo text)
returns table (sucesso boolean, mensagem text, beneficio_titulo text)
language plpgsql security definer set search_path = public
as $$
declare
  v_parceiro_id uuid;
  v_resgate resgates%rowtype;
  v_titulo text;
  v_fim date;
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

  select b.titulo, b.validade_fim into v_titulo, v_fim from beneficios b where b.id = v_resgate.beneficio_id;

  if v_resgate.status = 'utilizado' then
    return query select false,
      'Este cupom já foi utilizado em ' || to_char(v_resgate.utilizado_em, 'DD/MM/YYYY HH24:MI') || '.',
      v_titulo;
    return;
  end if;

  if v_resgate.status <> 'pago' then
    return query select false, 'Cupom não está válido para uso (status: ' || v_resgate.status || ').', v_titulo;
    return;
  end if;

  if v_fim is not null and v_fim < current_date then
    return query select false, 'Este cupom venceu em ' || to_char(v_fim, 'DD/MM/YYYY') || '.', v_titulo;
    return;
  end if;

  update resgates set status = 'utilizado', utilizado_em = now() where id = v_resgate.id;

  return query select true, 'Cupom validado com sucesso!', v_titulo;
end;
$$;

grant execute on function usar_cupom(text) to authenticated;

-- Bucket público de imagens; cada usuário só grava na própria pasta.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('imagens', 'imagens', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy "imagens: leitura publica" on storage.objects
  for select using (bucket_id = 'imagens');
create policy "imagens: usuario envia na propria pasta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'imagens' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "imagens: usuario remove da propria pasta" on storage.objects
  for delete to authenticated
  using (bucket_id = 'imagens' and (storage.foldername(name))[1] = auth.uid()::text);
