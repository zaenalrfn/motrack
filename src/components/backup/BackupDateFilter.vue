<script setup lang="ts">
import { ref } from 'vue'

const rangeType = ref('all')
</script>

<template>
  <div class="space-y-space-md">
    <div class="flex items-center gap-space-sm">
      <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">2</div>
      <h2 class="font-headline-sm text-headline-sm text-on-surface">Filter Rentang Waktu</h2>
    </div>

    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm space-y-space-lg">
      <!-- Radio Options -->
      <div class="flex flex-col sm:flex-row gap-space-md">
        <label class="flex items-center gap-space-xs cursor-pointer bg-surface-container-low px-space-md py-space-sm rounded-full border hover:border-primary transition-all" :class="rangeType === 'all' ? 'border-primary ring-1 ring-primary/20' : 'border-transparent'">
          <input type="radio" value="all" v-model="rangeType" class="accent-primary w-4 h-4">
          <span class="font-label-md text-on-surface">Semua Data Historis</span>
        </label>
        <label class="flex items-center gap-space-xs cursor-pointer bg-surface-container-low px-space-md py-space-sm rounded-full border hover:border-primary transition-all" :class="rangeType === 'custom' ? 'border-primary ring-1 ring-primary/20' : 'border-transparent'">
          <input type="radio" value="custom" v-model="rangeType" class="accent-primary w-4 h-4">
          <span class="font-label-md text-on-surface">Rentang Bulan / Tahun Khusus</span>
        </label>
      </div>

      <!-- Custom Range -->
      <div v-if="rangeType === 'custom'" class="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <div class="space-y-1">
          <label class="font-label-sm text-on-surface-variant">Dari Bulan:</label>
          <div class="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-surface-container">
            <span class="material-symbols-outlined text-on-surface-variant">calendar_month</span>
            <input type="month" class="bg-transparent w-full focus:outline-none font-body-md text-on-surface">
          </div>
        </div>
        <div class="space-y-1">
          <label class="font-label-sm text-on-surface-variant">Hingga Bulan:</label>
          <div class="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg border border-surface-container">
            <span class="material-symbols-outlined text-on-surface-variant">calendar_month</span>
            <input type="month" class="bg-transparent w-full focus:outline-none font-body-md text-on-surface">
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="bg-surface-container-low rounded-lg p-space-md">
        <h4 class="font-title-md text-on-surface flex items-center gap-space-xs mb-space-md">
          <span class="material-symbols-outlined text-primary">inventory_2</span> Pratinjau Cadangan
        </h4>
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          <div class="bg-surface-container-lowest p-space-md rounded-lg text-center border border-surface-container">
            <span class="material-symbols-outlined text-secondary">receipt_long</span>
            <p class="font-headline-sm font-bold text-on-surface tabular-nums">1.420</p>
            <p class="font-label-sm text-on-surface-variant">Jumlah Transaksi</p>
          </div>
          <div class="bg-surface-container-lowest p-space-md rounded-lg text-center border border-surface-container">
            <span class="material-symbols-outlined text-primary">category</span>
            <p class="font-headline-sm font-bold text-on-surface tabular-nums">8 Pos</p>
            <p class="font-label-sm text-on-surface-variant">Kategori Belanja</p>
          </div>
          <div class="bg-surface-container-lowest p-space-md rounded-lg text-center border border-surface-container">
            <span class="material-symbols-outlined text-tertiary">account_balance_wallet</span>
            <p class="font-headline-sm font-bold text-on-surface tabular-nums">5 Amplop</p>
            <p class="font-label-sm text-on-surface-variant">Anggaran Bulanan</p>
          </div>
          <div class="bg-surface-container-lowest p-space-md rounded-lg text-center border border-surface-container">
            <span class="material-symbols-outlined text-outline">group</span>
            <p class="font-headline-sm font-bold text-on-surface tabular-nums">4 Orang</p>
            <p class="font-label-sm text-on-surface-variant">Hak Akses Anggota</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-space-sm mt-space-md pt-space-md border-t border-surface-container">
          <div class="flex items-center gap-space-sm text-body-sm">
            <span class="font-medium text-on-surface">Estimasi Ukuran File ~418 KB</span>
            <span class="flex items-center gap-1 text-secondary font-semibold">
              <span class="material-symbols-outlined text-[16px]">shield</span> Terenkripsi SHA-256 Otentik
            </span>
          </div>
          <button class="flex items-center gap-space-xs bg-primary text-on-primary px-space-lg py-space-sm rounded-full font-label-md shadow-sm hover:bg-primary-container active:scale-95 transition-all">
            <span class="material-symbols-outlined">download_for_offline</span> Unduh File Backup Sekarang
          </button>
        </div>
        <p class="font-body-sm text-on-surface-variant mt-space-sm text-center">Data disimpan di perangkat lokal tanpa diunggah ke server publik pihak ketiga.</p>
      </div>
    </div>
  </div>
</template>
