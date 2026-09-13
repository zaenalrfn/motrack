<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import { useBudgetStore } from '../stores/useBudgetStore'
import { useAuthStore } from '../stores/useAuthStore'
import { usePermissionStore } from '../stores/usePermissionStore'
import AnggaranSummaryCards from '../components/anggaran/AnggaranSummaryCards.vue'
import CategoryBudgetList from '../components/anggaran/CategoryBudgetList.vue'
import GranularVisibilityMatrix from '../components/anggaran/GranularVisibilityMatrix.vue'

const showBulkModal = ref(false)
const budgetStore = useBudgetStore()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()

const selectedMemberIds = ref<string[]>([])
const selectedCategoryIds = ref<string[]>([])

const nonAdminMembers = computed(() => permissionStore.members.filter(m => m.role !== 'admin'))

const triggerAddBudget = () => {
  document.dispatchEvent(new CustomEvent('open-add-budget'))
}

const openBulkModal = () => {
  selectedMemberIds.value = []
  selectedCategoryIds.value = []
  showBulkModal.value = true
}

const closeBulkModal = () => {
  showBulkModal.value = false
}

onMounted(async () => {
  if (!authStore.initialized) await authStore.initAuth()
  if (budgetStore.householdId) {
    await Promise.all([
      budgetStore.loadBudgetData(),
      permissionStore.loadMatrix()
    ])
  }
})

watch(() => budgetStore.householdId, (householdId) => {
  if (householdId && authStore.initialized) {
    budgetStore.loadBudgetData()
    permissionStore.loadMatrix()
  }
})

const applyBulkGrant = async () => {
  if (selectedMemberIds.value.length === 0 || selectedCategoryIds.value.length === 0) {
    alert('Pilih minimal satu anggota dan satu kategori.')
    return
  }

  try {
    await permissionStore.grantMultipleAccess(selectedMemberIds.value, selectedCategoryIds.value)
    closeBulkModal()
  } catch (err) {
    // Error handled by store
  }
}
</script>

