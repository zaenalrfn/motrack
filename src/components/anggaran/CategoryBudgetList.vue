<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useBudgetStore } from '../../stores/useBudgetStore'
import CategoryModal from './CategoryModal.vue'
import BudgetModal from './BudgetModal.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import type { BudgetCategory } from '../../services/budgetService'

const store = useBudgetStore()
const showCatModal = ref(false)
const showBudgetModal = ref(false)
const showBudgetEdit = ref(false)
const editingCat = ref<BudgetCategory | null>(null)
const editingBudget = ref<{ id: string; categoryId: string; month: string; amount: number } | null>(null)
const modalError = ref('')
const showConfirmation = ref(false)
const confirmationType = ref<'category' | 'budget' | null>(null)
const selectedCategory = ref<BudgetCategory | null>(null)
const selectedBudget = ref<{ id: string; categoryName: string; month: string; amount: number } | null>(null)
const confirmationError = ref('')
const confirmationLoading = ref(false)

const openAddBudget = () => {
  editingBudget.value = null
  modalError.value = ''
  showBudgetModal.value = true
}
const onOpenAddBudget = () => openAddBudget()
onMounted(() => {
  document.addEventListener('open-add-budget', onOpenAddBudget)
  if (!store.loading && store.categories.length === 0) store.loadBudgetData()
})
onUnmounted(() => document.removeEventListener('open-add-budget', onOpenAddBudget))

const rupiah = (value: number) => 'Rp ' + value.toLocaleString('id-ID')
const openAddCategory = () => { editingCat.value = null; modalError.value = ''; showCatModal.value = true }
const openEditCategory = (category: BudgetCategory | undefined) => {
  if (!category) return
  editingCat.value = category
  modalError.value = ''
  showCatModal.value = true
}

const saveCategory = async (payload: { name: string; description: string; type: 'expense' | 'income'; icon: string }) => {
  modalError.value = ''
  try {
    if (editingCat.value) {
      await store.editCategory(editingCat.value.id, payload)
    } else {
      await store.addCategory(payload)
      showCatModal.value = false
      openAddBudget()
      return
    }
    showCatModal.value = false
  } catch (error) {
    const details = error as { code?: string; message?: string; hint?: string; details?: string }
    modalError.value = [details.code, details.message, details.details, details.hint]
      .filter(Boolean)
      .join(' — ') || 'Gagal menyimpan kategori.'
    console.error('Gagal menyimpan kategori:', error)
  }
}

const openEditBudget = (item: { id: string; categoryId: string; month: string; amount: number; categoryBudget?: { id: string; category_id: string; month: string; amount: number } }) => {
  if (!item.categoryBudget) {
    editingBudget.value = null
    modalError.value = ''
    showBudgetModal.value = true
    return
  }

  editingBudget.value = {
    id: item.categoryBudget.id,
    categoryId: item.categoryBudget.category_id,
    month: item.categoryBudget.month,
    amount: item.categoryBudget.amount,
  }
  modalError.value = ''
  showBudgetEdit.value = true
}

const saveBudget = async (payload: { id?: string; categoryId: string; month: string; amount: number }) => {
  modalError.value = ''
  try {
    if (payload.id) await store.editBudget(payload.id, payload.amount)
    else await store.addBudget(payload.categoryId, payload.month, payload.amount)
    showBudgetModal.value = false
    showBudgetEdit.value = false
  } catch (error) {
    modalError.value = error instanceof Error ? error.message : 'Gagal menyimpan pagu.'
  }
}

const requestDeleteBudget = (budget: { id: string; categoryName: string; month: string; amount: number }) => {
  confirmationType.value = 'budget'
  selectedBudget.value = budget
  selectedCategory.value = null
  confirmationError.value = ''
  showConfirmation.value = true
}

const requestDeleteCategory = (category: BudgetCategory) => {
  if (store.budgets.some((budget) => budget.category_id === category.id)) {
    confirmationType.value = null
    selectedCategory.value = category
    confirmationError.value = 'Kategori ini masih memiliki pagu. Hapus pagunya terlebih dahulu sebelum menghapus kategori.'
    showConfirmation.value = true
    return
  }

  confirmationType.value = 'category'
  selectedCategory.value = category
  selectedBudget.value = null
  confirmationError.value = ''
  showConfirmation.value = true
}

const closeConfirmation = () => {
  if (confirmationLoading.value) return
  showConfirmation.value = false
  confirmationType.value = null
  selectedCategory.value = null
  selectedBudget.value = null
  confirmationError.value = ''
}

