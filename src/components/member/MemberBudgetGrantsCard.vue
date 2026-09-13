<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import { useBudgetStore } from '../../stores/useBudgetStore'
import { usePermissionStore } from '../../stores/usePermissionStore'

const authStore = useAuthStore()
const budgetStore = useBudgetStore()
const permissionStore = usePermissionStore()

const memberId = computed(() => authStore.currentMember?.id as string | undefined)

const visibleBudgets = computed(() => {
  return budgetStore.enriched.filter((item) => {
    if (item.category.type !== 'expense') return false
    if (!memberId.value) return false
    if (authStore.currentMember?.role === 'admin') return true
    return permissionStore.hasAccess(memberId.value, item.categoryId)
  })
})

const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID')
</script>

<template>
  <section class="flex flex-col gap-space-sm">
    <div class="flex items-center justify-between">
      <div>
        <span class="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">Visibilitas Pagu Rumah Tangga (FR-16)</span>
        <h2 class="font-headline-sm text-headline-sm text-on-surface font-bold">Pagu Kategori Bulanan</h2>
      </div>
      <div class="flex items-center gap-space-2xs text-on-surface-variant font-body-sm text-body-sm bg-surface-container-low px-space-sm py-1 rounded-full">
        <span class="material-symbols-outlined text-sm text-secondary">visibility</span>
        <span>{{ visibleBudgets.length }} Terbuka</span>
      </div>
    </div>
    <div v-if="budgetStore.loading" class="text-center py-8 text-on-surface-variant">Memuat pagu...</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
      <div v-for="item in visibleBudgets" :key="item.categoryId" class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-sm border border-surface-variant/30 flex flex-col justify-between gap-space-md relative overflow-hidden transition-all hover:shadow-md">
        <div class="absolute top-0 left-0 h-1.5 w-full" :class="item.percent > 90 ? 'bg-primary' : item.percent >= 70 ? 'bg-tertiary-container' : 'bg-secondary'"></div>
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-space-sm">
            <div class="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">{{ item.category.icon || 'shopping_cart' }}</span>
            </div>
            <div>
              <h3 class="font-title-md text-title-md text-on-surface font-semibold">{{ item.category.name }}</h3>
              <span class="font-label-sm text-label-sm text-secondary bg-secondary-fixed/50 px-space-xs py-0.5 rounded-full font-medium">Akses Penuh Diberikan</span>
            </div>
          </div>
          <span class="material-symbols-outlined text-secondary text-sm">lock_open</span>
        </div>
        <div class="flex flex-col gap-space-xs">
          <div class="flex items-baseline justify-between">
            <span class="font-body-sm text-body-sm text-on-surface-variant">Terpakai Bersama</span>
            <span class="font-headline-sm text-headline-sm text-on-surface font-bold tabular-nums">{{ formatRupiah(item.spent) }}</span>
          </div>
          <div class="w-full bg-surface-container h-2.5 rounded-full overflow-hidden">
            <div :class="['h-full rounded-full transition-all duration-700', item.percent > 90 ? 'bg-primary' : item.percent >= 70 ? 'bg-tertiary-container' : 'bg-secondary']" :style="{ width: Math.min(item.percent, 100) + '%' }"></div>
          </div>
          <div class="flex items-center justify-between font-label-md text-label-md pt-space-2xs">
            <span class="text-secondary font-semibold tabular-nums">Tersisa {{ formatRupiah(Math.max(item.remaining, 0)) }}</span>
            <span class="text-on-surface-variant font-normal tabular-nums">Pagu {{ formatRupiah(item.amount) }}</span>
          </div>
        </div>
        <div class="bg-surface-container-low rounded-DEFAULT p-space-xs px-3 flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
          <span>Deskripsi pos:</span>
          <span class="font-semibold text-on-surface truncate ml-2">{{ item.category.description || 'Pagu terpantau bersama' }}</span>
        </div>
      </div>
      <div v-if="!visibleBudgets.length" class="col-span-2 text-center py-8 text-on-surface-variant">
        Belum ada pagu terbuka untuk Anda bulan ini.
      </div>
    </div>
  </section>
</template>
