<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useBudgetStore } from '../../stores/useBudgetStore'

const props = defineProps<{
  isOpen: boolean
  editing?: { id: string; categoryId: string; month: string; amount: number } | null
  loading?: boolean
  error?: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'save', payload: { categoryId: string; month: string; amount: number; id?: string }): void
}>()

const store = useBudgetStore()
const categoryId = ref('')
const month = ref(store.selectedMonth)
const amount = ref('')

const unbudgeted = computed(() => store.categories.filter((category) =>
  !store.budgets.some((budget) => budget.category_id === category.id && budget.month === month.value),
))

watch(() => props.isOpen, (open) => {
  if (open) {
    categoryId.value = props.editing?.categoryId ?? unbudgeted.value[0]?.id ?? store.categories[0]?.id ?? ''
    month.value = props.editing?.month ?? store.selectedMonth
    amount.value = props.editing ? String(props.editing.amount) : ''
  }
})

const handleSave = () => {
  const numericAmount = Number(amount.value)
  if (!categoryId.value || !month.value || numericAmount <= 0 || props.loading) return

  emit('save', {
    id: props.editing?.id,
    categoryId: categoryId.value,
    month: month.value,
    amount: numericAmount,
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-md p-4 overflow-y-auto">
    <div class="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl border border-surface-container p-6 space-y-5">
      <div class="flex items-center justify-between border-b border-surface-container pb-4">
        <div>
          <h3 class="font-headline-sm text-lg font-bold text-on-surface">{{ editing ? 'Edit Pagu Kategori' : 'Tambah Pagu Kategori' }}</h3>
          <p class="font-body-sm text-on-surface-variant">Isi nominal limit bulanan (FR-05)</p>
        </div>
        <button :disabled="loading" @click="emit('close')" class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant disabled:opacity-50">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div v-if="error" class="rounded-xl bg-error-container text-on-error-container px-4 py-3 text-sm">{{ error }}</div>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div v-if="!editing">
          <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Kategori</label>
          <select v-model="categoryId" :disabled="loading" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm cursor-pointer disabled:opacity-60">
            <option v-for="category in store.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
          <p v-if="unbudgeted.length === 0" class="text-xs text-on-surface-variant mt-1">Semua kategori sudah punya pagu bulan ini. Simpan akan ditolak jika terjadi duplikat.</p>
        </div>
        <div v-else class="bg-surface-container-low px-4 py-3 rounded-2xl text-sm">
          <span class="text-on-surface-variant">Kategori: </span>
          <strong>{{ store.categories.find((category) => category.id === categoryId)?.name }}</strong>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Bulan</label>
            <input v-model="month" type="month" :disabled="!!editing || loading" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm disabled:opacity-60">
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Nominal (Rp)</label>
            <input v-model="amount" type="number" min="1000" required placeholder="2000000" :disabled="loading" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm font-bold disabled:opacity-60">
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-surface-container">
          <button type="button" :disabled="loading" @click="emit('close')" class="px-5 py-3 rounded-full hover:bg-surface-container text-sm disabled:opacity-50">Batal</button>
          <button type="submit" :disabled="loading" class="px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-md active:scale-95 disabled:opacity-50">
            {{ loading ? 'Menyimpan...' : editing ? 'Simpan Pagu' : 'Tambah Pagu' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
