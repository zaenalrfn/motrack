-- Add RPC function for secure admin registration
create or replace function public.register_new_household_admin(
  p_household_name text,
  p_admin_name text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_user_id uuid;
  v_household_id uuid;
begin
  -- 1. Get current logged in user id
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Unauthorized: User belum login';
  end if;

  -- 2. Create new Household
  insert into public.households (name)
  values (p_household_name)
  returning id into v_household_id;

  -- 3. Create Admin Member for this user
  insert into public.members (household_id, user_id, name, role, status)
  values (v_household_id, v_user_id, p_admin_name, 'admin', 'active');

  -- 4. Insert Default Categories
  insert into public.categories (household_id, name, type, is_custom, description, icon, icon_bg, icon_color)
  values 
    (v_household_id, 'Makanan & Groceries', 'expense', false, 'Sembako & Konsumsi Harian', 'shopping_cart', 'bg-primary-fixed', 'text-primary'),
    (v_household_id, 'Transportasi & Bensin', 'expense', false, 'BBM, Tol, & Parkir', 'local_gas_station', 'bg-surface-container', 'text-secondary'),
    (v_household_id, 'Tagihan & Listrik', 'expense', false, 'PLN, PDAM, & WiFi Rumah', 'bolt', 'bg-error-container', 'text-error'),
    (v_household_id, 'Pendidikan Anak', 'expense', false, 'SPP & Perlengkapan Belajar', 'school', 'bg-secondary-fixed', 'text-secondary'),
    (v_household_id, 'Gaji Bulanan', 'income', false, 'Pendapatan Utama', 'payments', 'bg-success-container', 'text-success');

  return v_household_id;
end;
$$;
