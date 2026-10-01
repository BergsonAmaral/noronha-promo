-- Corrige o trigger de criação de perfil: sem search_path fixo, a função
-- pode não enxergar a tabela `profiles` nem o tipo `user_role` quando
-- executada pelo serviço de Auth, causando "Database error creating new user".

alter function handle_new_user() set search_path = public;
