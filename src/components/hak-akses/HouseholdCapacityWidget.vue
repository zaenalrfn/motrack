<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AddMemberModal from './AddMemberModal.vue'
import { useAuthStore } from '../../stores/useAuthStore'
import { getActiveMembers, type ActiveMember } from '../../services/memberService'

const MAX_MEMBERS = 6
const authStore = useAuthStore()
const members = ref<ActiveMember[]>([])
const loading = ref(false)
const errorMessage = ref('')

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
const link = ref(`${baseUrl}/join/household`)
const copied = ref(false)

const colorClasses = [
  'bg-primary-fixed text-on-primary-fixed-variant',
  'bg-secondary-fixed text-on-secondary-fixed-variant',
  'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  'bg-surface-variant text-on-surface-variant',
]

const activeCount = computed(() => members.value.length)
const remainingSeats = computed(() => Math.max(MAX_MEMBERS - activeCount.value, 0))
const capacityPercent = computed(() => Math.min((activeCount.value / MAX_MEMBERS) * 100, 100))
const visibleMembers = computed(() => members.value.slice(0, 4))
const extraMembers = computed(() => Math.max(activeCount.value - visibleMembers.value.length, 0))
const activeMemberSummary = computed(() => {
  if (!activeCount.value) return 'Belum ada anggota aktif'
  const adminCount = members.value.filter((member) => member.role === 'admin').length
  const memberCount = activeCount.value - adminCount
  return `${adminCount} Admin & ${memberCount} Member`
})

const initials = (name: string) => name.trim().charAt(0).toUpperCase() || '?'
const colorClass = (index: number) => colorClasses[index % colorClasses.length]

const loadMembers = async () => {
  const householdId = authStore.household?.id
  if (!householdId) {
    members.value = []
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    members.value = await getActiveMembers(householdId)
  } catch (error) {
    members.value = []
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat kapasitas household.'
  } finally {
    loading.value = false
  }
}

const copyLink = async () => {
  await navigator.clipboard.writeText(link.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

const resetLink = () => {
  link.value = `${baseUrl}/join/household-${Math.random().toString(36).substring(2, 8)}`
}

defineExpose({ copyLink, resetLink, loadMembers })
onMounted(loadMembers)
watch(() => authStore.household?.id, loadMembers)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-6 gap-space-lg">
    <div class="lg:col-span-7 bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div class="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none"></div>
      <div class="space-y-space-md relative z-10">
        <div class="flex items-center justify-between gap-space-sm">
          <div class="flex items-center gap-space-xs">
            <span class="w-3 h-3 rounded-full" :class="remainingSeats === 0 ? 'bg-tertiary' : 'bg-secondary'"></span>
            <span class="font-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status Kapasitas Household</span>
          </div>
          <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-semibold"><span class="material-symbols-outlined text-[14px]">verified</span>Kuota Gratis Selamanya</span>
        </div>

        <div v-if="loading" class="text-on-surface-variant font-body-sm">Memuat kapasitas household...</div>
        <div v-else-if="errorMessage" class="rounded-xl bg-error-container text-on-error-container px-space-md py-space-sm font-body-sm">{{ errorMessage }}</div>
        <template v-else>
          <div class="flex flex-wrap items-baseline gap-space-xs">
            <span class="font-display-lg text-[48px] text-on-surface tracking-tight font-bold">{{ activeCount }}</span>
            <span class="font-title-md text-on-surface-variant font-normal">dari</span>
            <span class="font-display-lg text-[48px] text-primary tracking-tight font-bold">{{ MAX_MEMBERS }}</span>
            <span class="font-title-md text-on-surface font-medium">Anggota Terdaftar</span>
            <span class="ml-auto font-label-lg text-secondary font-semibold bg-secondary-fixed/60 px-space-sm py-1 rounded-full">{{ remainingSeats ? `Sisa ${remainingSeats} Kursi Tersedia` : 'Kapasitas Penuh' }}</span>
          </div>
          <div class="space-y-space-2xs">
            <div class="w-full bg-surface-container rounded-full h-3 flex overflow-hidden p-0.5"><div class="bg-secondary h-full rounded-full transition-all duration-500" :style="{ width: `${capacityPercent}%` }"></div></div>
            <div class="flex justify-between font-label-sm text-on-surface-variant"><span>Terisi: {{ activeCount }} Kursi ({{ activeMemberSummary }})</span><span>Batas Maks: {{ MAX_MEMBERS }} Anggota</span></div>
          </div>
        </template>
      </div>

      <div class="pt-space-lg flex items-center justify-between border-t border-surface-container-high/40 mt-space-md gap-space-md">
        <div class="flex items-center -space-x-2 min-w-0">
          <div v-for="(member, index) in visibleMembers" :key="member.id" :title="member.name" :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold ring-2 ring-surface-container-lowest', colorClass(index)]">{{ initials(member.name) }}</div>
          <div v-if="extraMembers" class="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-semibold border border-dashed border-outline/50">+{{ extraMembers }}</div>
          <div v-if="!members.length && !loading" class="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center font-semibold">—</div>
        </div>
        <AddMemberModal />
      </div>
    </div>
  </div>
</template>
