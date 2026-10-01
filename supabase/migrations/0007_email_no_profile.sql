-- Guarda o e-mail no profile também (só existe em auth.users por padrão)
-- para o admin conseguir listar clientes/parceiros com e-mail sem precisar
-- da Admin API.
alter table profiles add column email text;

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, nome, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'cliente'),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

update profiles p set email = u.email from auth.users u where u.id = p.id and p.email is null;
