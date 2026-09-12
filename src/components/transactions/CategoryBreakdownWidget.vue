<script setup lang="ts">
import { useTransactionStore } from '../../stores/useTransactionStore'

const store = useTransactionStore()
const rupiah = (value: number) => 'Rp ' + value.toLocaleString('id-ID')
const colors = ['bg-primary', 'bg-tertiary', 'bg-secondary', 'bg-outline', 'bg-surface-container-highest']
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm space-y-space-md">
    <div class="flex items-center justify-between"><div><h3 class="font-headline-sm text-on-surface">Porsi Pengeluaran</h3><p class="font-body-sm text-on-surface-variant">Berdasarkan transaksi periode aktif</p></div><span class="material-symbols-outlined text-primary text-[20px]">pie_chart</span></div>
    <div v-if="!store.categoryBreakdown.length" class="text-sm text-on-surface-variant py-4 text-center">Belum ada pengeluaran pada periode ini.</div>
    <div v-else class="space-y-space-sm">
      <div v-for="(item, index) in store.categoryBreakdown" :key="item.category?.id ?? index" class="space-y-1">
        <div class="flex items-center justify-between font-label-md"><span class="text-on-surface font-medium flex items-center gap-1.5"><span :class="['w-2.5 h-2.5 rounded-full', colors[index % colors.length]]"></span>{{ item.category?.name ?? 'Tanpa kategori' }}</span><span class="text-on-surface font-semibold">{{ rupiah(item.amount) }} <span class="text-on-surface-variant font-normal text-[11px]">({{ item.percent }}%)</span></span></div>
        <div class="w-full bg-surface-container-low h-2 rounded-full overflow-hidden"><div :class="['h-full rounded-full', colors[index % colors.length]]" :style="{ width: `${item.percent}%` }"></div></div>
      </div>
    </div>
  </div>
</template>