const confirmDeletion = async () => {
  if (!confirmationType.value) return

  confirmationLoading.value = true
  confirmationError.value = ''
  try {
    if (confirmationType.value === 'budget' && selectedBudget.value) {
      await store.removeBudget(selectedBudget.value.id)
    }

    if (confirmationType.value === 'category' && selectedCategory.value) {
      const removed = await store.removeCategory(selectedCategory.value.id)
      if (!removed) {
        confirmationError.value = 'Kategori ini masih memiliki pagu. Hapus pagunya terlebih dahulu.'
        return
      }
    }

    closeConfirmation()
  } catch (error) {
    confirmationError.value = error instanceof Error ? error.message : 'Gagal menghapus data.'
  } finally {
    confirmationLoading.value = false
  }
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
      <span class="self-start sm:self-auto font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-sm py-1 rounded-full whitespace-nowrap">Threshold: &gt;90% Peringatan</span>
    </div>

    <div v-if="store.error" class="rounded-xl bg-error-container text-on-error-container px-4 py-3 text-sm">{{ store.error }}</div>
    <div v-if="store.loading" class="rounded-2xl bg-surface-container-low p-space-xl text-center text-on-surface-variant">Memuat kategori dan pagu...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md lg:gap-space-lg">
      <div v-for="item in store.enriched" :key="item.id" :class="['p-space-lg rounded-2xl shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow relative overflow-hidden', item.percent > 100 ? 'ring-2 ring-error/20 bg-error-container/10' : 'bg-surface-container-lowest']">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-space-sm min-w-0">
            <div :class="['w-11 h-11 rounded-full flex items-center justify-center shrink-0', item.category?.icon_bg ?? 'bg-surface-container']">
              <span :class="['material-symbols-outlined text-[24px]', item.category?.icon_color ?? 'text-secondary']">{{ item.category?.icon ?? 'category' }}</span>
            </div>
            <div class="min-w-0">
              <h3 class="font-title-md text-title-md truncate" :class="item.percent > 100 ? 'text-error' : 'text-on-surface'">{{ item.category?.name }}</h3>
              <span class="font-body-sm text-body-sm text-on-surface-variant truncate block">{{ item.category?.description ?? 'Tanpa deskripsi' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button @click="openEditCategory(item.category)" title="Edit kategori" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined text-[18px]">edit</span></button>
            <button @click="openEditBudget(item)" :title="item.categoryBudget ? 'Edit pagu' : 'Tambah pagu'" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-on-surface-variant hover:text-secondary transition-colors"><span class="material-symbols-outlined text-[18px]">{{ item.categoryBudget ? 'tune' : 'add_circle' }}</span></button>
            <button v-if="item.categoryBudget" @click="requestDeleteBudget({ id: item.categoryBudget.id, categoryName: item.category?.name ?? 'Kategori', month: item.categoryBudget.month, amount: item.categoryBudget.amount })" title="Hapus pagu" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-error-container text-on-surface-variant hover:text-error transition-colors"><span class="material-symbols-outlined text-[18px]">delete</span></button>
          </div>
        </div>

        <div class="flex flex-col gap-space-xs">
          <div class="flex justify-between items-baseline gap-2"><span class="font-headline-sm tabular-nums font-semibold truncate" :class="item.percent > 100 ? 'text-error' : 'text-on-surface'">{{ item.categoryBudget ? rupiah(item.spent) : 'Belum ada pagu' }}</span><span v-if="item.categoryBudget" class="font-body-sm text-on-surface-variant whitespace-nowrap">dari {{ rupiah(item.amount) }}</span></div>
          <div v-if="item.categoryBudget" class="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5"><div :class="['h-full rounded-full transition-all', item.percent > 100 ? 'bg-error' : item.percent >= 90 ? 'bg-primary' : item.percent >= 70 ? 'bg-tertiary' : 'bg-secondary']" :style="{ width: Math.min(item.percent, 100) + '%' }"></div></div>
          <div v-if="item.categoryBudget" class="flex justify-between items-center font-body-sm pt-1 gap-2 flex-wrap"><span class="text-on-surface-variant">Sisa: <strong :class="item.remaining < 0 ? 'text-error' : 'text-on-surface'">{{ rupiah(item.remaining) }}</strong></span><span :class="['font-semibold text-xs px-2 py-0.5 rounded-full whitespace-nowrap', item.percent > 100 ? 'bg-error text-on-error' : item.percent >= 90 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-secondary-container text-on-secondary-container']">{{ item.percent }}% {{ item.percent > 100 ? 'Over!' : item.percent >= 90 ? 'Waspada' : 'Aman' }}</span></div>
          <span v-else class="text-xs text-on-surface-variant">Tambahkan pagu untuk mulai memantau realisasi kategori ini.</span>
        </div>
        <button @click="item.category && requestDeleteCategory(item.category)" class="text-xs text-on-surface-variant hover:text-error self-end font-medium">Hapus kategori</button>
      </div>

      <div @click="openAddCategory" class="border-2 border-dashed border-outline/30 bg-surface-container-low/60 rounded-2xl p-space-lg flex flex-col items-center justify-center text-center gap-space-sm cursor-pointer hover:bg-surface-container-high transition-colors group min-h-[220px]"><div class="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-[28px]">post_add</span></div><div class="flex flex-col items-center"><span class="font-headline-sm text-headline-sm text-on-surface">Tambah Kategori Baru</span><span class="font-body-sm text-body-sm text-on-surface-variant max-w-[220px] mt-1">Buat wadah baru, lalu isi pagunya</span></div></div>
    </div>

    <CategoryModal :is-open="showCatModal" :editing="editingCat" :loading="store.saving" :error="modalError" @close="showCatModal = false" @save="saveCategory" />
    <BudgetModal :is-open="showBudgetModal" :editing="null" :loading="store.saving" :error="modalError" @close="showBudgetModal = false" @save="saveBudget" />
    <BudgetModal :is-open="showBudgetEdit" :editing="editingBudget" :loading="store.saving" :error="modalError" @close="showBudgetEdit = false" @save="saveBudget" />

    <ConfirmationModal
      :is-open="showConfirmation"
      :title="confirmationType === 'category' ? 'Hapus kategori ini?' : 'Hapus pagu ini?'"
      :message="confirmationType === 'category'
        ? `Kategori \'${selectedCategory?.name ?? ''}\' akan dihapus dari household.`
        : `Pagu ${selectedBudget?.categoryName ?? ''} untuk ${selectedBudget?.month ?? ''} akan dihapus.`"
      :detail="confirmationType === 'category'
        ? 'Pastikan kategori ini tidak lagi diperlukan. Tindakan ini tidak dapat dibatalkan.'
        : 'Data transaksi tidak akan ikut terhapus, hanya pengaturan pagu bulan ini yang dihapus.'"
      confirm-label="Ya, Hapus"
      :loading="confirmationLoading"
      :error="confirmationError"
      @close="closeConfirmation"
      @confirm="confirmDeletion"
    />
  </section>
</template>
