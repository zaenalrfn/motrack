<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useBudgetStore } from '../../stores/useBudgetStore'
import CategoryModal from './CategoryModal.vue'
import BudgetModal from './BudgetModal.vue'

const store = useBudgetStore()
const showCatModal = ref(false)
const showBudgetModal = ref(false)
const showBudgetEdit = ref(false)
const editingCat = ref<any>(null)
const editingBudget = ref<any>(null)

const openAddBudget = () => { editingBudget.value = null; showBudgetModal.value = true }
const onOpenAddBudget = () => openAddBudget()
onMounted(() => document.addEventListener('open-add-budget', onOpenAddBudget))
onUnmounted(() => document.removeEventListener('open-add-budget', onOpenAddBudget))

const rupiah = (n: number) => 'Rp ' + n.toLocaleString('id-ID')

const openAddCategory = () => { editingCat.value = null; showCatModal.value = true }
const openEditCategory = (cat: any) => { editingCat.value = cat; showCatModal.value = true }
const saveCategory = (payload: any) => {
  if (editingCat.value) store.updateCategory(editingCat.value.id, payload)
  else {
    store.addCategory(payload)
    editingBudget.value = null
    showBudgetModal.value = true
  }
}

const openEditBudget = (item: any) => { editingBudget.value = { id: item.id, categoryId: item.categoryId, month: item.month, amount: item.amount }; showBudgetEdit.value = true }
const handleDeleteBudget = (id: string) => { if (confirm('Hapus pagu kategori ini?')) store.deleteBudget(id) }
const handleDeleteCategory = (id: string) => {
  const ok = store.deleteCategory(id)
  if (!ok) alert('Kategori tidak bisa dihapus karena masih memiliki pagu. Hapus pagunya dulu.')
}
</script>

<template>
  <section class="flex flex-col gap-space-md">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
      <div>
        <div class="flex items-center gap-space-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
          <h2 class="font-headline-md text-headline-md text-on-surface">Pemantauan Pagu Kategori</h2>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Pantau rasio konsumsi dana dan kelola kategori + pagu.</p>
      </div>
      <span class="self-start sm:self-auto font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-sm py-1 rounded-full whitespace-nowrap">
        Threshold: &gt;90% Peringatan
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md lg:gap-space-lg">
      <div v-for="item in store.enriched" :key="item.id"
        :class="['p-space-lg rounded-2xl shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow relative overflow-hidden', item.percent > 100 ? 'ring-2 ring-error/20 bg-error-container/10' : 'bg-surface-container-lowest']">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-space-sm min-w-0">
            <div :class="['w-11 h-11 rounded-full flex items-center justify-center shrink-0', item.category?.iconBg]">
              <span :class="['material-symbols-outlined text-[24px]', item.category?.iconColor]">{{ item.category?.icon }}</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-title-md text-title-md truncate" :class="item.percent > 100 ? 'text-error' : 'text-on-surface'">{{ item.category?.name }}</h3>
              <span class="font-body-sm text-body-sm text-on-surface-variant truncate block">{{ item.category?.description }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button @click="openEditCategory(item.category)" title="Edit kategori" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button @click="openEditBudget(item)" title="Edit pagu" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors">
              <span class="material-symbols-outlined text-[18px]">tune</span>
            </button>
            <button @click="handleDeleteBudget(item.id)" title="Hapus pagu" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-error-container text-on-surface-variant hover:text-error transition-colors">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-space-xs">
          <div class="flex justify-between items-baseline gap-2">
            <span class="font-headline-sm tabular-nums font-semibold truncate" :class="item.percent > 100 ? 'text-error' : 'text-on-surface'">{{ rupiah(item.spent) }}</span>
            <span class="font-body-sm text-on-surface-variant whitespace-nowrap">dari {{ rupiah(item.amount) }}</span>
          </div>
          <div class="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
            <div :class="['h-full rounded-full transition-all', item.percent > 100 ? 'bg-error' : item.percent >= 90 ? 'bg-primary' : item.percent >= 70 ? 'bg-tertiary' : 'bg-secondary']" :style="{ width: Math.min(item.percent, 100) + '%' }"></div>
          </div>
          <div class="flex justify-between items-center font-body-sm pt-1 gap-2 flex-wrap">
            <span class="text-on-surface-variant">Sisa: <strong :class="item.remaining < 0 ? 'text-error' : 'text-on-surface'">{{ rupiah(item.remaining) }}</strong></span>
            <span :class="['font-semibold text-xs px-2 py-0.5 rounded-full whitespace-nowrap', item.percent > 100 ? 'bg-error text-on-error' : item.percent >= 90 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-secondary-container text-on-secondary-container']">
              {{ item.percent }}% {{ item.percent > 100 ? 'Over!' : item.percent >= 90 ? 'Waspada' : 'Aman' }}
            </span>
          </div>
        </div>

        <button @click="handleDeleteCategory(item.categoryId)" class="text-xs text-on-surface-variant hover:text-error self-end font-medium">Hapus kategori</button>
      </div>

      <div @click="openAddCategory" class="border-2 border-dashed border-outline/30 bg-surface-container-low/60 rounded-2xl p-space-lg flex flex-col items-center justify-center text-center gap-space-sm cursor-pointer hover:bg-surface-container-high transition-colors group min-h-[220px]">
        <div class="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-[28px]">post_add</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-headline-sm text-headline-sm text-on-surface">Tambah Kategori Baru</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant max-w-[220px] mt-1">Buat wadah baru, lalu isi pagunya</span>
        </div>
      </div>
    </div>

    <CategoryModal :is-open="showCatModal" :editing="editingCat" @close="showCatModal = false" @save="saveCategory" />
    <BudgetModal :is-open="showBudgetModal" :editing="null" @close="showBudgetModal = false" />
    <BudgetModal :is-open="showBudgetEdit" :editing="editingBudget" @close="showBudgetEdit = false" />
  </section>
</template>
