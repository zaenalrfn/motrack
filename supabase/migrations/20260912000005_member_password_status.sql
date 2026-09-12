-- Expose only whether an active member has completed password setup.
-- The password hash itself is never exposed to the client.
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
  (u.encrypted_password is not null and length(u.encrypted_password) > 0) as has_password
from public.members m
join auth.users u on u.id = m.user_id
where m.status = 'active';

grant select on public.active_household_members to authenticated;
