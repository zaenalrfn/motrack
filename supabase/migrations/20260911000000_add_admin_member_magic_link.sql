create or replace function public.create_member_account_record(
  p_household_id uuid,
  p_user_id uuid,
  p_name text,
  p_role text
)
returns public.members
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin public.members;
  v_member public.members;
  v_active_count integer;
begin
  select *
  into v_admin
  from public.members
  where household_id = p_household_id
    and user_id = auth.uid()
    and role = 'admin'
    and status = 'active'
  for update;

  if v_admin.id is null then
    raise exception 'Only an active household admin can create members';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Member name is required';
  end if;

  if p_role not in ('member', 'admin') then
    raise exception 'Invalid member role';
  end if;

  select count(*)
  into v_active_count
  from public.members
  where household_id = p_household_id
    and status = 'active';

  select *
  into v_member
  from public.members
  where household_id = p_household_id
    and user_id = p_user_id
  for update;

  if v_member.id is not null and v_member.status = 'active' then
    raise exception 'This user is already an active household member';
  end if;

  if v_member.id is null and v_active_count >= 6 then
    raise exception 'Household capacity is full';
  end if;

  if v_member.id is null then
    insert into public.members (household_id, user_id, name, role, status)
    values (p_household_id, p_user_id, trim(p_name), p_role, 'active')
    returning * into v_member;
  else
    update public.members
    set name = trim(p_name),
        role = p_role,
        status = 'active'
    where id = v_member.id
    returning * into v_member;
  end if;

  insert into public.system_logs (household_id, action, performed_by, details)
  values (
    p_household_id,
    'CREATE_MEMBER_ACCOUNT',
    v_admin.id,
    jsonb_build_object('member_id', v_member.id, 'role', v_member.role)
  );

  return v_member;
end;
$$;

revoke all on function public.create_member_account_record(uuid, uuid, text, text) from public;
grant execute on function public.create_member_account_record(uuid, uuid, text, text) to authenticated;
