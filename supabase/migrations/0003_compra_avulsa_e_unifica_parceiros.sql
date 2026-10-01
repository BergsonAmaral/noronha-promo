-- 1) Benefícios passam a ter preço — o cliente compra o cupom avulso.
alter table beneficios add column preco numeric(10,2) not null default 0;
comment on column beneficios.preco is 'Valor que o cliente paga para gerar o cupom deste benefício (0 = gratuito).';

-- 2) Resgates ganham estado de pagamento (gateway ainda não escolhido —
--    o fluxo de checkout em si vem depois, mas o dado já fica certo).
alter type resgate_status rename to resgate_status_old;
create type resgate_status as enum (
  'aguardando_pagamento',
  'pago',
  'utilizado',
  'expirado',
  'cancelado'
);
alter table resgates alter column status drop default;
alter table resgates
  alter column status type resgate_status
  using (
    case status::text
      when 'ativo' then 'pago'
      else status::text
    end
  )::resgate_status;
alter table resgates alter column status set default 'aguardando_pagamento';
drop type resgate_status_old;

alter table resgates add column valor_pago numeric(10,2);
alter table resgates add column pago_em timestamptz;

-- 3) Unifica parceiros + solicitações de parceria numa coisa só:
--    toda solicitação do site vira direto uma linha em `parceiros`
--    com status 'pendente' (sem precisar de uma segunda tabela/tela
--    pra revisar praticamente a mesma coisa).
insert into parceiros (nome_negocio, email, telefone, status, observacoes_admin, created_at)
select
  nome_negocio,
  email,
  telefone,
  status,
  concat_ws(
    ' · ',
    'Responsável: ' || responsavel,
    case when categoria_sugerida is not null then 'Categoria sugerida: ' || categoria_sugerida end,
    mensagem
  ),
  created_at
from solicitacoes_parceiro
where not exists (
  select 1 from parceiros p where p.email = solicitacoes_parceiro.email
);

drop table solicitacoes_parceiro;

-- O formulário "Seja um parceiro" do site agora insere direto em
-- `parceiros`. Garante que o público (anon) pode criar sua própria
-- solicitação, mas só como 'pendente' e sem se autoaprovar.
create policy "qualquer um pode solicitar parceria" on parceiros
  for insert
  with check (status = 'pendente' and user_id is null);
