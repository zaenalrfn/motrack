-- Read-only view for displaying active household members with their auth email.
-- The view exposes only the fields required by the member list.
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
  u.email
from public.members m
join auth.users u on u.id = m.user_id
where m.status = 'active';

-- The view joins auth.users, so the API role needs read access to the email source.
grant usage on schema auth to authenticated;
grant select on table auth.users to authenticated;
grant select on public.active_household_members to authenticated;
