-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Households Table
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Members Table (links auth.users to households with roles & status)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  role text not null check (role in ('admin', 'member')) default 'member',
  status text not null check (status in ('active', 'removed', 'pending')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_household_user unique (household_id, user_id)
);

-- 3. Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  is_custom boolean default false not null,
  description text,
  icon text,
  icon_bg text,
  icon_color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Budgets Table
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete cascade not null,
  month text not null, -- format YYYY-MM
  amount numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_category_month unique (category_id, month)
);

-- 5. Budget Visibility Grants Table (granular permission for non-admin members)
create table if not exists public.budget_visibility_grants (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references public.members(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_member_category_grant unique (member_id, category_id)
);

-- 6. Transactions Table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric not null,
  type text not null check (type in ('income', 'expense')),
  date date not null,
  note text,
  created_by uuid references public.members(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Household Join Requests Table
create table if not exists public.household_join_requests (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. System Audit Logs Table
create table if not exists public.system_logs (
  id uuid primary key default gen_random_uuid(),
  household_id uuid references public.households(id) on delete cascade not null,
  action text not null,
  performed_by uuid references public.members(id) on delete set null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.households enable row level security;
alter table public.members enable row level security;
alter table public.categories enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_visibility_grants enable row level security;
alter table public.transactions enable row level security;
alter table public.household_join_requests enable row level security;
alter table public.system_logs enable row level security;

-- Helper function to get current user's active household IDs
create or replace function public.get_user_households()
returns setof uuid
language sql
security definer
as $$
  select household_id from public.members
  where user_id = auth.uid() and status = 'active';
$$;

-- RLS Policies

-- Households: members can view their active households
create policy "Members can view their households"
  on public.households for select
  using (id in (select public.get_user_households()));

create policy "Users can insert households"
  on public.households for insert
  with check (true);

create policy "Admins can update households"
  on public.households for update
  using (
    id in (
      select household_id from public.members
      where user_id = auth.uid() and role = 'admin' and status = 'active'
    )
  );

-- Members: view members in the same household
create policy "View members in same household"
  on public.members for select
  using (
    household_id in (select public.get_user_households())
    or user_id = auth.uid()
  );

create policy "Admins can manage members"
  on public.members for all
  using (
    household_id in (
      select household_id from public.members
      where user_id = auth.uid() and role = 'admin' and status = 'active'
    )
  );

-- Categories: view/manage categories in household
create policy "View categories in household"
  on public.categories for select
  using (household_id in (select public.get_user_households()));

create policy "Admins can manage categories"
  on public.categories for all
  using (
    household_id in (
      select household_id from public.members
      where user_id = auth.uid() and role = 'admin' and status = 'active'
    )
  );

-- Budgets: access via category household
create policy "View budgets in household"
  on public.budgets for select
  using (
    category_id in (
      select id from public.categories
      where household_id in (select public.get_user_households())
    )
  );

create policy "Admins can manage budgets"
  on public.budgets for all
  using (
    category_id in (
      select c.id from public.categories c
      join public.members m on m.household_id = c.household_id
      where m.user_id = auth.uid() and m.role = 'admin' and m.status = 'active'
    )
  );

-- Budget Visibility Grants
create policy "View budget visibility grants"
  on public.budget_visibility_grants for select
  using (
    member_id in (
      select id from public.members
      where household_id in (select public.get_user_households())
    )
  );

create policy "Admins can manage budget visibility grants"
  on public.budget_visibility_grants for all
  using (
    member_id in (
      select mem.id from public.members mem
      join public.members adm on adm.household_id = mem.household_id
      where adm.user_id = auth.uid() and adm.role = 'admin' and adm.status = 'active'
    )
  );

-- Transactions: view & create/edit transactions in household
create policy "View transactions in household"
  on public.transactions for select
  using (household_id in (select public.get_user_households()));

create policy "Members can insert transactions in household"
  on public.transactions for insert
  with check (household_id in (select public.get_user_households()));

create policy "Members can update/delete transactions"
  on public.transactions for update
  using (household_id in (select public.get_user_households()));

create policy "Members can delete transactions"
  on public.transactions for delete
  using (household_id in (select public.get_user_households()));

-- Household Join Requests
create policy "View join requests"
  on public.household_join_requests for select
  using (
    user_id = auth.uid()
    or household_id in (
      select household_id from public.members
      where user_id = auth.uid() and role = 'admin' and status = 'active'
    )
  );

create policy "Users can insert join requests"
  on public.household_join_requests for insert
  with check (user_id = auth.uid());

create policy "Admins can update join requests"
  on public.household_join_requests for update
  using (
    household_id in (
      select household_id from public.members
      where user_id = auth.uid() and role = 'admin' and status = 'active'
    )
  );

-- System Logs
create policy "View system logs in household"
  on public.system_logs for select
  using (household_id in (select public.get_user_households()));

create policy "Insert system logs in household"
  on public.system_logs for insert
  with check (household_id in (select public.get_user_households()));
