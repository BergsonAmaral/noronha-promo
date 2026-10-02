-- Valor "de tabela" do serviço antes do desconto, pra mostrar
-- "de R$ X por R$ Y (-Z%)" nos cards de cupom.
alter table beneficios add column valor_original numeric(10,2);
