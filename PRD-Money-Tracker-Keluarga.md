# PRD: Money Tracker Keluarga (Web App) dengan Backup & Restore Data

| Metadata | Detail |
|---|---|
| Versi Dokumen | 1.0 |
| Status | Draft |
| Tipe Produk | Web Application |
| Pemilik Produk | (zaenal) |
| Tanggal | 9 September 2026 |

---

## 1. Ringkasan Produk

Money Tracker Keluarga adalah aplikasi web untuk mencatat pemasukan dan pengeluaran yang dapat diakses bersama oleh anggota keluarga (multi-user). Aplikasi menyediakan kategori transaksi dan budget bulanan sebagai fitur inti, serta kemampuan **backup data secara manual** dalam format **JSON** dan **CSV**, yang nantinya dapat **di-restore (import) kembali** ke dalam aplikasi.

## 2. Latar Belakang & Masalah

- Keluarga sering kesulitan melacak pengeluaran bersama karena masing-masing anggota mencatat di tempat berbeda (Excel pribadi, catatan HP, dll).
- Data keuangan yang hanya tersimpan di satu aplikasi/server berisiko hilang atau sulit dipindahkan jika pengguna ingin ganti perangkat, migrasi akun, atau sekadar punya salinan offline sebagai jaring pengaman.
- Belum ada cara mudah untuk mengambil salinan data keuangan keluarga dan memasukkannya kembali tanpa input ulang manual.

## 3. Tujuan Produk

1. Menyediakan pencatatan transaksi keuangan yang bisa diakses bersama oleh anggota keluarga dalam satu "Household".
2. Memberi visibilitas pengeluaran melalui kategori dan budget bulanan.
3. Memungkinkan pengguna mengekspor seluruh data keuangan ke file JSON/CSV kapan saja.
4. Memungkinkan pengguna mengimpor kembali file backup tersebut untuk memulihkan atau memindahkan data.

## 4. Target Pengguna

- **Primer**: Keluarga (2–6 anggota) yang ingin mencatat dan memantau keuangan bersama.
- **Sekunder**: Individu dalam keluarga yang berperan sebagai "admin" pengelola data (biasanya orang tua).

## 5. Persona Singkat

| Persona | Peran | Kebutuhan Utama |
|---|---|---|
| Rina (35) | Admin/Kepala keluarga | Mengelola anggota, melihat ringkasan total, backup rutin |
| Budi (37) | Anggota | Mencatat pengeluaran harian dengan cepat |
| Anak remaja (16) | Anggota terbatas | Mencatat uang jajan, akses terbatas ke laporan keluarga |

## 6. Ruang Lingkup

### In Scope (Versi 1.0)
- Autentikasi & manajemen akun keluarga (household), multi-user dengan role.
- CRUD transaksi (pemasukan/pengeluaran).
- Kategori transaksi (bawaan + kustom).
- Budget bulanan per kategori.
- Dashboard ringkasan saldo & pengeluaran per kategori.
- Export data ke JSON dan CSV (manual, on-demand).
- Import/restore data dari file JSON dan CSV.

### Out of Scope (Fase Selanjutnya)
- Sinkronisasi otomatis ke cloud storage (Google Drive/Dropbox).
- Aplikasi mobile native.
- Integrasi rekening bank / open banking.
- Multi-currency.
- Notifikasi real-time / reminder budget.

## 7. Fitur Utama & User Stories

