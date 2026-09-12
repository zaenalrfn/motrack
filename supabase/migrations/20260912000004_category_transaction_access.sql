-- Use budget_visibility_grants as the per-member category transaction access table.
create or replace function public.can_create_transaction_in_category(p_category_id uuid)
returns boolean
language sql
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.members current_member
    join public.categories category
      on category.id = p_category_id
     and category.household_id = current_member.household_id
    where current_member.user_id = auth.uid()
      and current_member.status = 'active'
      and (
        current_member.role = 'admin'
        or exists (
          select 1
          from public.budget_visibility_grants access_grant
          where access_grant.member_id = current_member.id
            and access_grant.category_id = p_category_id
        )
      )
  );
$$;

revoke all on function public.can_create_transaction_in_category(uuid) from public;
grant execute on function public.can_create_transaction_in_category(uuid) to authenticated;

drop policy if exists "View budget visibility grants" on public.budget_visibility_grants;
drop policy if exists "Admins can manage budget visibility grants" on public.budget_visibility_grants;

grant select on public.budget_visibility_grants to authenticated;

create policy "Members can view household category grants"
  on public.budget_visibility_grants for select
  using (public.is_member_in_user_household(member_id));

create policy "Admins can insert category grants"
  on public.budget_visibility_grants for insert
  with check (
    exists (
      select 1
      from public.members target_member
      join public.categories category
        on category.id = budget_visibility_grants.category_id
       and category.household_id = target_member.household_id
      where target_member.id = budget_visibility_grants.member_id
        and public.is_active_household_admin(target_member.household_id)
    )
  );

create policy "Admins can delete category grants"
  on public.budget_visibility_grants for delete
  using (
    exists (
      select 1
      from public.members target_member
      join public.categories category
        on category.id = budget_visibility_grants.category_id
       and category.household_id = target_member.household_id
      where target_member.id = budget_visibility_grants.member_id
        and public.is_active_household_admin(target_member.household_id)
    )
  );

drop policy if exists "Active members can insert household transactions" on public.transactions;
drop policy if exists "Active members can insert permitted transactions" on public.transactions;

create policy "Active members can insert permitted transactions"
  on public.transactions for insert
  with check (
    household_id in (select public.get_user_households())
    and exists (
      select 1
      from public.members creator
      where creator.id = transactions.created_by
        and creator.household_id = transactions.household_id
        and creator.user_id = auth.uid()
        and creator.status = 'active'
    )
    and public.can_create_transaction_in_category(category_id)
  );
