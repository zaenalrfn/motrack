-- Explicit transaction policies for the shared household ledger.
alter table public.transactions enable row level security;

drop policy if exists "View transactions in household" on public.transactions;
drop policy if exists "Members can insert transactions in household" on public.transactions;
drop policy if exists "Members can update/delete transactions" on public.transactions;
drop policy if exists "Members can delete transactions" on public.transactions;

create policy "Active members can view household transactions"
  on public.transactions for select
  using (household_id in (select public.get_user_households()));

create policy "Active members can insert household transactions"
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
  );

create policy "Active members can update household transactions"
  on public.transactions for update
  using (household_id in (select public.get_user_households()))
  with check (household_id in (select public.get_user_households()));

create policy "Active members can delete household transactions"
  on public.transactions for delete
  using (household_id in (select public.get_user_households()));
