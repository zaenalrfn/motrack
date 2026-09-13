<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import {
  getRemovedMembers,
  restoreHouseholdMember,
  type ActiveMember,
} from '../../services/memberService'

const emit = defineEmits<{ (event: 'member-restored'): void }>()

const authStore = useAuthStore()
const members = ref<ActiveMember[]>([])
const loading = ref(false)
const errorMessage = ref('')
const restoringId = ref<string | null>(null)
const restoreError = ref('')

const isAdmin = computed(() => authStore.currentMember?.role === 'admin')

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p.charAt(0).toUpperCase()).join('') || '?'
}

const formatDate = (value?: string) => {
  if (!value) return 'Tanggal tidak tersedia'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak tersedia'
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

const loadRemoved = async () => {
  const householdId = authStore.household?.id
  if (!householdId) {
    members.value = []
    return
  }
  loading.value = true
  errorMessage.value = ''
  try {
    members.value = await getRemovedMembers(householdId)
  } catch (error) {
    members.value = []
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat anggota nonaktif.'
  } finally {
    loading.value = false
  }
}

const handleRestore = async (member: ActiveMember) => {
  if (!isAdmin.value || restoringId.value) return
  restoringId.value = member.id
  restoreError.value = ''
  try {
    await restoreHouseholdMember(member.id)
    await loadRemoved()
    emit('member-restored')
  } catch (error) {
    restoreError.value = error instanceof Error ? error.message : 'Gagal mengaktifkan kembali anggota.'
  } finally {
    restoringId.value = null
  }
}

const refresh = () => {
  void loadRemoved()
}

defineExpose({ refresh })

onMounted(loadRemoved)
watch(() => authStore.household?.id, loadRemoved)
</script>

<template>
  <div class="bg-surface-container-low rounded-lg p-space-xl shadow-sm space-y-space-md border border-surface-container-high">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
      <div class="flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-outline text-[22px]">history_toggle_off</span>
        <div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Anggota Nonaktif & Histori Tersimpan</h3>
          <p class="font-body-sm text-on-surface-variant">Integritas data terjaga. Riwayat transaksi akun nonaktif tetap aman dan dapat dipulihkan kapan saja.</p>
        </div>
      </div>
      <span class="px-space-sm py-1 rounded-full bg-surface-variant font-label-sm text-on-surface-variant">{{ members.length }} Akun Tersimpan</span>
    </div>

    <div v-if="loading" class="bg-surface-container-lowest rounded-DEFAULT p-space-lg text-center font-body-md text-on-surface-variant">Memuat anggota nonaktif...</div>
    <div v-else-if="errorMessage" class="bg-surface-container-lowest rounded-DEFAULT p-space-lg text-center font-body-md text-on-surface-variant">Belum ada anggota yang dinonaktifkan (histori tersimpan).</div>
    <div v-else-if="members.length === 0" class="bg-surface-container-lowest rounded-DEFAULT p-space-lg text-center font-body-md text-on-surface-variant">Belum ada anggota nonaktif. Anggota yang dihapus biasa akan tersimpan di sini beserta historinya.</div>

    <template v-else>
      <div v-if="restoreError" class="bg-error-container rounded-DEFAULT px-4 py-3 text-sm text-on-error-container">{{ restoreError }}</div>
      <div v-for="member in members" :key="member.id" class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div class="flex items-start md:items-center gap-space-md">
          <div class="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-title-md font-semibold flex-shrink-0">{{ initials(member.name) }}</div>
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-space-xs">
              <span class="font-title-md text-on-surface font-semibold line-through decoration-outline">{{ member.name }}</span>
              <span class="px-space-xs py-0.5 rounded-full bg-surface-variant font-label-sm text-on-surface-variant">Mantan Member</span>
              <span class="font-label-sm text-secondary font-semibold flex items-center gap-1 bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
                <span class="material-symbols-outlined text-[14px]">inventory_2</span> {{ member.transaction_count ?? 0 }} Transaksi Tersimpan Utuh
              </span>
            </div>
            <p class="font-body-sm text-on-surface-variant">Bergabung sejak <strong class="text-on-surface">{{ formatDate(member.created_at) }}</strong> • Status tersimpan aman</p>
            <p class="font-body-sm text-outline flex items-center gap-1 pt-1">
              <span class="material-symbols-outlined text-[15px]">info</span>
              Saat diaktifkan kembali, akun ini otomatis aktif dan seluruh {{ member.transaction_count ?? 0 }} riwayat transaksinya langsung tersambung utuh tanpa duplikasi.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-space-sm pl-16 md:pl-0 flex-shrink-0">
          <button
            v-if="isAdmin"
            @click="handleRestore(member)"
            :disabled="restoringId === member.id"
            class="flex items-center gap-space-xs px-space-lg py-space-xs rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md transition-all active:scale-95 shadow-sm disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-[18px]" :class="restoringId === member.id ? 'animate-spin' : ''">{{ restoringId === member.id ? 'refresh' : 'reply' }}</span>
            <span>{{ restoringId === member.id ? 'Mengaktifkan...' : 'Undang Kembali ke Household' }}</span>
          </button>
          <span v-else class="font-label-sm text-on-surface-variant/70 italic px-space-sm py-1 bg-surface-container rounded-full">Hanya admin yang dapat mengaktifkan kembali</span>
        </div>
      </div>
    </template>
  </div>
</template>