<template>
  <MainLayout>
    <div class="w-full px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-space-xl space-y-space-xl lg:space-y-space-2xl">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md lg:gap-space-lg">
        <div class="flex flex-col gap-space-xs min-w-0">
          <div class="flex flex-wrap items-center gap-space-xs">
            <span class="px-space-sm py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm uppercase tracking-wider font-semibold whitespace-nowrap">FR-05 • Anggaran Bulanan</span>
            <span class="flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold whitespace-nowrap">
              <span class="material-symbols-outlined text-[15px] fill-1">verified_user</span> Hak Admin Aktif
            </span>
          </div>
          <h1 class="text-[24px] sm:text-[28px] lg:text-headline-lg lg:text-[32px] text-on-surface tracking-tight font-bold leading-tight">Pengaturan Anggaran {{ new Date(`${budgetStore.selectedMonth}-01`).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) }}</h1>
          <p class="text-sm sm:text-body-md text-on-surface-variant max-w-2xl">
            <strong>Wadah (Kategori)</strong> untuk mencatat transaksi, <strong>Isi (Pagu)</strong> untuk batas maksimal bulanan.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row lg:flex-wrap items-stretch sm:items-center gap-space-sm shrink-0">
          <button @click="openBulkModal" class="flex items-center justify-center gap-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-space-lg py-3 rounded-full font-label-lg transition-transform active:scale-95 shadow-sm whitespace-nowrap">
            <span class="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
            <span>Berikan Akses Massal</span>
          </button>
          <button @click="triggerAddBudget" class="flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary px-space-lg py-3 rounded-full font-label-lg transition-transform active:scale-95 shadow-sm whitespace-nowrap">
            <span class="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Tambah Pagu Kategori</span>
          </button>
        </div>
      </div>

      <!-- Summary Metric Cards -->
      <AnggaranSummaryCards />

      <!-- Category Budget List -->
      <CategoryBudgetList />

      <!-- Granular Visibility Matrix -->
      <GranularVisibilityMatrix @open-bulk="openBulkModal" />

      <!-- Bulk Grant Modal -->
      <div v-if="showBulkModal" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-on-surface/50 backdrop-blur-sm" @click="closeBulkModal"></div>
        <div class="relative min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6">
          <div class="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl sm:rounded-3xl shadow-xl ring-1 ring-black/5 flex flex-col max-h-[90vh] overflow-hidden">
            <!-- Modal Header (compact, sticky) -->
            <div class="flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-surface-container shrink-0">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                  <span class="material-symbols-outlined text-[22px] sm:text-[24px] fill-1">security</span>
                </div>
                <div class="min-w-0">
                  <span class="font-label-sm text-[11px] uppercase font-semibold text-primary">Kelola Akses Cepat</span>
                  <h3 class="font-bold text-on-surface text-base sm:text-lg leading-tight truncate">Berikan Akses Massal</h3>
                  <p class="text-xs sm:text-[13px] text-on-surface-variant truncate">Pilih anggota & kategori, terapkan sekaligus.</p>
                </div>
              </div>
              <button @click="closeBulkModal" class="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors shrink-0">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Modal Body (scrollable) -->
            <div class="flex flex-col gap-3 sm:gap-4 px-4 sm:px-6 py-4 overflow-y-auto">
              <!-- Info ringkas -->
              <div class="bg-tertiary-fixed/25 px-3 py-2.5 rounded-xl flex items-center gap-2 border border-tertiary-fixed/40 text-[12px] sm:text-[13px] text-on-surface">
                <span class="material-symbols-outlined text-tertiary text-[18px] shrink-0 fill-1">info</span>
                <span>Anggota terpilih bisa melihat pagu & sisa anggaran kategori tersebut.</span>
              </div>

              <!-- Member & Category Selections -->
              <div class="grid grid-cols-1 sm:grid-cols-1 gap-3">
                <div class="flex flex-col gap-2 bg-surface-container-low p-3 rounded-md">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">1. Anggota ({{ selectedMemberIds.length }})</span>
                    <button v-if="nonAdminMembers.length" @click="selectedMemberIds = selectedMemberIds.length === nonAdminMembers.length ? [] : nonAdminMembers.map(m => m.id)" class="text-[11px] font-semibold text-primary hover:underline">{{ selectedMemberIds.length === nonAdminMembers.length ? 'Hapus' : 'Semua' }}</button>
                  </div>
                  <div class="flex flex-col gap-1.5 max-h-36 sm:max-h-44 overflow-y-auto pr-0.5">
                    <label v-for="member in nonAdminMembers" :key="member.id" class="flex items-center gap-2 text-on-surface bg-surface-container-lowest py-1.5 px-2.5 rounded-lg border border-surface-container text-[13px] cursor-pointer hover:border-primary/40 transition-colors">
                      <input type="checkbox" :value="member.id" v-model="selectedMemberIds" :disabled="permissionStore.saving" class="w-4 h-4 rounded text-primary accent-primary cursor-pointer disabled:opacity-50 shrink-0" />
                      <span class="font-medium truncate">{{ member.name }}</span>
                    </label>
                    <div v-if="!nonAdminMembers.length" class="text-xs text-on-surface-variant py-2 text-center">Belum ada anggota non-admin.</div>
                  </div>
                </div>
                <div class="flex flex-col gap-2 bg-surface-container-low p-3 rounded-md">
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">2. Kategori ({{ selectedCategoryIds.length }})</span>
                    <button v-if="permissionStore.categories.length" @click="selectedCategoryIds = selectedCategoryIds.length === permissionStore.categories.length ? [] : permissionStore.categories.map(c => c.id)" class="text-[11px] font-semibold text-primary hover:underline">{{ selectedCategoryIds.length === permissionStore.categories.length ? 'Hapus' : 'Semua' }}</button>
                  </div>
                  <div class="flex flex-col gap-1.5 max-h-36 sm:max-h-44 overflow-y-auto pr-0.5">
                    <label v-for="category in permissionStore.categories" :key="category.id" class="flex items-center gap-2 text-on-surface bg-surface-container-lowest py-1.5 px-2.5 rounded-lg border border-surface-container text-[13px] cursor-pointer hover:border-primary/40 transition-colors">
                      <input type="checkbox" :value="category.id" v-model="selectedCategoryIds" :disabled="permissionStore.saving" class="w-4 h-4 rounded text-primary accent-primary cursor-pointer disabled:opacity-50 shrink-0" />
                      <span class="font-medium truncate">{{ category.name }}</span>
                    </label>
                    <div v-if="!permissionStore.categories.length" class="text-xs text-on-surface-variant py-2 text-center">Belum ada kategori.</div>
                  </div>
                </div>
              </div>

              <div v-if="permissionStore.error" class="rounded-xl bg-error-container text-on-error-container px-3 py-2.5 text-[13px]">{{ permissionStore.error }}</div>
              <div v-if="selectedMemberIds.length && selectedCategoryIds.length" class="bg-secondary-fixed/20 px-3 py-2.5 rounded-xl border border-secondary-fixed/50 text-[12px] sm:text-[13px] text-on-surface">
                Beri akses <strong>{{ selectedCategoryIds.length }} kategori</strong> ke <strong>{{ selectedMemberIds.length }} anggota</strong>.
              </div>
            </div>

            <!-- Actions (sticky footer) -->
            <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t border-surface-container bg-surface-container-lowest shrink-0">
              <button @click="closeBulkModal" :disabled="permissionStore.saving" class="px-5 py-2.5 rounded-full text-sm text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50">
                Batal
              </button>
              <button @click="applyBulkGrant" :disabled="permissionStore.saving || !selectedMemberIds.length || !selectedCategoryIds.length" class="flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-5 py-2.5 rounded-full text-sm font-semibold transition-all active:scale-95 shadow-md disabled:opacity-50">
                <span class="material-symbols-outlined text-[18px]" :class="permissionStore.saving ? 'animate-spin' : ''">{{ permissionStore.saving ? 'refresh' : 'check_circle' }}</span>
                <span>{{ permissionStore.saving ? 'Menyimpan...' : `Terapkan (${selectedMemberIds.length * selectedCategoryIds.length})` }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.fill-1 {
  font-variation-settings: 'FILL' 1;
}
</style>
