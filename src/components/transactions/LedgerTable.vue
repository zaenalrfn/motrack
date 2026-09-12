<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import { useTransactionStore } from '../../stores/useTransactionStore'

const openTransactionModal = inject('openTransactionModal') as (() => void) | undefined
const store = useTransactionStore()

const rupiah = (value: number) => 'Rp ' + value.toLocaleString('id-ID')
const formatDate = (value: string) => new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
const monthLabel = computed(() => new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${store.filters.month}-01`)))

onMounted(() => {
  if (!store.transactions.length && !store.loading) store.loadTransactions()
})

const updateMonth = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  store.loadTransactions({ ...store.filters, month: value })
}
const updateCategory = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  store.loadTransactions({ ...store.filters, categoryId: value || undefined })
}
const updateMember = (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  store.loadTransactions({ ...store.filters, memberId: value || undefined })
}
</script>

<template>
  <div class="flex flex-col space-y-space-md">
    <div class="bg-surface-container-lowest rounded-lg p-space-md shadow-sm space-y-space-md">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm"><div><h2 class="font-headline-md text-on-surface tracking-tight">Buku Kas Bersama</h2><p class="font-body-sm text-on-surface-variant">Seluruh aliran dana household untuk {{ monthLabel }}</p></div><button @click="openTransactionModal?.()" class="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-space-md py-space-xs rounded-full font-label-md shadow-sm"><span class="material-symbols-outlined text-[18px]">add</span>Catat Transaksi</button></div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-2xs border-t border-surface-container"><input type="month" :value="store.filters.month" @change="updateMonth" class="w-full bg-surface-container-low rounded-lg px-space-md py-2 font-body-sm text-on-surface focus:outline-none"><select @change="updateCategory" class="w-full bg-surface-container-low rounded-lg px-space-md py-2 font-body-sm text-on-surface focus:outline-none"><option value="">Semua Kategori</option><option v-for="category in store.categories" :key="category.id" :value="category.id">{{ category.name }}</option></select><select @change="updateMember" class="w-full bg-surface-container-low rounded-lg px-space-md py-2 font-body-sm text-on-surface focus:outline-none"><option value="">Semua Pembuat</option><option v-for="member in store.participation" :key="member.id" :value="member.id">{{ member.name }}</option></select></div>
    </div>

    <div class="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
      <div v-if="store.loading" class="p-space-xl text-center text-on-surface-variant">Memuat buku kas...</div>
      <div v-else-if="store.error" class="p-space-xl text-center text-error">{{ store.error }}</div>
      <div v-else-if="!store.transactions.length" class="p-space-xl text-center text-on-surface-variant"><span class="material-symbols-outlined text-4xl text-outline">receipt_long</span><p class="mt-2">Belum ada transaksi pada periode ini.</p><button @click="openTransactionModal?.()" class="mt-4 text-primary font-semibold hover:underline">Catat transaksi pertama</button></div>
      <template v-else>
        <div class="block md:hidden divide-y divide-surface-container"><div v-for="transaction in store.transactions" :key="transaction.id" class="p-4 space-y-3"><div class="flex items-center justify-between text-xs text-on-surface-variant"><span class="font-semibold text-on-surface">{{ formatDate(transaction.date) }}</span><span>{{ transaction.member?.name ?? 'Anggota' }}</span></div><div class="flex items-start gap-3"><div :class="['w-9 h-9 rounded-full flex items-center justify-center shrink-0', transaction.category?.icon_bg ?? 'bg-surface-container']"><span :class="['material-symbols-outlined text-[20px]', transaction.category?.icon_color ?? 'text-secondary']">{{ transaction.category?.icon ?? 'category' }}</span></div><div class="flex-1 min-w-0"><h4 class="font-semibold text-on-surface text-sm">{{ transaction.note || transaction.category?.name || 'Transaksi' }}</h4><p class="text-on-surface-variant text-xs">{{ transaction.category?.name ?? 'Tanpa kategori' }}</p></div><span :class="['font-bold text-sm whitespace-nowrap', transaction.type === 'income' ? 'text-secondary' : 'text-primary']">{{ transaction.type === 'income' ? '+' : '-' }} {{ rupiah(transaction.amount) }}</span></div></div></div>
        <div class="hidden md:block overflow-x-auto"><table class="w-full text-left"><thead><tr class="bg-surface-container-low/70 text-on-surface-variant font-label-sm uppercase tracking-wider"><th class="py-space-sm px-space-md">Tanggal</th><th class="py-space-sm px-space-md">Kategori & Catatan</th><th class="py-space-sm px-space-md">Dicatat Oleh</th><th class="py-space-sm px-space-md text-right">Nominal</th></tr></thead><tbody class="divide-y divide-surface-container"><tr v-for="transaction in store.transactions" :key="transaction.id" class="hover:bg-surface-container-low/40"><td class="py-space-md px-space-md whitespace-nowrap"><span class="font-semibold text-on-surface block">{{ formatDate(transaction.date) }}</span></td><td class="py-space-md px-space-md"><div class="flex items-center gap-space-sm"><div :class="['w-9 h-9 rounded-full flex items-center justify-center', transaction.category?.icon_bg ?? 'bg-surface-container']"><span :class="['material-symbols-outlined text-[20px]', transaction.category?.icon_color ?? 'text-secondary']">{{ transaction.category?.icon ?? 'category' }}</span></div><div><span class="font-semibold text-on-surface block">{{ transaction.note || 'Transaksi' }}</span><span class="text-on-surface-variant text-sm">{{ transaction.category?.name ?? 'Tanpa kategori' }}</span></div></div></td><td class="py-space-md px-space-md"><span class="font-semibold text-on-surface">{{ transaction.member?.name ?? 'Anggota tidak diketahui' }}</span></td><td class="py-space-md px-space-md text-right whitespace-nowrap"><span :class="['font-bold', transaction.type === 'income' ? 'text-secondary' : 'text-primary']">{{ transaction.type === 'income' ? '+' : '-' }} {{ rupiah(transaction.amount) }}</span></td></tr></tbody></table></div>
      </template>
    </div>
  </div>
</template>
