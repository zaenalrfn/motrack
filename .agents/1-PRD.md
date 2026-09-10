# PRD: Money Tracker Keluarga (Mini-PRD)

## 1. Visi & Tujuan
### Visi Produk
Money Tracker Keluarga adalah aplikasi web *shared ledger* untuk keluarga (maks 6 orang) yang memberikan visibilitas keuangan melalui budget granular, serta fitur portabilitas data via export/import JSON dan ZIP CSV.

### Tujuan Utama
1. **Pencatatan Bersama** - Memungkinkan keluarga memantau transaksi dalam satu household.
2. **Budgeting Granular** - Memberikan akses kontrol budget per kategori secara spesifik per anggota.
3. **Portabilitas Data** - Menjamin data tidak terkunci (lock-in) dengan fitur backup/restore JSON & CSV yang handal.

### Value Proposition
- Shared ledger keluarga yang simpel.
- Backup manual penuh (JSON) dan semi-otomatis (CSV ZIP).
- Keamanan data (Auth, Role, Soft-delete member).

## 2. User Persona
### Persona 1: Rina (35, Ibu Rumah Tangga)
- **Tujuan:** Mengelola budget keluarga, backup data rutin.
- **Pain Points:** Tidak ada gambaran total pengeluaran bersama.
- **Motivasi:** Ingin keuangan keluarga transparan dan aman.

### Persona 2: Budi (37, Karyawan)
- **Tujuan:** Mencatat transaksi harian dengan cepat.
- **Pain Points:** Lupa mencatat pengeluaran di luar.
- **Motivasi:** Memudahkan pelacakan uang jajan/operasional keluarga.

## 3. User Stories
### Modul 1: Auth & Household
- Sebagai admin, saya bisa membuat household dan mengundang 6 anggota.
- Sebagai admin, saya bisa menyetujui join request anggota.
- Sebagai admin, saya bisa melakukan soft-delete member tanpa menghapus histori transaksi mereka.

### Modul 2: Transaksi & Kategori
- Sebagai pengguna, saya bisa CRUD transaksi dengan kategori yang tersedia.
- Sebagai admin, saya bisa menambah/mengedit kategori kustom.

### Modul 3: Budget & Backup
- Sebagai admin, saya bisa mengatur budget per kategori per bulan.
- Sebagai admin, saya bisa memberikan izin "Lihat Budget Penuh" ke member tertentu per kategori.
- Sebagai admin, saya bisa export data ke JSON atau ZIP 3 file CSV.
- Sebagai admin, saya bisa restore data dari file JSON atau ZIP CSV dengan validasi ketat.

## 4. Functional Requirements
### Modul 1: Manajemen Household
- **FR-01: Registrasi & Undangan:** Max 6 user, butuh persetujuan admin.
- **FR-02: Role & Soft Delete:** Admin vs Member, transaksi member dihapus tetap utuh.

### Modul 2: Transaksi & Budget
- **FR-03: CRUD Transaksi:** Filter berdasarkan tanggal/kategori/user.
- **FR-04: Budgeting:** Notifikasi/indikator visual jika mendekati budget.
- **FR-05: Granular Access:** Akses "Lihat Budget Penuh" diatur per-anggota per-kategori.

### Modul 3: Backup & Restore
- **FR-06: Export JSON/CSV:** Export full data ke JSON, export 3-table ke ZIP CSV.
- **FR-07: Restore Validasi:** Preview data, deteksi duplikat, mode Merge/Replace.

## 5. Non-Functional Requirements
### Performa
- Proses export/import < 10 detik untuk 5.000 transaksi.
- Web app responsif di desktop & mobile.

### Keamanan
- Data sensitif di-enkripsi transit (HTTPS).
- Hanya admin yang dapat menjalankan fitur destruktif (restore/replace).

### Tech Stack
- Frontend: Vue 3 (Pinia, Vue Router).
- Backend & DB: Supabase (Postgres, Auth, Storage, RLS).
- Client SDK: @supabase/supabase-js (Type-safe query & auth client).

## 6. Out of Scope & Dependensi
### Out of Scope (v1.0)
- Sinkronisasi cloud storage otomatis (Google Drive/etc).
- Multi-currency.
- Notifikasi email (hanya in-app).

### Dependensi
- Supabase (Auth, Storage, Realtime, Database).
- @supabase/supabase-js & Supabase CLI (TypeScript types generation).

### Asumsi
- Pengguna memiliki koneksi internet stabil.
- Backup adalah fitur portabilitas (bukan real-time sync).
