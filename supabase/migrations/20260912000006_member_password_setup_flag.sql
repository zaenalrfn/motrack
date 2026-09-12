-- Track activation explicitly instead of inferring it from auth.users.encrypted_password.
create or replace view public.active_household_members
with (security_invoker = false)
as
select
  m.id,
  m.household_id,
  m.user_id,
  m.name,
  m.role,
  m.status,
  m.created_at,
  u.email,
  coalesce((u.raw_user_meta_data ->> 'password_setup_completed')::boolean, false) as has_password
from public.members m
join auth.users u on u.id = m.user_id
where m.status = 'active';

grant select on public.active_household_members to authenticated;
