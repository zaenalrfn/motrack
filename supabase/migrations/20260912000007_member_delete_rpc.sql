create or replace function public.delete_household_member(
  p_member_id uuid,
  p_mode text
)
returns void
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  target_member public.members;
  caller_admin public.members;
begin
  if p_mode not in ('soft', 'permanent') then
    raise exception 'Invalid delete mode';
  end if;

  select * into caller_admin
  from public.members
  where user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  limit 1;

  if caller_admin.id is null then
    raise exception 'Only an active household admin can delete members';
  end if;

  select * into target_member
  from public.members
  where id = p_member_id
    and household_id = caller_admin.household_id
  for update;

  if target_member.id is null then
    raise exception 'Member tidak ditemukan pada household admin';
  end if;

  if target_member.id = caller_admin.id or target_member.role = 'admin' then
    raise exception 'Admin household tidak dapat dihapus dari menu ini';
  end if;

  if p_mode = 'soft' then
    update public.members
    set status = 'removed'
    where id = target_member.id;

    return;
  end if;

  delete from public.budget_visibility_grants where member_id = target_member.id;
  delete from public.transactions where created_by = target_member.id;
  delete from public.members where id = target_member.id;
  delete from auth.users where id = target_member.user_id;
end;
$$;

revoke all on function public.delete_household_member(uuid, text) from public;
grant execute on function public.delete_household_member(uuid, text) to authenticated;
