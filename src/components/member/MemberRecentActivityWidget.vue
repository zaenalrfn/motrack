<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionStore } from '../../stores/useTransactionStore'
import { useAuthStore } from '../../stores/useAuthStore'

const transactionStore = useTransactionStore()
const authStore = useAuthStore()

const myRecentTransactions = computed(() => {
  const me = authStore.currentMember?.id
  return transactionStore.transactions
    .filter((t) => t.created_by === me)
    .slice(0, 5)
})

const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID')
const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
const getIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('bensin') || n.includes('transport')) return 'local_gas_station'
  if (n.includes('makan')) return 'shopping_cart'
  if (n.includes('belanja')) return 'shopping_bag'
  return 'receipt'
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-sm border border-surface-variant/30 flex flex-col gap-space-md">
    <div class="flex items-center justify-between">
      <h3 class="font-title-md text-title-md text-on-surface font-semibold">Riwayat Saya Pekan Ini</h3>
      <span class="font-label-sm text-label-sm text-primary font-bold bg-primary-fixed/60 px-2 py-0.5 rounded-full">{{ myRecentTransactions.length }} Entri</span>
    </div>
    <div class="flex flex-col gap-space-sm divide-y divide-surface-variant/40">
      <div v-for="t in myRecentTransactions" :key="t.id" class="flex items-center justify-between pt-1 first:pt-0">
        <div class="flex items-center gap-space-xs min-w-0">
          <div class="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-sm">{{ getIcon(t.category?.name || '') }}</span>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="font-label-md text-label-md text-on-surface font-semibold truncate">{{ t.note || t.category?.name || 'Transaksi' }}</span>
            <span class="font-body-sm text-[11px] text-on-surface-variant">{{ formatDate(t.date) }}</span>
          </div>
        </div>
        <span class="font-label-md text-label-md font-bold text-primary tabular-nums shrink-0 ml-2">-{{ formatRupiah(t.amount) }}</span>
      </div>
      <div v-if="!myRecentTransactions.length" class="text-center py-4 text-on-surface-variant text-sm">Belum ada transaksi pekan ini.</div>
    </div>
  </div>
</template>
