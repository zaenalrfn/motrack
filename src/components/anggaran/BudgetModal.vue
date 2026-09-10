<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useBudgetStore } from '../../stores/useBudgetStore'

const props = defineProps<{
  isOpen: boolean
  editing?: { id: string; categoryId: string; month: string; amount: number } | null
}>()

const emit = defineEmits(['close'])

const store = useBudgetStore()
const categoryId = ref('')
const month = ref('2026-09')
const amount = ref('')

const unbudgeted = computed(() => store.categories.filter(c => !store.budgets.some(b => b.categoryId === c.id && b.month === month.value)))

watch(() => props.isOpen, (open) => {
  if (open) {
    categoryId.value = props.editing?.categoryId ?? unbudgeted.value[0]?.id ?? store.categories[0]?.id ?? ''
    month.value = props.editing?.month ?? '2026-09'
    amount.value = props.editing ? String(props.editing.amount) : ''
  }
})

const handleSave = () => {
  if (!categoryId.value || !amount.value || Number(amount.value) <= 0) return
  if (props.editing) {
    store.updateBudget(props.editing.id, Number(amount.value))
  } else {
    store.addBudget(categoryId.value, month.value, Number(amount.value))
  }
  emit('close')
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
        <button @click="emit('close')" class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div v-if="!editing">
          <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Kategori</label>
          <select v-model="categoryId" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm cursor-pointer">
            <option v-for="c in store.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <p v-if="unbudgeted.length === 0" class="text-xs text-on-surface-variant mt-1">Semua kategori sudah punya pagu bulan ini — simpan untuk update nominal.</p>
        </div>
        <div v-else class="bg-surface-container-low px-4 py-3 rounded-2xl text-sm">
          <span class="text-on-surface-variant">Kategori: </span>
          <strong>{{ store.categories.find(c => c.id === categoryId)?.name }}</strong>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Bulan</label>
            <input v-model="month" type="month" :disabled="!!editing" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm disabled:opacity-60" >
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Nominal (Rp)</label>
            <input v-model="amount" type="number" min="1000" required placeholder="2000000" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm font-bold" >
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4 border-t border-surface-container">
          <button type="button" @click="emit('close')" class="px-5 py-3 rounded-full hover:bg-surface-container text-sm">Batal</button>
          <button type="submit" class="px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-md active:scale-95">{{ editing ? 'Simpan Pagu' : 'Tambah Pagu' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
