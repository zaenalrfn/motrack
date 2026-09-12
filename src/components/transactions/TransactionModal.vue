<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTransactionStore } from '../../stores/useTransactionStore'
import type { TransactionType } from '../../services/transactionService'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ (event: 'close'): void; (event: 'saved'): void }>()
const store = useTransactionStore()

const type = ref<TransactionType>('expense')
const amount = ref('')
const categoryId = ref('')
const date = ref(new Date().toISOString().split('T')[0])
const note = ref('')
const formError = ref('')

const categories = computed(() => store.categories.filter((category) => category.type === type.value))

watch(() => [props.isOpen, type.value, categories.value.length], ([open]) => {
  if (open && !categoryId.value) categoryId.value = categories.value[0]?.id ?? ''
  if (open && !categories.value.some((category) => category.id === categoryId.value)) categoryId.value = categories.value[0]?.id ?? ''
})

watch(() => props.isOpen, (open) => {
  if (open) {
    formError.value = ''
    date.value = new Date().toISOString().split('T')[0]
    if (!store.categories.length) store.loadTransactions(store.filters)
  }
})

const handleSave = async () => {
  const numericAmount = Number(amount.value)
  if (!categoryId.value) {
    formError.value = 'Pilih kategori terlebih dahulu.'
    return
  }
  if (!numericAmount || numericAmount <= 0) {
    formError.value = 'Nominal harus lebih besar dari 0.'
    return
  }
  if (!date.value) {
    formError.value = 'Tanggal transaksi wajib diisi.'
    return
  }

  formError.value = ''
  try {
    await store.addTransaction({ categoryId: categoryId.value, type: type.value, amount: numericAmount, date: date.value, note: note.value.trim() })
    emit('saved')
    emit('close')
    amount.value = ''
    note.value = ''
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Gagal menyimpan transaksi.'
  }
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/40 backdrop-blur-md p-4 overflow-y-auto">
    <div class="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-surface-container p-6 space-y-6 relative">
      <div class="flex items-center justify-between border-b border-surface-container pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary"><span class="material-symbols-outlined text-[24px]">receipt_long</span></div>
          <div><h3 class="font-headline-sm text-lg font-bold text-on-surface">Catat Transaksi Baru</h3><p class="font-body-sm text-on-surface-variant">Catat pemasukan atau pengeluaran keluarga</p></div>
        </div>
        <button :disabled="store.saving" @click="emit('close')" class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant disabled:opacity-50"><span class="material-symbols-outlined text-[20px]">close</span></button>
      </div>

      <div v-if="formError || store.error" class="rounded-xl bg-error-container text-on-error-container px-4 py-3 text-sm">{{ formError || store.error }}</div>

      <div class="grid grid-cols-2 gap-2 bg-surface-container-low p-1.5 rounded-2xl">
        <button type="button" :disabled="store.saving" @click="type = 'expense'" :class="type === 'expense' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'" class="py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">remove_circle</span>Pengeluaran</button>
        <button type="button" :disabled="store.saving" @click="type = 'income'" :class="type === 'income' ? 'bg-secondary text-on-secondary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'" class="py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"><span class="material-symbols-outlined text-[18px]">add_circle</span>Pemasukan</button>
      </div>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div><label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Nominal (Rp)</label><input v-model="amount" type="number" min="100" required placeholder="0" :disabled="store.saving" class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-headline-sm text-xl font-bold disabled:opacity-60"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Kategori</label><select v-model="categoryId" required :disabled="store.saving || !categories.length" class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-60"><option v-if="!categories.length" value="">Belum ada kategori</option><option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option></select></div><div><label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Tanggal</label><input v-model="date" type="date" required :disabled="store.saving" class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-60"></div></div>
        <div><label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Catatan</label><input v-model="note" type="text" placeholder="Contoh: Belanja bulanan" :disabled="store.saving" class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-60"></div>
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-surface-container"><button type="button" :disabled="store.saving" @click="emit('close')" class="px-5 py-3 rounded-full hover:bg-surface-container text-on-surface font-label-md text-sm disabled:opacity-50">Batal</button><button type="submit" :disabled="store.saving || !categories.length" class="flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold shadow-md disabled:opacity-50"><span v-if="store.saving" class="material-symbols-outlined text-[18px] animate-spin">refresh</span>{{ store.saving ? 'Menyimpan...' : 'Simpan Transaksi' }}</button></div>
      </form>
    </div>
  </div>
</template>
