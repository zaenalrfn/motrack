<script setup lang="ts">
import { ref } from 'vue'

const selectedFormat = ref('json')
</script>

<template>
  <div class="space-y-space-md">
    <div class="flex items-center gap-space-sm">
      <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">1</div>
      <h2 class="font-headline-sm text-headline-sm text-on-surface">Pilih Format Cadangan</h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
      <!-- Full Backup JSON -->
      <div 
        @click="selectedFormat = 'json'"
        :class="['cursor-pointer p-space-lg rounded-lg border-2 transition-all flex flex-col gap-space-sm relative overflow-hidden', 
        selectedFormat === 'json' ? 'border-primary bg-primary-fixed/20 shadow-md' : 'border-surface-container bg-surface-container-lowest hover:border-primary-fixed']"
      >
        <div class="flex items-center justify-between">
          <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[28px]">data_object</span>
          </div>
          <span v-if="selectedFormat === 'json'" class="material-symbols-outlined text-primary">check_circle</span>
        </div>
        <div>
          <h3 class="font-title-md text-on-surface font-bold">Full Backup JSON (.json)</h3>
          <p class="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
            Snapshot lengkap berisi 4 relasi: transaksi utuh, skema kategori kustom, alokasi budget, dan daftar anggota.
          </p>
        </div>
        <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm w-fit mt-2">
          <span class="material-symbols-outlined text-[14px]">verified</span> Rekomendasi Pemulihan Total
        </span>
      </div>

      <!-- Export CSV ZIP -->
      <div 
        @click="selectedFormat = 'csv'"
        :class="['cursor-pointer p-space-lg rounded-lg border-2 transition-all flex flex-col gap-space-sm relative overflow-hidden', 
        selectedFormat === 'csv' ? 'border-primary bg-primary-fixed/20 shadow-md' : 'border-surface-container bg-surface-container-lowest hover:border-primary-fixed']"
      >
        <div class="flex items-center justify-between">
          <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary">
            <span class="material-symbols-outlined text-[28px]">folder_zip</span>
          </div>
          <span v-if="selectedFormat === 'csv'" class="material-symbols-outlined text-primary">check_circle</span>
        </div>
        <div>
          <h3 class="font-title-md text-on-surface font-bold">Export Arsip Tabel CSV (.zip)</h3>
          <p class="font-body-sm text-on-surface-variant mt-1 leading-relaxed">
            Satu berkas ZIP berisi 3 file tabel terpisah: transactions.csv, categories.csv, dan budgets.csv.
          </p>
        </div>
        <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm w-fit mt-2">
          <span class="material-symbols-outlined text-[14px]">table_view</span> Mudah Diolah di Excel
        </span>
      </div>
    </div>
  </div>
</template>