### 7.1 Manajemen Household & Anggota
- Sebagai admin, saya bisa membuat household dan mengundang anggota keluarga via email/link undangan.
- Sebagai admin, saya bisa menetapkan role: **Admin** (kelola anggota, budget, backup) dan **Member** (catat & lihat transaksi).
- Semua anggota dalam satu household melihat data transaksi yang sama (shared ledger).
- **Default**, anggota non-admin **tidak** bisa melihat total budget keluarga secara penuh — hanya melihat transaksi & kategori umum. Admin dapat memberikan **izin "Lihat Budget Penuh" secara granular per kategori** kepada member tertentu (misal: member X boleh lihat budget kategori "Makanan" & "Transport", tapi tidak "Hiburan").
- Household dibatasi maksimal **6 anggota**, berlaku tetap untuk semua pengguna — aplikasi ini **gratis sepenuhnya**, tidak ada paket/tier berbayar di versi awal. Undangan baru akan ditolak dengan pesan jelas jika kuota 6 anggota sudah penuh, **dan admin menerima notifikasi in-app** setiap kali ada yang mencoba bergabung saat kuota penuh.
- Setiap orang yang bergabung lewat link undangan tetap memerlukan **persetujuan eksplisit dari admin** sebelum resmi aktif sebagai anggota — bukan proses otomatis. Karena selalu ada gerbang persetujuan ini, **tidak ada batas jumlah percobaan bergabung** yang perlu diterapkan.
- Saat admin **menghapus member** dari household, member tersebut kehilangan akses login, namun **seluruh transaksi yang pernah dibuatnya tetap tersimpan** di ledger keluarga (bersifat *soft delete* pada akun member, bukan hapus data transaksi) — supaya riwayat keuangan keluarga tetap sinkron dan utuh. Transaksi lama tetap menampilkan nama pembuat aslinya, ditandai "(anggota telah dihapus)".
- Member yang sudah di-soft-delete **bisa diundang kembali ke household yang sama**. Saat diundang ulang dan bergabung lagi, statusnya kembali menjadi "active" dan **seluruh riwayat transaksi lamanya otomatis tersambung kembali secara utuh** — tidak dianggap sebagai anggota baru.
- Admin dapat memberi izin "Lihat Budget Penuh" ke **beberapa member sekaligus** (bulk action) dalam satu kategori atau lebih, untuk mempermudah pengaturan. Sistem menampilkan **dialog konfirmasi/warning** sebelum menerapkan perubahan massal ini (menyebutkan berapa member & kategori yang akan terdampak).

### 7.2 Pencatatan Transaksi
- Tambah transaksi: jumlah, tanggal, kategori, catatan, tipe (income/expense), dan siapa yang mencatat (auto dari user login).
- Edit & hapus transaksi (dengan histori siapa yang mengubah).
- Filter transaksi berdasarkan tanggal, kategori, dan anggota.

### 7.3 Kategori
- Kategori bawaan (Makanan, Transport, Tagihan, Hiburan, dll).
- Admin bisa menambah/mengedit/menonaktifkan kategori kustom.

### 7.4 Budget Bulanan
- Admin menetapkan budget bulanan per kategori.
- Indikator visual saat pengeluaran mendekati/melewati budget.

### 7.5 Dashboard & Laporan
- Ringkasan saldo total household.
- Grafik pengeluaran per kategori per bulan.
- Perbandingan realisasi vs budget.

### 7.6 Backup Data (Export)
- Sebagai admin, saya bisa mengekspor seluruh data household (transaksi, kategori, budget, anggota) ke file **JSON** (lengkap, terstruktur) untuk keperluan backup penuh/migrasi.
- Sebagai admin, saya bisa mengekspor **transaksi, kategori, dan budget** ke **CSV** untuk dibuka di Excel/Google Sheets. Karena CSV hanya mendukung satu tabel per file, export CSV menghasilkan **3 file dalam satu ZIP**: `transactions.csv`, `categories.csv`, `budgets.csv`.
- Export bisa difilter berdasarkan rentang tanggal (opsional, khusus transaksi) atau seluruh data.

### 7.7 Restore Data (Import)
- Sebagai admin, saya bisa mengunggah file JSON backup untuk memulihkan data household (transaksi, kategori, budget).
- Sebagai admin, saya bisa mengunggah file **ZIP CSV** yang **wajib berisi ketiga file** (`transactions.csv` + `categories.csv` + `budgets.csv`) hasil export sebelumnya. Jika salah satu file tidak ada di dalam ZIP, seluruh proses import **ditolak** dengan pesan error yang jelas (tidak ada partial import).
- Sistem menampilkan **preview & validasi** sebelum data benar-benar dimasukkan (jumlah baris valid/invalid, deteksi duplikat).
- Admin memilih mode import: **Merge** (gabungkan dengan data yang ada, skip duplikat) atau **Replace** (timpa seluruh data household — dengan konfirmasi tegas karena destruktif).

## 8. Functional Requirements

