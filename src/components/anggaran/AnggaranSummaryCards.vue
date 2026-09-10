<script setup lang="ts">
import { useBudgetStore } from '../../stores/useBudgetStore'
const store = useBudgetStore()
const rupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID')
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md lg:gap-space-lg">
    <div class="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between gap-2">
        <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold truncate">Total Budget Dialokasikan</span>
        <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
        </div>
      </div>
      <div class="mt-space-md">
        <div class="text-[26px] sm:text-[32px] text-on-surface font-bold tabular-nums leading-tight truncate">{{ rupiah(store.totalBudget) }}</div>
        <div class="text-on-surface-variant text-sm mt-1"><span class="text-secondary font-medium">{{ store.budgets.length }} Pos Kategori</span> teralokasi</div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-high"></div>
    </div>

    <div class="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between gap-2">
        <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold truncate">Realisasi Pengeluaran</span>
        <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary shrink-0">
          <span class="material-symbols-outlined text-[22px]">shopping_basket</span>
        </div>
      </div>
      <div class="mt-space-md">
        <div class="text-[26px] sm:text-[32px] text-on-surface font-bold tabular-nums leading-tight truncate">{{ rupiah(store.totalSpent) }}</div>
        <div class="text-on-surface-variant text-sm mt-1">Terpakai <strong class="text-on-surface">{{ store.totalBudget ? Math.round(store.totalSpent / store.totalBudget * 100) : 0 }}%</strong> dari total alokasi</div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-tertiary-fixed"></div>
    </div>

    <div class="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow sm:col-span-2 xl:col-span-1">
      <div class="flex items-center justify-between gap-2">
        <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold truncate">Sisa Alokasi Bersih</span>
        <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary shrink-0">
          <span class="material-symbols-outlined text-[22px]">savings</span>
        </div>
      </div>
      <div class="mt-space-md">
        <div class="text-[26px] sm:text-[32px] text-secondary font-bold tabular-nums leading-tight truncate">{{ rupiah(store.totalRemaining) }}</div>
        <div class="text-on-surface-variant text-sm mt-1">Cadangan aman tersedia</div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>
    </div>
  </div>
</template>
