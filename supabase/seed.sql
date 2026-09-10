-- ==========================================
-- COMPLETE SEED DATA FOR MOTRACK (Valid UUID Hex Format)
-- ==========================================

-- 0. Insert Dummy Auth Users
insert into auth.users (id, email, raw_user_meta_data, created_at, updated_at)
values 
  ('00000000-0000-0000-0000-000000000001', 'rina@demo.com', '{"name": "Rina"}', now(), now()),
  ('00000000-0000-0000-0000-000000000002', 'budi@demo.com', '{"name": "Budi"}', now(), now()),
  ('00000000-0000-0000-0000-000000000003', 'andi@demo.com', '{"name": "Andi"}', now(), now()),
  ('00000000-0000-0000-0000-000000000009', 'siti@demo.com', '{"name": "Siti"}', now(), now())
on conflict (id) do nothing;

-- 1. HOUSEHOLDS
insert into public.households (id, name)
values ('10000000-0000-0000-0000-000000000001', 'Keluarga Rina (Demo)')
on conflict (id) do nothing;


-- 2. MEMBERS
insert into public.members (id, household_id, user_id, name, role, status)
values 
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Rina (Admin)', 'admin', 'active'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Budi (Suami)', 'member', 'active'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'Andi (Mantan Anggota)', 'member', 'removed')
on conflict do nothing;


-- 3. CATEGORIES
insert into public.categories (id, household_id, name, type, is_custom, description, icon, icon_bg, icon_color)
values 
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Makanan & Groceries', 'expense', false, 'Sembako & Konsumsi Harian', 'shopping_cart', 'bg-primary-fixed', 'text-primary'),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Transportasi & Bensin', 'expense', false, 'BBM, Tol, & Parkir', 'local_gas_station', 'bg-surface-container', 'text-secondary'),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Tagihan & Listrik', 'expense', false, 'PLN, PDAM, & WiFi Rumah', 'bolt', 'bg-error-container', 'text-error'),
  ('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Pendidikan Anak', 'expense', false, 'SPP & Perlengkapan Belajar', 'school', 'bg-secondary-fixed', 'text-secondary'),
  ('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Hiburan & Rekreasi', 'expense', false, 'Wisata Akhir Pekan & Kuliner', 'movie', 'bg-surface-container', 'text-tertiary'),
  ('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'Gaji Bulanan', 'income', false, 'Pendapatan Utama', 'payments', 'bg-success-container', 'text-success')
on conflict do nothing;


-- 4. BUDGETS
insert into public.budgets (category_id, month, amount)
values 
  ('30000000-0000-0000-0000-000000000001', '2026-09', 6000000),
  ('30000000-0000-0000-0000-000000000002', '2026-09', 2500000),
  ('30000000-0000-0000-0000-000000000003', '2026-09', 2000000),
  ('30000000-0000-0000-0000-000000000004', '2026-09', 4000000),
  ('30000000-0000-0000-0000-000000000005', '2026-09', 2500000)
on conflict do nothing;


-- 5. BUDGET VISIBILITY GRANTS
insert into public.budget_visibility_grants (member_id, category_id)
values 
  ('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001')
on conflict do nothing;


-- 6. TRANSACTIONS
insert into public.transactions (household_id, category_id, amount, type, date, note, created_by)
values 
  ('10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000006', 15000000, 'income', '2026-09-01', 'Gaji bulanan utama', '20000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 5200000, 'expense', '2026-09-05', 'Belanja mingguan supermarket', '20000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 1850000, 'expense', '2026-09-06', 'Isi bensin & toll', '20000000-0000-0000-0000-000000000003')
on conflict do nothing;


-- 7. HOUSEHOLD JOIN REQUESTS
insert into public.household_join_requests (household_id, user_id, name, status)
values 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009', 'Siti (Calon Anggota)', 'pending')
on conflict do nothing;


-- 8. SYSTEM LOGS
insert into public.system_logs (household_id, action, performed_by, details)
values 
  ('10000000-0000-0000-0000-000000000001', 'EXPORT_JSON', '20000000-0000-0000-0000-000000000001', '{"format": "json", "filename": "backup-household-2026-09-09.json"}')
on conflict do nothing;