| ID | Requirement | Prioritas |
|---|---|---|
| FR-01 | Sistem mendukung registrasi household & undangan anggota | Must |
| FR-02 | Sistem mendukung role Admin & Member dengan hak akses berbeda | Must |
| FR-03 | Pengguna dapat CRUD transaksi dengan kategori & tanggal | Must |
| FR-04 | Pengguna dapat membuat/mengelola kategori kustom | Must |
| FR-05 | Admin dapat mengatur budget bulanan per kategori | Must |
| FR-06 | Sistem menampilkan dashboard ringkasan & grafik | Must |
| FR-07 | Admin dapat mengekspor seluruh data household ke JSON | Must |
| FR-08 | Admin dapat mengekspor transaksi, kategori, dan budget ke CSV (dalam satu ZIP) | Must |
| FR-09 | Admin dapat mengimpor file JSON untuk restore data | Must |
| FR-10 | Admin dapat mengimpor ZIP CSV — wajib berisi ketiga file (transaksi, kategori, budget) sekaligus, ditolak jika tidak lengkap | Must |
| FR-11 | Sistem memvalidasi & menampilkan preview sebelum import dieksekusi | Must |
| FR-12 | Sistem mendeteksi duplikat transaksi saat import (merge mode) | Should |
| FR-13 | Sistem mencatat log/histori setiap aktivitas backup & restore | Should |
| FR-14 | Sistem menyediakan opsi filter tanggal saat export | Could |
| FR-15 | Sistem membatasi jumlah anggota household maksimal 6 (tetap, tanpa tier berbayar) | Must |
| FR-16 | Admin dapat memberi/mencabut izin "Lihat Budget Penuh" per anggota **per kategori** (granular) | Must |
| FR-17 | Penghapusan member bersifat *soft delete*: akses login dicabut, transaksi tetap tersimpan & ditautkan ke member tsb | Must |
| FR-18 | Admin dapat memberi izin "Lihat Budget Penuh" ke banyak member sekaligus (bulk), dengan dialog konfirmasi sebelum diterapkan | Should |
| FR-19 | Sistem mengirim notifikasi **in-app** ke admin saat ada percobaan bergabung ketika kuota 6 anggota sudah penuh | Should |
| FR-20 | Setiap permintaan bergabung via link undangan wajib disetujui admin secara eksplisit sebelum akun aktif sebagai anggota (tidak ada batas jumlah percobaan) | Must |
| FR-21 | Member yang di-soft-delete dapat diundang kembali ke household yang sama; status kembali "active" dan riwayat transaksi lama tetap utuh & tersambung otomatis | Must |

## 9. Data Model (Ringkas)

```
Household
 ├─ id, name, created_at
 ├─ Members (User, role: admin/member, status: active/removed)
 ├─ Categories (id, name, type, is_custom)
 ├─ Budgets (id, category_id, month, amount)
 ├─ BudgetVisibilityGrants (member_id, category_id) — daftar kategori yang boleh dilihat budget penuhnya oleh member non-admin
 └─ Transactions
     ├─ id, amount, type (income/expense)
     ├─ category_id, date, note
     └─ created_by (user_id — tetap merujuk ke member meski status "removed"), created_at, updated_at
```

## 10. Format Backup

### 10.1 JSON (Full Backup)
```json
{
  "household": { "id": "hh_123", "name": "Keluarga Rina" },
  "exported_at": "2026-09-09T10:00:00Z",
  "members": [{ "id": "u1", "name": "Rina", "role": "admin" }],
  "categories": [{ "id": "c1", "name": "Makanan", "type": "expense" }],
  "budgets": [{ "category_id": "c1", "month": "2026-09", "amount": 2000000 }],
  "transactions": [
    {
      "id": "t1",
      "amount": 50000,
      "type": "expense",
      "category_id": "c1",
      "date": "2026-09-05",
      "note": "Belanja mingguan",
      "created_by": "u1"
    }
  ]
}
```

### 10.2 CSV (ZIP: `transactions.csv`, `categories.csv`, `budgets.csv`)

**transactions.csv**
Kolom: `date, type, category, amount, note, created_by`
```
date,type,category,amount,note,created_by
2026-09-05,expense,Makanan,50000,Belanja mingguan,Rina
```

**categories.csv**
Kolom: `name, type, is_custom`
```
name,type,is_custom
Makanan,expense,false
Freelance,income,true
```

