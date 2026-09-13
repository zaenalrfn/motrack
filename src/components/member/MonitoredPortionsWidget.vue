<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import { useBudgetStore } from '../../stores/useBudgetStore'
import { usePermissionStore } from '../../stores/usePermissionStore'
import { useTransactionStore } from '../../stores/useTransactionStore'

const authStore = useAuthStore()
const budgetStore = useBudgetStore()
const permissionStore = usePermissionStore()
const transactionStore = useTransactionStore()

const hoveredId = ref<string | null>(null)

const memberId = computed(() => authStore.currentMember?.id as string | undefined)

const visibleBudgets = computed(() => {
  return budgetStore.enriched.filter((item) => {
    if (item.category.type !== 'expense' || item.amount <= 0) return false
    if (authStore.currentMember?.role === 'admin') return true
    return memberId.value ? permissionStore.hasAccess(memberId.value, item.categoryId) : false
  })
})

const palette = ['#2d6a48', '#b15f00', '#9e3c26', '#57423d', '#8a726c', '#33704e']

const mySpending = computed(() => {
  if (!memberId.value) return []
  const totals = new Map<string, number>()
  transactionStore.transactions
    .filter((t) => t.created_by === memberId.value && t.type === 'expense' && t.category_id)
    .forEach((t) => {
      totals.set(t.category_id as string, (totals.get(t.category_id as string) ?? 0) + t.amount)
    })
  const total = [...totals.values()].reduce((s, v) => s + v, 0)
  return [...totals.entries()]
    .map(([categoryId, mySpent], i) => {
      const budget = visibleBudgets.value.find((b) => b.categoryId === categoryId)
      const name = budget?.category.name ?? transactionStore.categories.find((c) => c.id === categoryId)?.name ?? 'Lain-lain'
      const pagu = budget?.amount ?? 0
      return {
        categoryId,
        name,
        mySpent,
        pagu,
        pct: total ? (mySpent / total) * 100 : 0,
        color: palette[i % palette.length],
      }
    })
    .sort((a, b) => b.mySpent - a.mySpent)
})

const totalMySpent = computed(() => mySpending.value.reduce((s, x) => s + x.mySpent, 0))
const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID')

const dashSegments = computed(() => {
  let offset = 25
  return mySpending.value.map((s) => {
    const seg = { ...s, offset }
    offset -= s.pct
    return seg
  })
})

const hovered = computed(() => mySpending.value.find((x) => x.categoryId === hoveredId.value) ?? null)
</script>

<template>
  <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-sm border border-surface-variant/30 flex flex-col gap-space-md">
    <div>
      <h3 class="font-title-md text-title-md text-on-surface font-semibold">Porsi Amplop Terbuka</h3>
      <p class="font-body-sm text-body-sm text-on-surface-variant">Persentase pengeluaran Anda per kategori bulan ini</p>
    </div>

    <div class="flex items-center justify-center py-space-xs">
      <div class="relative w-40 h-40 flex items-center justify-center">
        <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#eaedff" stroke-width="3.5"></circle>
          <circle
            v-for="s in dashSegments"
            :key="s.categoryId"
            cx="18" cy="18" r="15.9155"
            fill="none"
            :stroke="s.color"
            :stroke-width="hoveredId === s.categoryId ? 5 : 3.5"
            :stroke-dasharray="`${Math.max(s.pct, s.pct > 0 ? 2 : 0)} 100`"
            :stroke-dashoffset="s.offset"
            stroke-linecap="round"
            class="transition-all duration-300 cursor-pointer"
            :opacity="hoveredId && hoveredId !== s.categoryId ? 0.35 : 1"
            @mouseenter="hoveredId = s.categoryId"
            @mouseleave="hoveredId = null"
          ></circle>
        </svg>
        <div class="absolute flex flex-col items-center justify-center text-center pointer-events-none px-3">
          <template v-if="hovered">
            <span class="font-label-sm text-[11px] font-bold uppercase truncate max-w-[110px]" :style="{ color: hovered.color }">{{ hovered.name }}</span>
            <span class="font-label-md font-extrabold text-on-surface tabular-nums">{{ formatRupiah(hovered.mySpent) }}</span>
            <span class="font-body-sm text-[10px] text-on-surface-variant tabular-nums">{{ Math.round(hovered.pct) }}% dari pengeluaran Anda</span>
          </template>
          <template v-else>
            <span class="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Total pengeluaran Anda</span>
            <span class="font-headline-sm text-base font-bold text-on-surface tabular-nums">{{ formatRupiah(totalMySpent) }}</span>
            <span class="font-body-sm text-[10px] text-on-surface-variant">{{ mySpending.length }} kategori</span>
          </template>
        </div>
      </div>
    </div>

    <div v-if="hovered" class="rounded-DEFAULT bg-surface-container-low px-3 py-2 text-[12px] leading-relaxed text-on-surface-variant">
      <span class="font-semibold text-on-surface">{{ hovered.name }}</span>
      {{ formatRupiah(hovered.mySpent) }} ({{ Math.round(hovered.pct) }}%)
      <span v-if="hovered.pagu > 0"> dari pagu {{ formatRupiah(hovered.pagu) }}</span>
    </div>

    <div class="flex flex-col gap-space-xs">
      <div
        v-for="b in mySpending"
        :key="b.categoryId"
        @mouseenter="hoveredId = b.categoryId"
        @mouseleave="hoveredId = null"
        :class="['flex items-center justify-between p-space-xs px-3 rounded-DEFAULT transition-all cursor-pointer border', hoveredId === b.categoryId ? 'bg-surface-container border-current shadow-sm translate-x-1' : 'bg-surface-container-low border-transparent']"
      >
        <div class="flex items-center gap-space-xs min-w-0">
          <span class="w-3 h-3 rounded-full shrink-0 transition-transform duration-300" :style="{ backgroundColor: b.color, transform: hoveredId === b.categoryId ? 'scale(1.4)' : 'scale(1)' }"></span>
          <span class="text-on-surface font-medium truncate text-[13px]">{{ b.name }}</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <span class="font-bold tabular-nums text-[13px]" :style="{ color: b.color }">{{ Math.round(b.pct) }}%</span>
          <span class="font-semibold text-on-surface tabular-nums text-[13px]">{{ formatRupiah(b.mySpent) }}</span>
        </div>
      </div>
      <div v-if="!mySpending.length" class="text-center text-sm text-on-surface-variant py-2">Belum ada pengeluaran bulan ini.</div>
    </div>
  </div>
</template>
