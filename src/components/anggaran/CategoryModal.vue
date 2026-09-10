<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  editing?: { id: string; name: string; description: string; type: 'expense' | 'income'; icon: string } | null
}>()

const emit = defineEmits(['close', 'save'])

const name = ref('')
const description = ref('')
const type = ref<'expense' | 'income'>('expense')
const icon = ref('shopping_cart')

const iconOptions = ['shopping_cart', 'local_gas_station', 'bolt', 'school', 'movie', 'payments', 'savings', 'home', 'health_and_safety']

watch(() => props.isOpen, (open) => {
  if (open) {
    name.value = props.editing?.name ?? ''
    description.value = props.editing?.description ?? ''
    type.value = props.editing?.type ?? 'expense'
    icon.value = props.editing?.icon ?? 'shopping_cart'
  }
})

const handleSave = () => {
  if (!name.value.trim()) return
  emit('save', { name: name.value.trim(), description: description.value.trim() || 'Kategori kustom keluarga', type: type.value, icon: icon.value })
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-md p-4 overflow-y-auto">
    <div class="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl border border-surface-container p-6 space-y-5 my-4">
      <div class="flex items-center justify-between border-b border-surface-container pb-4">
        <div>
          <h3 class="font-headline-sm text-lg font-bold text-on-surface">{{ editing ? 'Edit Kategori' : 'Tambah Kategori Baru' }}</h3>
          <p class="font-body-sm text-on-surface-variant text-xs">Wadah pencatatan transaksi (FR-04)</p>
        </div>
        <button @click="emit('close')" class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Nama Kategori</label>
          <input v-model="name" type="text" placeholder="cth: Tabungan Liburan" required class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm" >
        </div>
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Deskripsi</label>
          <input v-model="description" type="text" placeholder="cth: Dana darurat & liburan" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm" >
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Tipe</label>
            <select v-model="type" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm cursor-pointer">
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
            </select>
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase font-semibold block mb-1">Ikon</label>
            <select v-model="icon" class="w-full bg-surface-container-low px-4 py-3 rounded-2xl border border-surface-container text-sm cursor-pointer">
              <option v-for="ic in iconOptions" :key="ic" :value="ic">{{ ic }}</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-surface-container">
          <button type="button" @click="emit('close')" class="px-5 py-3 rounded-full hover:bg-surface-container text-sm transition-colors text-on-surface-variant">Batal</button>
          <button type="submit" class="px-6 py-3 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-md active:scale-95 transition-all">{{ editing ? 'Simpan Perubahan' : 'Tambah Kategori' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