**budgets.csv**
Kolom: `category, month, amount`
```
category,month,amount
Makanan,2026-09,2000000
```

## 11. Alur Backup & Restore

**Export:**
1. Admin membuka menu "Backup Data".
2. Pilih format (JSON penuh / CSV transaksi) dan rentang tanggal (opsional).
3. Sistem generate file dan memicu download.
4. Sistem mencatat log export (waktu, siapa, jumlah data).

**Restore/Import:**
1. Admin membuka menu "Restore Data" dan mengunggah file.
2. Sistem mendeteksi format (JSON/CSV) dan memvalidasi struktur.
3. Sistem menampilkan preview: jumlah data valid, invalid, dan potensi duplikat.
4. Admin memilih mode: **Merge** atau **Replace**, lalu konfirmasi.
5. Sistem memproses import dan menampilkan ringkasan hasil (berhasil/gagal per baris).
6. Sistem mencatat log restore.

**Edge cases yang perlu ditangani:**
- File corrupt / format tidak sesuai skema → tolak dengan pesan error jelas.
- **ZIP CSV yang tidak berisi ketiga file** (`transactions.csv`, `categories.csv`, `budgets.csv`) → tolak **seluruh** import, tampilkan file mana yang hilang.
- CSV dengan kategori yang belum ada di household → opsi buat kategori baru otomatis atau map ke kategori existing.
- Import Replace oleh non-admin → ditolak (hanya admin).
- Ukuran file terlalu besar → beri batas maksimum (misal 10.000 baris / 5MB) dengan pesan yang jelas.

## 12. Non-Functional Requirements

- **Keamanan**: Data keuangan bersifat sensitif — enkripsi data saat transit (HTTPS) dan idealnya at-rest; hanya admin yang bisa export/import data penuh.
- **Privasi**: File backup yang diunduh berada di kendali pengguna sepenuhnya (tanggung jawab penyimpanan ada di user).
- **Performa**: Proses export/import untuk household dengan hingga ~5.000 transaksi harus selesai dalam <10 detik.
- **Kompatibilitas**: Web app responsif (desktop & mobile browser).
- **Auditability**: Setiap export/import tercatat dalam log aktivitas household.

## 13. Tech Stack (Arsitektur Teknis)

| Layer | Pilihan | Catatan |
|---|---|---|
| Frontend | **Vue.js** (Vue 3 + Composition API) | Disarankan pakai Pinia untuk state management & Vue Router untuk navigasi |
| Backend & Database | **Supabase** (PostgreSQL) | Menyediakan Database, Auth (login & undangan anggota), Storage (file backup), dan Postgres RLS (Row Level Security) |
| Client SDK | **@supabase/supabase-js** | Library query client langsung dari frontend ke Supabase dengan type safety (via TypeScript type generation dari Supabase CLI) |
| Autentikasi | Supabase Auth | Untuk login, invite link, dan alur persetujuan admin (FR-20) |
| Notifikasi in-app | Tabel `notifications` di Postgres + Supabase Realtime | Untuk mendorong notifikasi kuota penuh (FR-19) ke admin tanpa perlu polling |
| File Backup | Digenerate on-the-fly di client/Edge Function (JSON/ZIP CSV) lalu diunduh pengguna, atau disimpan sementara di Supabase Storage | Tidak perlu disimpan permanen kecuali untuk keperluan log/audit |

**Catatan implementasi:**
- Karena Supabase Auth mengelola user & session, relasi `Member`/`created_by` langsung mereferensikan `auth.users.id`.
- Keamanan akses data household dan transaksi diamankan langsung di level database via Supabase Row Level Security (RLS) policies.
- Supabase Realtime bisa dipertimbangkan di fase berikutnya agar dashboard antar anggota keluarga update otomatis tanpa refresh manual (saat ini scope utama tetap: shared database + backup/restore manual, bukan real-time sync).

## 14. Asumsi & Batasan

