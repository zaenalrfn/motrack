# TECH SPEC: Money Tracker Keluarga

## 1. Tech Stack & Arsitektur

### Tech Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | Vue 3 + Vite | 3.5+ |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4+ |
| State | Pinia | 2.2+ |
| Client SDK | @supabase/supabase-js | 2.x |
| Backend & DB | Supabase (PostgreSQL + RLS) | 15+ |
| Auth | Supabase Auth | - |
| Hosting | Vercel | - |

### Arsitektur Sistem
Frontend (Vue 3 + Pinia) ⇄ `@supabase/supabase-js` (Type-safe client) ⇄ Supabase (Auth / PostgreSQL / Storage / Realtime)
*Keamanan akses data household diatur langsung via PostgreSQL Row Level Security (RLS) policies.*

### Struktur Folder
- `src/components`: UI components
- `src/stores`: Pinia store (auth, household, transaction, budget)
- `src/services`: Supabase client & backup/restore helper
- `src/types`: TypeScript types (termasuk `database.types.ts` dari Supabase CLI)
- `supabase/migrations/`: SQL migration files
- `public/`: Assets

## 2. Database Design

### Entity Overview
| Entity | Key Fields | Relasi |
|--------|-----------|--------|
| Household | id, name | 1:N Members, 1:N Transactions |
| Member | id, household_id, user_id, role, status | M:1 Household, ref `auth.users` |
| Category | id, household_id, name, type, is_custom | M:1 Household |
| Budget | id, category_id, month, amount | M:1 Category |
| BudgetVisibility | member_id, category_id | M:N Members & Categories |
| Transaction | id, household_id, category_id, created_by, amount, type | M:1 Household, M:1 Category |

## 3. Interface Design (Services)
- `exportJson()`: Dump seluruh state household ke JSON di client.
- `exportCsvZip()`: Generate file ZIP berisi `transactions.csv`, `categories.csv`, `budgets.csv`.
- `validateRestore(file)`: Preview baris valid/invalid, deteksi duplikat, verifikasi keberadaan 3 file jika ZIP.
- `executeRestore(mode)`: Eksekusi restore dengan mode `Merge` (skip duplikat) atau `Replace` (bersihkan data lalu insert baru).

## 4. Alur Logika & Business Rules
- **Join Flow**: Link → Request → Admin Approve. Kuota fix 6 anggota aktif.
- **Soft Delete**: User dihapus → `status: removed` → Transaksi tetap utuh dengan `created_by` lama.
- **Budget Granular**: Default non-admin tidak melihat budget penuh kategori kecuali ada di `BudgetVisibility`.
- **Restore CSV**: ZIP wajib mengandung `transactions.csv`, `categories.csv`, `budgets.csv`. Jika salah satu kurang, tolak seluruh import.

## 5. Keamanan, Performa, & Deployment
- **Keamanan**: PostgreSQL Row Level Security (RLS) di Supabase untuk isolasi per `household_id`.
- **Performa**: Batas 10.000 baris / 5MB untuk file backup.
- **Setup**: `npm install && npx supabase gen types typescript --project-id <id> > src/types/database.types.ts && npm run dev`.
