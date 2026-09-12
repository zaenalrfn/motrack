-- Explicit policies for the budget and category CRUD used by the Anggaran menu.
-- These policies keep all writes restricted to active household admins.

alter table public.categories enable row level security;
alter table public.budgets enable row level security;

drop policy if exists "View categories in household" on public.categories;
drop policy if exists "Admins can manage categories" on public.categories;
drop policy if exists "View budgets in household" on public.budgets;
drop policy if exists "Admins can manage budgets" on public.budgets;

create policy "View categories in active household"
  on public.categories for select
  using (household_id in (select public.get_user_households()));

create policy "Admins can insert categories"
  on public.categories for insert
  with check (public.is_active_household_admin(household_id));

create policy "Admins can update categories"
  on public.categories for update
  using (public.is_active_household_admin(household_id))
  with check (public.is_active_household_admin(household_id));

create policy "Admins can delete categories"
  on public.categories for delete
  using (public.is_active_household_admin(household_id));

create policy "View budgets in active household"
  on public.budgets for select
  using (
    exists (
      select 1
      from public.categories category
      where category.id = budgets.category_id
        and category.household_id in (select public.get_user_households())
    )
  );

create policy "Admins can insert budgets"
  on public.budgets for insert
  with check (
    exists (
      select 1
      from public.categories category
      where category.id = budgets.category_id
        and public.is_active_household_admin(category.household_id)
    )
  );

create policy "Admins can update budgets"
  on public.budgets for update
  using (
    exists (
      select 1
      from public.categories category
      where category.id = budgets.category_id
        and public.is_active_household_admin(category.household_id)
    )
  )
  with check (
    exists (
      select 1
      from public.categories category
      where category.id = budgets.category_id
        and public.is_active_household_admin(category.household_id)
    )
  );

create policy "Admins can delete budgets"
  on public.budgets for delete
  using (
    exists (
      select 1
      from public.categories category
      where category.id = budgets.category_id
        and public.is_active_household_admin(category.household_id)
    )
  );
