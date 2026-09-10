<script setup lang="ts">
import { inject } from 'vue'
const openTransactionModal = inject('openTransactionModal') as () => void
</script>

<template>
  <div class="flex flex-col space-y-space-md">
    <!-- Filter Bar & Actions Header -->
    <div class="bg-surface-container-lowest rounded-lg p-space-md shadow-sm space-y-space-md">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
        <div>
          <h2 class="font-headline-md text-headline-md text-on-surface tracking-tight">Buku Kas Bersama</h2>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Seluruh aliran dana yang dicatat anggota keluarga Rina</p>
        </div>
        <div class="flex items-center gap-space-xs shrink-0">
          <button @click="openTransactionModal" class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all shadow-sm">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>Catat Transaksi</span>
          </button>
          <button class="flex items-center justify-center gap-1 bg-surface-container-low hover:bg-surface-container text-on-surface px-space-md py-space-xs rounded-full font-label-md text-label-md transition-colors">
            <span class="material-symbols-outlined text-[18px]">download</span>
            <span class="hidden sm:inline">Ekspor CSV</span>
          </button>
        </div>
      </div>

      <!-- Quick Filters Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-2xs border-t border-surface-container">
        <!-- Date Filter -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">calendar_today</span>
          <select class="w-full bg-surface-container-low rounded-DEFAULT pl-9 pr-space-md py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all cursor-pointer">
            <option selected>Bulan September 2026</option>
            <option>Bulan Agustus 2026</option>
            <option>Kuartal 3 (Jul - Sep)</option>
            <option>Sepanjang Tahun 2026</option>
          </select>
        </div>
        <!-- Category Filter -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">category</span>
          <select class="w-full bg-surface-container-low rounded-DEFAULT pl-9 pr-space-md py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all cursor-pointer">
            <option selected>Semua Kategori</option>
            <option>Makanan &amp; Dapur</option>
            <option>Transportasi</option>
            <option>Tagihan Rumah</option>
            <option>Pendidikan</option>
            <option>Hiburan</option>
          </select>
        </div>
        <!-- Author / Member Filter -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">person</span>
          <select class="w-full bg-surface-container-low rounded-DEFAULT pl-9 pr-space-md py-2 font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container transition-all cursor-pointer">
            <option selected>Semua Pembuat</option>
            <option>Rina (Admin)</option>
            <option>Budi (Member)</option>
            <option>Dinda (Member)</option>
            <option>Budi Santoso (anggota telah dihapus)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Ledger Content Container -->
    <div class="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
      
      <!-- MOBILE VIEW: Cards List (< 768px) -->
      <div class="block md:hidden divide-y divide-surface-container">
        <!-- Card Item 1 -->
        <div class="p-4 hover:bg-surface-container-low/40 transition-colors space-y-3">
          <div class="flex items-center justify-between text-xs text-on-surface-variant">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-on-surface">18 Sep 2026</span>
              <span>•</span>
              <span>10:45 WIB</span>
            </div>
            <button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[20px]">shopping_cart</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-on-surface text-sm leading-snug">Belanja Sayur &amp; Dapur Mingguan</h4>
              <p class="text-on-surface-variant text-xs">Makanan &amp; Dapur • Pasar Swalayan</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-surface-container/60">
            <div class="flex items-center gap-1.5">
              <img alt="Rina" class="w-5 h-5 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4bhRnYrM8EG8HnBmxvIXBoSzFzJbEcveSzqUy5MdhLMrA-zbUaw1iaxMqOCSuXePpWirv5oNxntwqXm_CSFki69W89wA2rZV5QL1Cs0Z9Zy3QHXsdMLcp9UMKFj7IADd4GgFzKq1C9OvX2R6F5HNgxfPQSoFwq9KCzDb1c8NL4CoNb9_wauMuTq46wjruSmD4kS7ljmpLdkVmm_R2NjpBV-WlBeWSBLkRxmTpZ4ci51JiTEXYo8e0Cg">
              <span class="text-xs font-medium text-on-surface">Rina</span>
              <span class="bg-primary-fixed text-primary px-1 py-0.2 rounded font-label-sm text-[8px] uppercase font-bold">Admin</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-primary text-sm">- Rp 450.000</span>
              <span class="block text-[10px] text-on-surface-variant">Tunai</span>
            </div>
          </div>
        </div>

        <!-- Card Item 2 -->
        <div class="p-4 hover:bg-surface-container-low/40 transition-colors space-y-3">
          <div class="flex items-center justify-between text-xs text-on-surface-variant">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-on-surface">17 Sep 2026</span>
              <span>•</span>
              <span>19:12 WIB</span>
            </div>
            <button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-on-surface text-sm leading-snug">Bonus Proyek Desain Freelance</h4>
              <p class="text-on-surface-variant text-xs">Pemasukan Tambahan • Rekening BCA</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-surface-container/60">
            <div class="flex items-center gap-1.5">
              <div class="w-5 h-5 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-[9px]">B</div>
              <span class="text-xs font-medium text-on-surface">Budi</span>
              <span class="bg-surface-container text-on-surface-variant px-1 py-0.2 rounded font-label-sm text-[8px] uppercase font-semibold">Member</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-secondary text-sm">+ Rp 4.500.000</span>
              <span class="block text-[10px] text-on-surface-variant">Transfer BCA</span>
            </div>
          </div>
        </div>

        <!-- Card Item 3 (Deleted Member) -->
        <div class="p-4 hover:bg-surface-container-low/40 transition-colors space-y-3 bg-surface-container-low/20">
          <div class="flex items-center justify-between text-xs text-on-surface-variant">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-on-surface">15 Sep 2026</span>
              <span>•</span>
              <span>08:30 WIB</span>
            </div>
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant" title="Arsip Terkunci">lock</span>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[20px]">bolt</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-on-surface text-sm leading-snug">Tagihan Token Listrik PLN &amp; Air PAM</h4>
              <p class="text-on-surface-variant text-xs">Tagihan Rumah • Autodebet Mandiri</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-surface-container/60">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[14px] text-on-surface-variant">person_off</span>
              <span class="text-xs font-medium text-on-surface-variant">Budi Santoso</span>
              <span class="bg-surface-variant text-on-surface-variant px-1.5 py-0.2 rounded-full font-label-sm text-[8px] font-semibold">dihapus</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-primary text-sm">- Rp 1.250.000</span>
              <span class="block text-[10px] text-on-surface-variant">Mandiri</span>
            </div>
          </div>
        </div>

        <!-- Card Item 4 -->
        <div class="p-4 hover:bg-surface-container-low/40 transition-colors space-y-3">
          <div class="flex items-center justify-between text-xs text-on-surface-variant">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-on-surface">14 Sep 2026</span>
              <span>•</span>
              <span>14:20 WIB</span>
            </div>
            <button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-on-surface text-sm leading-snug">Buku Pelajaran &amp; Alat Tulis Kakak</h4>
              <p class="text-on-surface-variant text-xs">Pendidikan Anak • Toko Buku</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-surface-container/60">
            <div class="flex items-center gap-1.5">
              <div class="w-5 h-5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center font-bold text-[9px]">D</div>
              <span class="text-xs font-medium text-on-surface">Dinda</span>
              <span class="bg-surface-container text-on-surface-variant px-1 py-0.2 rounded font-label-sm text-[8px] uppercase font-semibold">Member</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-primary text-sm">- Rp 380.000</span>
              <span class="block text-[10px] text-on-surface-variant">QRIS Dompet</span>
            </div>
          </div>
        </div>

        <!-- Card Item 5 -->
        <div class="p-4 hover:bg-surface-container-low/40 transition-colors space-y-3">
          <div class="flex items-center justify-between text-xs text-on-surface-variant">
            <div class="flex items-center gap-1.5">
              <span class="font-semibold text-on-surface">12 Sep 2026</span>
              <span>•</span>
              <span>17:50 WIB</span>
            </div>
            <button class="p-1 text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[18px]">more_vert</span>
            </button>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span class="material-symbols-outlined text-[20px]">directions_car</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-on-surface text-sm leading-snug">Servis Rutin Mobil &amp; Ganti Oli</h4>
              <p class="text-on-surface-variant text-xs">Transportasi • Bengkel Resmi</p>
            </div>
          </div>
          <div class="flex items-center justify-between pt-1 border-t border-surface-container/60">
            <div class="flex items-center gap-1.5">
              <img alt="Rina" class="w-5 h-5 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4bhRnYrM8EG8HnBmxvIXBoSzFzJbEcveSzqUy5MdhLMrA-zbUaw1iaxMqOCSuXePpWirv5oNxntwqXm_CSFki69W89wA2rZV5QL1Cs0Z9Zy3QHXsdMLcp9UMKFj7IADd4GgFzKq1C9OvX2R6F5HNgxfPQSoFwq9KCzDb1c8NL4CoNb9_wauMuTq46wjruSmD4kS7ljmpLdkVmm_R2NjpBV-WlBeWSBLkRxmTpZ4ci51JiTEXYo8e0Cg">
              <span class="text-xs font-medium text-on-surface">Rina</span>
              <span class="bg-primary-fixed text-primary px-1 py-0.2 rounded font-label-sm text-[8px] uppercase font-bold">Admin</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-primary text-sm">- Rp 850.000</span>
              <span class="block text-[10px] text-on-surface-variant">Debit BCA</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DESKTOP & TABLET VIEW: Full Table (>= 768px) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr class="bg-surface-container-low/70 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <th class="py-space-sm px-space-md font-semibold">Tanggal</th>
              <th class="py-space-sm px-space-md font-semibold">Kategori &amp; Catatan</th>
              <th class="py-space-sm px-space-md font-semibold">Dicatat Oleh</th>
              <th class="py-space-sm px-space-md font-semibold text-right">Nominal</th>
              <th class="py-space-sm px-space-md font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-container font-body-md text-body-md">
            <!-- Row 1 -->
            <tr class="hover:bg-surface-container-low/40 transition-colors group">
              <td class="py-space-md px-space-md whitespace-nowrap">
                <span class="font-semibold text-on-surface block text-[13px]">18 Sep 2026</span>
                <span class="text-on-surface-variant text-[11px]">10:45 WIB</span>
              </td>
              <td class="py-space-md px-space-md">
                <div class="flex items-center gap-space-sm">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span class="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </div>
                  <div>
                    <span class="font-semibold text-on-surface block">Belanja Sayur &amp; Dapur Mingguan</span>
                    <span class="text-on-surface-variant text-body-sm">Makanan &amp; Dapur • Pasar Swalayan</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <img alt="Rina" class="w-6 h-6 rounded-full object-cover shadow-2xs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4bhRnYrM8EG8HnBmxvIXBoSzFzJbEcveSzqUy5MdhLMrA-zbUaw1iaxMqOCSuXePpWirv5oNxntwqXm_CSFki69W89wA2rZV5QL1Cs0Z9Zy3QHXsdMLcp9UMKFj7IADd4GgFzKq1C9OvX2R6F5HNgxfPQSoFwq9KCzDb1c8NL4CoNb9_wauMuTq46wjruSmD4kS7ljmpLdkVmm_R2NjpBV-WlBeWSBLkRxmTpZ4ci51JiTEXYo8e0Cg">
                  <div class="flex flex-col">
                    <span class="text-on-surface font-semibold text-[13px]">Rina</span>
                    <span class="bg-primary-fixed text-primary px-1.5 py-0.2 rounded font-label-sm text-[9px] uppercase font-bold w-fit">Admin</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md text-right whitespace-nowrap">
                <span class="font-headline-sm text-[15px] font-bold text-primary">- Rp 450.000</span>
                <span class="block text-on-surface-variant text-[11px]">Tunai</span>
              </td>
              <td class="py-space-md px-space-md text-center whitespace-nowrap">
                <button class="p-1 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
                  <span class="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </td>
            </tr>
            <!-- Row 2 -->
            <tr class="hover:bg-surface-container-low/40 transition-colors group">
              <td class="py-space-md px-space-md whitespace-nowrap">
                <span class="font-semibold text-on-surface block text-[13px]">17 Sep 2026</span>
                <span class="text-on-surface-variant text-[11px]">19:12 WIB</span>
              </td>
              <td class="py-space-md px-space-md">
                <div class="flex items-center gap-space-sm">
                  <div class="w-9 h-9 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                    <span class="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                  </div>
                  <div>
                    <span class="font-semibold text-on-surface block">Bonus Proyek Desain Freelance</span>
                    <span class="text-on-surface-variant text-body-sm">Pemasukan Tambahan • Rekening BCA</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-[10px]">B</div>
                  <div class="flex flex-col">
                    <span class="text-on-surface font-semibold text-[13px]">Budi</span>
                    <span class="bg-surface-container text-on-surface-variant px-1.5 py-0.2 rounded font-label-sm text-[9px] uppercase font-semibold w-fit">Member</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md text-right whitespace-nowrap">
                <span class="font-headline-sm text-[15px] font-bold text-secondary">+ Rp 4.500.000</span>
                <span class="block text-on-surface-variant text-[11px]">Transfer BCA</span>
              </td>
              <td class="py-space-md px-space-md text-center whitespace-nowrap">
                <button class="p-1 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
                  <span class="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </td>
            </tr>
            <!-- Row 3 -->
            <tr class="hover:bg-surface-container-low/40 transition-colors group bg-surface-container-low/20">
              <td class="py-space-md px-space-md whitespace-nowrap">
                <span class="font-semibold text-on-surface block text-[13px]">15 Sep 2026</span>
                <span class="text-on-surface-variant text-[11px]">08:30 WIB</span>
              </td>
              <td class="py-space-md px-space-md">
                <div class="flex items-center gap-space-sm">
                  <div class="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                    <span class="material-symbols-outlined text-[20px]">bolt</span>
                  </div>
                  <div>
                    <span class="font-semibold text-on-surface block">Tagihan Token Listrik PLN &amp; Air PAM</span>
                    <span class="text-on-surface-variant text-body-sm">Tagihan Rumah • Autodebet Mandiri</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-outline-variant text-on-surface-variant flex items-center justify-center text-[11px]">
                    <span class="material-symbols-outlined text-[14px]">person_off</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-on-surface-variant font-medium text-[12px]">Budi Santoso</span>
                    <span class="bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded-full font-label-sm text-[9px] font-semibold w-fit tracking-tight">
                      anggota telah dihapus
                    </span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md text-right whitespace-nowrap">
                <span class="font-headline-sm text-[15px] font-bold text-primary">- Rp 1.250.000</span>
                <span class="block text-on-surface-variant text-[11px]">Mandiri</span>
              </td>
              <td class="py-space-md px-space-md text-center whitespace-nowrap">
                <button class="p-1 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container" title="Arsip Terkunci (Anggota Dihapus)">
                  <span class="material-symbols-outlined text-[18px]">lock</span>
                </button>
              </td>
            </tr>
            <!-- Row 4 -->
            <tr class="hover:bg-surface-container-low/40 transition-colors group">
              <td class="py-space-md px-space-md whitespace-nowrap">
                <span class="font-semibold text-on-surface block text-[13px]">14 Sep 2026</span>
                <span class="text-on-surface-variant text-[11px]">14:20 WIB</span>
              </td>
              <td class="py-space-md px-space-md">
                <div class="flex items-center gap-space-sm">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span class="material-symbols-outlined text-[20px]">school</span>
                  </div>
                  <div>
                    <span class="font-semibold text-on-surface block">Buku Pelajaran &amp; Alat Tulis Kakak</span>
                    <span class="text-on-surface-variant text-body-sm">Pendidikan Anak • Toko Buku</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center font-bold text-[10px]">D</div>
                  <div class="flex flex-col">
                    <span class="text-on-surface font-semibold text-[13px]">Dinda</span>
                    <span class="bg-surface-container text-on-surface-variant px-1.5 py-0.2 rounded font-label-sm text-[9px] uppercase font-semibold w-fit">Member</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md text-right whitespace-nowrap">
                <span class="font-headline-sm text-[15px] font-bold text-primary">- Rp 380.000</span>
                <span class="block text-on-surface-variant text-[11px]">QRIS Dompet Digital</span>
              </td>
              <td class="py-space-md px-space-md text-center whitespace-nowrap">
                <button class="p-1 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
                  <span class="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </td>
            </tr>
            <!-- Row 5 -->
            <tr class="hover:bg-surface-container-low/40 transition-colors group">
              <td class="py-space-md px-space-md whitespace-nowrap">
                <span class="font-semibold text-on-surface block text-[13px]">12 Sep 2026</span>
                <span class="text-on-surface-variant text-[11px]">17:50 WIB</span>
              </td>
              <td class="py-space-md px-space-md">
                <div class="flex items-center gap-space-sm">
                  <div class="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span class="material-symbols-outlined text-[20px]">directions_car</span>
                  </div>
                  <div>
                    <span class="font-semibold text-on-surface block">Servis Rutin Mobil &amp; Ganti Oli</span>
                    <span class="text-on-surface-variant text-body-sm">Transportasi • Bengkel Resmi</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <img alt="Rina" class="w-6 h-6 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4bhRnYrM8EG8HnBmxvIXBoSzFzJbEcveSzqUy5MdhLMrA-zbUaw1iaxMqOCSuXePpWirv5oNxntwqXm_CSFki69W89wA2rZV5QL1Cs0Z9Zy3QHXsdMLcp9UMKFj7IADd4GgFzKq1C9OvX2R6F5HNgxfPQSoFwq9KCzDb1c8NL4CoNb9_wauMuTq46wjruSmD4kS7ljmpLdkVmm_R2NjpBV-WlBeWSBLkRxmTpZ4ci51JiTEXYo8e0Cg">
                  <div class="flex flex-col">
                    <span class="text-on-surface font-semibold text-[13px]">Rina</span>
                    <span class="bg-primary-fixed text-primary px-1.5 py-0.2 rounded font-label-sm text-[9px] uppercase font-bold w-fit">Admin</span>
                  </div>
                </div>
              </td>
              <td class="py-space-md px-space-md text-right whitespace-nowrap">
                <span class="font-headline-sm text-[15px] font-bold text-primary">- Rp 850.000</span>
                <span class="block text-on-surface-variant text-[11px]">Debit BCA</span>
              </td>
              <td class="py-space-md px-space-md text-center whitespace-nowrap">
                <button class="p-1 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container">
                  <span class="material-symbols-outlined text-[18px]">more_vert</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer Pagination -->
      <div class="px-space-md py-space-sm bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-space-xs border-t border-surface-container text-body-sm text-on-surface-variant">
        <span class="text-xs sm:text-body-sm text-center sm:text-left">Menampilkan 5 dari 64 catatan bulan ini</span>
        <div class="flex items-center gap-space-xs">
          <button class="p-1.5 rounded-full hover:bg-surface-container disabled:opacity-40" disabled>
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button class="w-7 h-7 rounded-full bg-primary text-on-primary font-semibold text-[12px] flex items-center justify-center">1</button>
          <button class="w-7 h-7 rounded-full hover:bg-surface-container font-medium text-[12px] flex items-center justify-center">2</button>
          <button class="w-7 h-7 rounded-full hover:bg-surface-container font-medium text-[12px] flex items-center justify-center">3</button>
          <button class="p-1.5 rounded-full hover:bg-surface-container">
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