- Data utama tersimpan di server/database aplikasi (bukan lokal per perangkat); JSON/CSV backup adalah fitur **portabilitas & jaring pengaman**, bukan mekanisme sinkronisasi real-time antar anggota (kolaborasi real-time sudah otomatis lewat shared database).
- "Sync lagi" pada tahap ini berarti **restore manual** dari file yang sudah diekspor sebelumnya, bukan sinkronisasi otomatis dua arah.
- Sinkronisasi otomatis ke layanan cloud pihak ketiga dianggap fitur fase berikutnya (lihat Out of Scope).
- Batas anggota household adalah **6 orang, angka final (fixed)**, berlaku sama untuk semua household karena aplikasi ini **gratis sepenuhnya** tanpa model tier/berbayar.
- Visibilitas budget penuh untuk member non-admin bersifat **opt-in granular per kategori** (default tertutup), diatur oleh admin.
- Restore via ZIP CSV **tidak mendukung partial import** — ketiga file (transaksi, kategori, budget) wajib ada dalam satu ZIP.
- Penghapusan member adalah **soft delete** — histori transaksi tidak pernah dihapus otomatis, demi menjaga konsistensi/sinkronisasi data keluarga. Member yang sama bisa diundang lagi ke household yang sama kapan pun tanpa kehilangan riwayat.
- Notifikasi kuota penuh dikirim ke **semua admin** household (jika admin lebih dari satu) melalui **in-app notification saja** (tanpa email) di versi awal.
- Tidak ada pembatasan jumlah percobaan bergabung via link undangan, karena setiap percobaan tetap harus **disetujui admin** terlebih dahulu — bukan proses auto-join.

## 15. Metrik Keberhasilan

- % household aktif yang melakukan minimal 1x export dalam 3 bulan pertama.
- Tingkat keberhasilan import tanpa error (>95% baris valid pada file yang sesuai format).
- Retensi pengguna (household aktif mencatat transaksi mingguan).

## 16. Risiko

| Risiko | Mitigasi |
|---|---|
| User salah pilih mode "Replace" dan kehilangan data | Konfirmasi ganda + rekomendasikan export dulu sebelum Replace |
| Format CSV pihak ketiga tidak cocok | Sediakan template CSV yang bisa diunduh |
| Data sensitif bocor lewat file backup | Edukasi user + opsi enkripsi file dengan password (opsional, fase 2) |

## 17. Roadmap Fase

- **Fase 1 (MVP)**: Household, transaksi, kategori, budget, dashboard dasar, export/import JSON & CSV.
- **Fase 2**: Enkripsi file backup, deteksi duplikat lebih pintar, log aktivitas detail.
- **Fase 3**: Auto-sync ke cloud storage, aplikasi mobile.

## 18. Keputusan yang Sudah Diambil

- ✅ Anggota non-admin **perlu izin khusus** untuk melihat total budget keluarga secara penuh (default tertutup, admin bisa buka per-anggota).
- ✅ **Ada batasan** jumlah anggota per household di versi awal (tetap 6, lihat Section 14).
- ✅ Export CSV **mendukung transaksi, kategori, dan budget** (via ZIP 3 file).
- ✅ Batas anggota **tetap 6**, berlaku untuk semua pengguna — aplikasi **gratis**, tanpa paket/tier berbayar.
- ✅ Izin "Lihat Budget Penuh" bersifat **granular per kategori**, bukan global.
- ✅ Import ZIP CSV **wajib lengkap** (ketiga file sekaligus) — tidak ada partial import; jika tidak lengkap, seluruh import ditolak.
- ✅ Penghapusan member = **soft delete**, transaksi tetap tersimpan agar histori keluarga tetap sinkron.
- ✅ Pemberian izin "Lihat Budget Penuh" **bisa bulk (banyak member sekaligus)**, dengan dialog warning/konfirmasi sebelum diterapkan.
- ✅ Admin **mendapat notifikasi** saat ada yang mencoba bergabung tapi kuota 6 anggota sudah penuh.
- ✅ Member yang di-soft-delete **bisa diundang kembali** ke household yang sama dengan riwayat transaksi tetap utuh.
- ✅ Notifikasi kuota penuh cukup **in-app saja**, tidak perlu email.
- ✅ **Tidak ada batas** jumlah percobaan bergabung saat kuota penuh, karena selalu memerlukan persetujuan admin.
- ✅ **Tech stack** ditetapkan: Frontend Vue.js, Backend/Database Supabase (Postgres + Auth + Storage + RLS), Client SDK `@supabase/supabase-js` (lihat Section 13).
