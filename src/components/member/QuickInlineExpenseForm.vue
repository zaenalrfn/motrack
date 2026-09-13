<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import { useTransactionStore } from '../../stores/useTransactionStore'
import { usePermissionStore } from '../../stores/usePermissionStore'

const transactionStore = useTransactionStore()
const permissionStore = usePermissionStore()
const authStore = useAuthStore()

const amount = ref('')
const categoryId = ref('')
const date = ref(new Date().toISOString().slice(0, 10))
const note = ref('')
const successMessage = ref('')

const memberId = computed(() => authStore.currentMember?.id as string | undefined)

const openCategories = computed(() => {
  const expenseOnly = transactionStore.categories.filter((c) => c.type === 'expense')
  if (!memberId.value) return expenseOnly
  return expenseOnly.filter((c) => permissionStore.hasAccess(memberId.value as string, c.id))
})

onMounted(async () => {
  try {
    await Promise.all([transactionStore.syncCategories(), permissionStore.loadMatrix()])
    if (!categoryId.value && openCategories.value.length) categoryId.value = openCategories.value[0].id
  } catch { /* error ditangani store */ }
})

const handleQuickSave = async () => {
  const numericAmount = Number(amount.value)
  if (!numericAmount || numericAmount <= 0) {
    alert('Silakan masukkan jumlah pengeluaran terlebih dahulu.')
    return
  }
  if (!categoryId.value && openCategories.value.length) categoryId.value = openCategories.value[0].id
  try {
    await transactionStore.addTransaction({
      categoryId: categoryId.value,
      type: 'expense',
      amount: numericAmount,
      date: date.value,
      note: note.value.trim(),
    })
    amount.value = ''
    note.value = ''
    successMessage.value = 'Transaksi berhasil disimpan!'
    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Gagal menyimpan transaksi.')
  }
}
</script>

<template>
  <section class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-sm border border-surface-variant/40">
    <div class="flex items-center justify-between mb-space-md">
      <div class="flex items-center gap-space-xs">
        <div class="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
          <span class="material-symbols-outlined text-base">receipt</span>
        </div>
        <div>
          <h3 class="font-title-md text-title-md text-on-surface font-semibold">Form Cepat Catat Pengeluaran</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Input transaksi harian secara instan tanpa membuka jendela modal</p>
        </div>
      </div>
      <span class="font-label-sm text-label-sm text-secondary bg-secondary-fixed/60 px-space-xs py-0.5 rounded-full font-medium">Auto-Sync Buku Kas Keluarga</span>
    </div>
    <div v-if="successMessage" class="mb-space-md p-3 bg-secondary-fixed text-on-secondary-fixed-variant rounded-DEFAULT text-sm font-semibold flex items-center gap-2">
      <span class="material-symbols-outlined text-base">check_circle</span>{{ successMessage }}
    </div>
    <form class="grid grid-cols-1 md:grid-cols-12 gap-space-md items-end" @submit.prevent="handleQuickSave">
      <div class="md:col-span-3 flex flex-col gap-1">
        <label class="font-label-sm text-label-sm text-on-surface font-semibold" for="quick-amount">Jumlah Pengeluaran (Rp)</label>
        <div class="relative flex items-center">
          <span class="absolute left-3 font-semibold text-primary text-sm">Rp</span>
          <input v-model="amount" class="w-full bg-surface-container-low text-on-surface font-semibold pl-10 pr-3 py-2 rounded-DEFAULT text-sm border-0 focus:ring-2 focus:ring-primary transition-all tabular-nums" id="quick-amount" placeholder="50.000" type="number" min="1" />
        </div>
      </div>
      <div class="md:col-span-3 flex flex-col gap-1">
        <label class="font-label-sm text-label-sm text-on-surface font-semibold" for="quick-cat">Kategori (Sesuai Izin Granular)</label>
        <select v-model="categoryId" class="w-full bg-surface-container-low text-on-surface font-body-sm text-sm px-3 py-2 rounded-DEFAULT border-0 focus:ring-2 focus:ring-primary transition-all" id="quick-cat">
          <option v-if="!openCategories.length" value="">Belum ada akses kategori</option>
          <option v-for="cat in openCategories" :key="cat.id" :value="cat.id">{{ cat.name }} (Terbuka)</option>
        </select>
      </div>
      <div class="md:col-span-2 flex flex-col gap-1">
        <label class="font-label-sm text-label-sm text-on-surface font-semibold" for="quick-date">Tanggal Transaksi</label>
        <input v-model="date" class="w-full bg-surface-container-low text-on-surface font-body-sm text-sm px-3 py-2 rounded-DEFAULT border-0 focus:ring-2 focus:ring-primary transition-all" id="quick-date" type="date" />
      </div>
      <div class="md:col-span-2 flex flex-col gap-1">
        <label class="font-label-sm text-label-sm text-on-surface font-semibold" for="quick-note">Keterangan / Toko</label>
        <input v-model="note" class="w-full bg-surface-container-low text-on-surface font-body-sm text-sm px-3 py-2 rounded-DEFAULT border-0 focus:ring-2 focus:ring-primary transition-all" id="quick-note" placeholder="Mis: Bensin SPBU atau Galon" type="text" />
      </div>
      <div class="md:col-span-2 flex">
        <button class="w-full bg-primary hover:bg-primary-container text-on-primary py-2 px-space-md rounded-DEFAULT font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 disabled:opacity-50" type="submit" :disabled="transactionStore.saving">
          <span class="material-symbols-outlined text-base" :class="transactionStore.saving ? 'animate-spin' : ''">{{ transactionStore.saving ? 'refresh' : 'send' }}</span>
          <span>{{ transactionStore.saving ? 'Menyimpan...' : 'Simpan Instan' }}</span>
        </button>
      </div>
    </form>
  </section>
</template>
