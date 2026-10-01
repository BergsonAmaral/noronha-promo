-- Permite que o parceiro veja o nome (perfil) dos clientes que resgataram
-- um cupom de algum dos seus benefícios — necessário para o histórico de
-- cupons validados mostrar "quem" usou o cupom.
create policy "parceiro vê perfil de clientes com resgates" on profiles
  for select using (
    auth_role() = 'parceiro'
    and id in (
      select cliente_id from resgates
      where beneficio_id in (
        select id from beneficios where parceiro_id = auth_parceiro_id()
      )
    )
  );
