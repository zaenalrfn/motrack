<script setup lang="ts">
import { useTransactionStore } from '../../stores/useTransactionStore'

const store = useTransactionStore()
const rupiah = (value: number) => 'Rp ' + value.toLocaleString('id-ID')
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md lg:gap-space-lg">
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between text-on-surface-variant mb-space-sm"><span class="font-label-md font-medium tracking-wide">Saldo Kas</span><span class="material-symbols-outlined text-secondary text-[22px]">account_balance</span></div>
      <span class="font-display-lg text-[26px] sm:text-[32px] tracking-tight text-on-surface leading-tight font-bold">{{ rupiah(store.balance) }}</span>
      <p class="font-body-sm text-on-surface-variant mt-space-xs">Pemasukan dikurangi pengeluaran</p>
    </div>
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between text-on-surface-variant mb-space-sm"><span class="font-label-md font-medium tracking-wide">Total Pengeluaran</span><span class="material-symbols-outlined text-primary text-[22px]">shopping_basket</span></div>
      <span class="font-display-lg text-[26px] sm:text-[32px] tracking-tight text-primary leading-tight font-bold">{{ rupiah(store.totalExpense) }}</span>
      <p class="font-body-sm text-on-surface-variant mt-space-xs">Periode {{ store.filters.month }}</p>
    </div>
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm relative overflow-hidden">
      <div class="flex items-center justify-between text-on-surface-variant mb-space-sm"><span class="font-label-md font-medium tracking-wide">Total Pemasukan</span><span class="material-symbols-outlined text-secondary text-[22px]">payments</span></div>
      <span class="font-display-lg text-[26px] sm:text-[32px] tracking-tight text-secondary leading-tight font-bold">{{ rupiah(store.totalIncome) }}</span>
      <p class="font-body-sm text-on-surface-variant mt-space-xs">{{ store.transactions.length }} transaksi pada periode ini</p>
    </div>
  </div>
</template>
