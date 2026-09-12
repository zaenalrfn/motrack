<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import { useBudgetStore } from '../stores/useBudgetStore'
import { useAuthStore } from '../stores/useAuthStore'
import AnggaranSummaryCards from '../components/anggaran/AnggaranSummaryCards.vue'
import CategoryBudgetList from '../components/anggaran/CategoryBudgetList.vue'
import GranularVisibilityMatrix from '../components/anggaran/GranularVisibilityMatrix.vue'

const showBulkModal = ref(false)
const budgetStore = useBudgetStore()
const authStore = useAuthStore()

const triggerAddBudget = () => {
  document.dispatchEvent(new CustomEvent('open-add-budget'))
}

const openBulkModal = () => {
  showBulkModal.value = true
}

const closeBulkModal = () => {
  showBulkModal.value = false
}

onMounted(async () => {
  if (!authStore.initialized) await authStore.initAuth()
  if (budgetStore.householdId) await budgetStore.loadBudgetData()
})

watch(() => budgetStore.householdId, (householdId) => {
  if (householdId && authStore.initialized) budgetStore.loadBudgetData()
})

const applyBulkGrant = () => {
  // Logic to apply bulk grant
  setTimeout(() => {
    closeBulkModal()
  }, 1000)
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
            <span>Bulk Grant Izin</span>
            <span class="px-space-xs py-0.5 rounded-full bg-primary text-on-primary font-label-sm">FR-18</span>
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
      <div v-if="showBulkModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md overflow-y-auto">
        <div class="w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-xl p-5 sm:p-space-xl flex flex-col gap-space-md sm:gap-space-lg relative overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 my-4">
          <!-- Modal Header -->
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-space-sm">
              <div class="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span class="material-symbols-outlined text-[28px] fill-1">security</span>
              </div>
              <div>
                <div class="flex items-center gap-space-xs">
                  <span class="font-label-sm text-label-sm uppercase font-semibold text-primary">FR-18 Otorisasi Akses Massal</span>
                </div>
                <h3 class="font-headline-sm text-headline-sm text-on-surface font-semibold">Konfirmasi Perubahan Izin Massal (Bulk Grant)</h3>
              </div>
            </div>
            <button @click="closeBulkModal" class="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Modal Warning -->
          <div class="bg-tertiary-fixed/30 p-space-md rounded-lg flex items-start gap-space-sm border border-tertiary-fixed/50">
            <span class="material-symbols-outlined text-tertiary text-[24px] mt-0.5 fill-1">info</span>
            <div class="flex flex-col gap-1">
              <span class="font-title-md text-on-tertiary-fixed font-semibold">Peringatan Transparansi Finansial</span>
              <p class="font-body-md text-on-surface leading-relaxed">
                Anda akan memberikan hak akses <strong class="text-primary font-semibold">“Lihat Budget Penuh”</strong> untuk <strong>2 anggota (Budi, Dinda)</strong> pada <strong>3 kategori (Makanan, Tagihan, Pendidikan)</strong>. Anggota yang dipilih dapat melihat pagu nominal dan sisa anggaran keluarga untuk kategori tersebut.
              </p>
            </div>
          </div>

          <!-- Detail Badges -->
          <div class="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-lg">
            <span class="font-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Rincian Perubahan yang Diterapkan:</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-1">
              <div class="flex items-center gap-space-xs bg-surface-container-lowest p-space-xs rounded-full px-space-sm shadow-sm border border-surface-container">
                <span class="material-symbols-outlined text-primary text-[18px]">group</span>
                <span class="font-body-sm text-on-surface font-medium">Budi Santoso & Dinda Putri</span>
              </div>
              <div class="flex items-center gap-space-xs bg-surface-container-lowest p-space-xs rounded-full px-space-sm shadow-sm border border-surface-container">
                <span class="material-symbols-outlined text-secondary text-[18px]">category</span>
                <span class="font-body-sm text-on-surface font-medium">Makanan, Tagihan, Pendidikan</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-space-sm pt-space-xs">
            <button @click="closeBulkModal" class="px-space-lg py-3 rounded-full font-label-lg text-on-surface-variant hover:bg-surface-container transition-colors">
              Batal
            </button>
            <button @click="applyBulkGrant" class="flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary px-space-xl py-3 rounded-full font-label-lg font-semibold transition-all active:scale-95 shadow-md whitespace-nowrap">
              <span class="material-symbols-outlined text-[20px]">check_circle</span>
              <span>Terapkan Izin Massal</span>
            </button>
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
