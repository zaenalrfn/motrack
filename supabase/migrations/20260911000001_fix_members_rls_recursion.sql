create or replace function public.get_user_households()
returns setof uuid
language sql
security definer
set search_path = public
set row_security = off
as $$
  select household_id
  from public.members
  where user_id = auth.uid()
    and status = 'active';
$$;

create or replace function public.is_active_household_member(p_household_id uuid)
returns boolean
language sql
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.members
    where household_id = p_household_id
      and user_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_active_household_admin(p_household_id uuid)
returns boolean
language sql
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.members
    where household_id = p_household_id
      and user_id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.is_member_in_user_household(p_member_id uuid)
returns boolean
language sql
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.members target_member
    where target_member.id = p_member_id
      and public.is_active_household_member(target_member.household_id)
  );
$$;

revoke all on function public.get_user_households() from public;
revoke all on function public.is_active_household_member(uuid) from public;
revoke all on function public.is_active_household_admin(uuid) from public;
revoke all on function public.is_member_in_user_household(uuid) from public;
grant execute on function public.get_user_households() to anon, authenticated;
grant execute on function public.is_active_household_member(uuid) to anon, authenticated;
grant execute on function public.is_active_household_admin(uuid) to anon, authenticated;
grant execute on function public.is_member_in_user_household(uuid) to anon, authenticated;

drop policy if exists "Admins can update households" on public.households;
drop policy if exists "View members in same household" on public.members;
drop policy if exists "Admins can manage members" on public.members;
drop policy if exists "Admins can manage categories" on public.categories;
drop policy if exists "Admins can manage budgets" on public.budgets;
drop policy if exists "View budget visibility grants" on public.budget_visibility_grants;
drop policy if exists "Admins can manage budget visibility grants" on public.budget_visibility_grants;
drop policy if exists "View join requests" on public.household_join_requests;
drop policy if exists "Admins can update join requests" on public.household_join_requests;

create policy "Admins can update households"
  on public.households for update
  using (public.is_active_household_admin(id))
  with check (public.is_active_household_admin(id));

create policy "View members in same household"
  on public.members for select
  using (
    household_id in (select public.get_user_households())
    or user_id = auth.uid()
  );

create policy "Admins can insert members"
  on public.members for insert
  with check (public.is_active_household_admin(household_id));

create policy "Admins can update members"
  on public.members for update
  using (public.is_active_household_admin(household_id))
  with check (public.is_active_household_admin(household_id));

create policy "Admins can delete members"
  on public.members for delete
  using (public.is_active_household_admin(household_id));

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_active_household_admin(household_id))
  with check (public.is_active_household_admin(household_id));

create policy "Admins can manage budgets"
  on public.budgets for all
  using (
    exists (
      select 1
      from public.categories category
      where category.id = category_id
        and public.is_active_household_admin(category.household_id)
    )
  )
  with check (
    exists (
      select 1
      from public.categories category
      where category.id = category_id
        and public.is_active_household_admin(category.household_id)
    )
  );

create policy "View budget visibility grants"
  on public.budget_visibility_grants for select
  using (public.is_member_in_user_household(member_id));

create policy "Admins can manage budget visibility grants"
  on public.budget_visibility_grants for all
  using (
    exists (
      select 1
      from public.members target_member
      where target_member.id = member_id
        and public.is_active_household_admin(target_member.household_id)
    )
  )
  with check (
    exists (
      select 1
      from public.members target_member
      where target_member.id = member_id
        and public.is_active_household_admin(target_member.household_id)
    )
  );

create policy "View join requests"
  on public.household_join_requests for select
  using (
    user_id = auth.uid()
    or public.is_active_household_admin(household_id)
  );

create policy "Admins can update join requests"
  on public.household_join_requests for update
  using (public.is_active_household_admin(household_id))
  with check (public.is_active_household_admin(household_id));
