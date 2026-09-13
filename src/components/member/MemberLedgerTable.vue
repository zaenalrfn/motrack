<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import { useTransactionStore } from '../../stores/useTransactionStore'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const search = ref('')

const transactions = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return transactionStore.transactions
  return transactionStore.transactions.filter((t) =>
    `${t.note ?? ''} ${t.category?.name ?? ''} ${t.member?.name ?? ''}`.toLowerCase().includes(q)
  )
})

const formatRupiah = (val: number) => (val < 0 ? '-' : '-') + ' Rp ' + Math.abs(val).toLocaleString('id-ID')
const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
const formatTime = (d: string) => new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
const isMe = (memberId: string | null) => !!memberId && memberId === authStore.currentMember?.id
</script>

<template>
  <section class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-sm border border-surface-variant/30 flex flex-col gap-space-md">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
      <div>
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">Buku Kas Bersama</span>
        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Riwayat Transaksi Keluarga</h2>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Transparan untuk seluruh anggota</p>
      </div>
      <div class="flex items-center gap-space-xs flex-wrap">
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input v-model="search" class="bg-surface-container-low text-on-surface text-body-sm rounded-full pl-8 pr-4 py-1.5 focus:outline-none border-0 transition-all" placeholder="Cari transaksi..." type="text" />
        </div>
      </div>
    </div>
    <div v-if="transactionStore.loading" class="text-center py-8 text-on-surface-variant">Memuat transaksi...</div>
    <div v-else class="overflow-x-auto w-full">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
            <th class="py-space-sm px-space-md rounded-l-DEFAULT font-semibold">Tanggal</th>
            <th class="py-space-sm px-space-md font-semibold">Keterangan & Kategori</th>
            <th class="py-space-sm px-space-md font-semibold">Dicatat Oleh</th>
            <th class="py-space-sm px-space-md text-right rounded-r-DEFAULT font-semibold">Nominal</th>
          </tr>
        </thead>
        <tbody class="font-body-md text-body-md text-on-surface">
          <tr v-for="t in transactions" :key="t.id" class="hover:bg-surface-container-low transition-colors border-b border-surface-variant/20 last:border-0">
            <td class="py-space-md px-space-md whitespace-nowrap">
              <div class="flex flex-col">
                <span class="font-label-md text-label-md font-semibold">{{ formatDate(t.date) }}</span>
                <span class="font-body-sm text-body-sm text-on-surface-variant">{{ formatTime(t.date) }}</span>
              </div>
            </td>
            <td class="py-space-md px-space-md">
              <div class="flex flex-col">
                <span class="font-semibold text-on-surface">{{ t.note || t.category?.name || 'Transaksi' }}</span>
                <span class="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full inline-block mt-1 w-max">{{ t.category?.name || 'Lain-lain' }}</span>
              </div>
            </td>
            <td class="py-space-md px-space-md whitespace-nowrap">
              <div class="flex items-center gap-space-xs">
                <span class="w-7 h-7 rounded-full bg-primary-fixed text-primary font-bold text-xs flex items-center justify-center">{{ t.member?.name?.charAt(0)?.toUpperCase() || '?' }}</span>
                <div class="flex flex-col">
                  <span class="font-label-md text-label-md font-semibold text-on-surface">{{ isMe(t.created_by) ? `${t.member?.name} (Anda)` : (t.member?.name || 'Anggota') }}</span>
                  <span v-if="t.member?.status && t.member.status !== 'active'" class="font-label-sm text-[10px] text-on-surface-variant bg-surface-container-highest px-1.5 rounded-full inline-block w-max">anggota telah dihapus</span>
                  <span v-else class="font-label-sm text-[10px] text-on-surface-variant">{{ t.member?.role === 'admin' ? 'Admin' : 'Member' }}</span>
                </div>
              </div>
            </td>
            <td class="py-space-md px-space-md text-right whitespace-nowrap">
              <span class="font-title-md text-title-md text-primary font-bold tabular-nums">{{ formatRupiah(t.amount) }}</span>
            </td>
          </tr>
          <tr v-if="!transactions.length">
            <td colspan="4" class="text-center py-8 text-on-surface-variant">Belum ada transaksi yang cocok.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
