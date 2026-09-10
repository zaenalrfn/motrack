<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBudgetStore } from '../../stores/useBudgetStore'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'save'])
const budgetStore = useBudgetStore()

const type = ref<'expense' | 'income'>('expense')
const amount = ref('')
const selectedCategoryName = ref('Makanan & Groceries')
const date = ref(new Date().toISOString().split('T')[0])
const account = ref('Tunai / Dompet')
const note = ref('')

const categories = computed(() => budgetStore.categories.filter(c => c.type === type.value))

const handleSave = () => {
  if (!amount.value || Number(amount.value) <= 0) return
  
  const category = budgetStore.categories.find(c => c.name === selectedCategoryName.value)
  if (!category) return

  const newTransaction = {
    category_id: category.id,
    type: type.value,
    amount: Number(amount.value),
    date: date.value,
    note: `${note.value || ''} [via ${account.value}]`.trim(),
    createdAt: new Date().toISOString()
  }

  emit('save', newTransaction)
  emit('close')
  
  // Reset form
  amount.value = ''
  note.value = ''
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-xs p-4 overflow-y-auto">
    <div class="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-surface-container p-6 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
      
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-surface-container pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[24px]">receipt_long</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-on-surface">Catat Transaksi Baru</h3>
            <p class="font-body-sm text-on-surface-variant">Catat pemasukan atau pengeluaran keluarga</p>
          </div>
        </div>
        <button @click="emit('close')" class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant transition-colors">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Type Switcher -->
      <div class="grid grid-cols-2 gap-2 bg-surface-container-low p-1.5 rounded-2xl">
        <button 
          type="button" 
          @click="type = 'expense'"
          :class="type === 'expense' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'"
          class="py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">remove_circle</span>
          <span>Pengeluaran</span>
        </button>
        <button 
          type="button" 
          @click="type = 'income'"
          :class="type === 'income' ? 'bg-secondary text-on-secondary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'"
          class="py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Pemasukan</span>
        </button>
      </div>

      <!-- Form Inputs -->
      <form @submit.prevent="handleSave" class="space-y-4">
        <!-- Nominal Amount -->
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Nominal (Rp)</label>
          <div class="relative flex items-center">
            <span class="absolute left-4 font-bold text-on-surface-variant text-base">Rp</span>
            <input 
              v-model="amount" 
              type="number" 
              placeholder="0" 
              required
              min="100"
              class="w-full bg-surface-container-low text-on-surface pl-12 pr-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-headline-sm text-xl font-bold"
            >
          </div>
        </div>

        <!-- Category & Date Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Kategori</label>
            <select 
              v-model="selectedCategoryName"
              class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium cursor-pointer"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Tanggal</label>
            <input 
              v-model="date" 
              type="date" 
              class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
            >
          </div>
        </div>

        <!-- Account / Source -->
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Sumber Rekening / Metode</label>
          <select 
            v-model="account"
            class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium cursor-pointer"
          >
            <option>Tunai / Dompet</option>
            <option>BCA</option>
            <option>Mandiri</option>
            <option>QRIS / E-Wallet</option>
          </select>
        </div>

        <!-- Note -->
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold block mb-1">Catatan Keterangan</label>
          <input 
            v-model="note" 
            type="text" 
            placeholder="Contoh: Belanja bulanan di supermarket" 
            class="w-full bg-surface-container-low text-on-surface px-4 py-3 rounded-2xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
          <button 
            type="button" 
            @click="emit('close')"
            class="px-5 py-3 rounded-full hover:bg-surface-container text-on-surface font-label-md text-sm transition-colors"
          >
            Batal
          </button>
          <button 
            type="submit"
            class="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-semibold shadow-md transition-transform active:scale-95"
          >
            Simpan Transaksi
          </button>
        </div>
      </form>

    </div>
  </div>
</template>
