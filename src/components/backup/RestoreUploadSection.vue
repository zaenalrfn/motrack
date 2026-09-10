<script setup lang="ts">
import { ref } from 'vue'

const mode = ref('merge')
const confirmText = ref('')
const fileValidated = ref(true)
</script>

<template>
  <div class="space-y-space-md">
    <div class="flex items-center justify-between">
      <h2 class="font-headline-sm text-headline-sm text-on-surface">Unggah Berkas Pemulihan</h2>
      <span class="px-space-sm py-0.5 rounded-full bg-primary-fixed/40 text-primary font-label-sm uppercase font-semibold">FR-09 & FR-10</span>
    </div>

    <div class="bg-tertiary-fixed/20 border border-tertiary-fixed/40 p-space-md rounded-lg flex gap-space-sm">
      <span class="material-symbols-outlined text-tertiary">info</span>
      <p class="font-body-sm text-on-surface leading-relaxed">
        <strong>Peraturan Integritas Arsip:</strong> Mendukung file tunggal .json atau arsip .zip CSV (wajib berisi ketiga file sekaligus: transactions.csv, categories.csv, dan budgets.csv; import parsial akan ditolak demi konsistensi ledger).
      </p>
    </div>

    <div class="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm space-y-space-lg border-2 border-dashed border-outline/30 hover:border-primary/50 transition-colors text-center">
      <div class="flex flex-col items-center gap-space-sm">
        <div class="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-[32px]">cloud_upload</span>
        </div>
        <div>
          <p class="font-title-md text-on-surface">Tarik dan letakkan file backup ke sini</p>
          <p class="font-body-sm text-on-surface-variant">atau klik untuk menelusuri penyimpanan lokal Anda</p>
        </div>
        <button class="px-space-lg py-space-xs rounded-full bg-surface-container hover:bg-surface-container-high font-label-md transition-colors">
          Pilih Berkas (.json / .zip)
        </button>
      </div>

      <!-- Validated File Info -->
      <div v-if="fileValidated" class="text-left bg-secondary-container/20 border border-secondary/30 p-space-md rounded-lg flex items-start gap-space-sm">
        <span class="material-symbols-outlined text-secondary">check_circle</span>
        <div>
          <p class="font-label-md text-on-surface font-semibold">Format Terverifikasi: ZIP CSV Lengkap 3/3 File Terdeteksi</p>
          <p class="font-body-sm text-on-surface-variant">transactions, categories, budgets • 388 KB</p>
          <span class="inline-block mt-1 px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-sm">Valid</span>
        </div>
      </div>
    </div>

    <!-- Validation Result -->
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm space-y-space-md">
      <h4 class="font-title-md text-on-surface font-semibold">Hasil Validasi Logika Berkas</h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm font-body-sm">
        <div class="flex justify-between bg-surface-container-low px-space-md py-space-sm rounded-lg">
          <span class="text-on-surface-variant">Pemeriksaan Struktur Relasi</span>
          <span class="font-semibold text-secondary">1.420 Valid</span>
        </div>
        <div class="flex justify-between bg-surface-container-low px-space-md py-space-sm rounded-lg">
          <span class="text-on-surface-variant">Baris Rusak / Invalid</span>
          <span class="font-semibold text-on-surface">0 Baris</span>
        </div>
        <div class="flex justify-between bg-surface-container-low px-space-md py-space-sm rounded-lg">
          <span class="text-on-surface-variant">Potensi Duplikat</span>
          <span class="font-semibold text-tertiary">12 Duplikat</span>
        </div>
        <div class="flex justify-between bg-surface-container-low px-space-md py-space-sm rounded-lg">
          <span class="text-on-surface-variant">Foreign-Key Kategori</span>
          <span class="font-semibold text-secondary">100% Cocok</span>
        </div>
      </div>
      <div class="flex items-center gap-space-xs bg-secondary-fixed/30 px-space-md py-space-sm rounded-lg text-secondary font-label-md">
        <span class="material-symbols-outlined">verified</span>
        <span>Token Rumah Tangga ID Keluarga Cocok (#KLG-RINA-99)</span>
      </div>
    </div>

    <!-- Mode Selection -->
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm space-y-space-md">
      <h4 class="font-title-md text-on-surface flex items-center gap-space-xs">
        <span class="material-symbols-outlined">tune</span> Pilih Mode Pemulihan
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <label :class="['p-space-md rounded-lg border-2 cursor-pointer transition-all', mode === 'merge' ? 'border-secondary bg-secondary-container/20' : 'border-surface-container']">
          <div class="flex items-center gap-space-xs mb-1">
            <input type="radio" value="merge" v-model="mode" class="accent-secondary">
            <span class="font-label-lg font-bold text-on-surface">Mode Merge (Penggabungan)</span>
            <span class="px-2 py-0.5 rounded-full bg-secondary text-on-secondary text-[11px] font-bold">Disarankan</span>
          </div>
          <p class="font-body-sm text-on-surface-variant leading-relaxed">Hanya menambahkan transaksi dan kategori baru. 12 data duplikat akan dilewati otomatis.</p>
        </label>
        <label :class="['p-space-md rounded-lg border-2 cursor-pointer transition-all', mode === 'replace' ? 'border-error bg-error-container/20' : 'border-surface-container']">
          <div class="flex items-center gap-space-xs mb-1">
            <input type="radio" value="replace" v-model="mode" class="accent-error">
            <span class="font-label-lg font-bold text-error">Mode Replace (Timpa Total)</span>
            <span class="px-2 py-0.5 rounded-full bg-error text-on-error text-[11px] font-bold">Destruktif</span>
          </div>
          <p class="font-body-sm text-on-surface-variant leading-relaxed">Menghapus seluruh database buku kas saat ini dan menggantinya persis dengan isi file cadangan.</p>
        </label>
      </div>

      <!-- Replace Confirm -->
      <div v-if="mode === 'replace'" class="bg-error-container/20 border border-error/30 p-space-md rounded-lg space-y-space-sm">
        <p class="font-label-md text-error flex items-center gap-space-xs font-bold">
          <span class="material-symbols-outlined">warning</span> Konfirmasi Hapus & Timpa
        </p>
        <p class="font-body-sm text-on-surface-variant">Tindakan ini tidak dapat dibatalkan. Silakan ketik kata sandi konfirmasi REPLACE di bawah ini:</p>
        <input v-model="confirmText" placeholder="Ketik REPLACE" class="w-full bg-surface-container-lowest border border-error/30 rounded-lg px-space-md py-space-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-error/40">
      </div>

      <button class="w-full flex items-center justify-center gap-space-xs bg-primary text-on-primary py-space-md rounded-full font-label-lg shadow-md hover:bg-primary-container active:scale-[0.99] transition-all">
        <span class="material-symbols-outlined">system_update_alt</span> Jalankan Restore Data
      </button>
      <p class="font-body-sm text-on-surface-variant text-center">Proses restore akan otomatis membuat log audit baru untuk transparansi keluarga.</p>
    </div>
  </div>
</template>
