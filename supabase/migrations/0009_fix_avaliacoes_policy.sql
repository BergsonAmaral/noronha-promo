-- A policy de insert da 0008 só checava "o cliente tem algum resgate
-- utilizado", sem garantir que esse resgate é de um benefício do MESMO
-- parceiro que está sendo avaliado. Corrige para casar parceiro_id.
drop policy "cliente avalia cupom proprio ja utilizado" on avaliacoes;

create policy "cliente avalia cupom proprio ja utilizado" on avaliacoes
  for insert with check (
    cliente_id = auth.uid()
    and resgate_id in (
      select r.id
      from resgates r
      join beneficios b on b.id = r.beneficio_id
      where r.cliente_id = auth.uid()
        and r.status = 'utilizado'
        and b.parceiro_id = avaliacoes.parceiro_id
    )
  );
