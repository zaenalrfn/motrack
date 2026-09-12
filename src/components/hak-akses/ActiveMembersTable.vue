<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import { getActiveMembers, type ActiveMember } from '../../services/memberService'

const emit = defineEmits<{
  (event: 'open-delete', member: ActiveMember): void
}>()

const authStore = useAuthStore()
const members = ref<ActiveMember[]>([])
const loading = ref(false)
const errorMessage = ref('')

const colorClasses = [
  'bg-primary text-on-primary',
  'bg-secondary text-on-secondary',
  'bg-tertiary text-on-tertiary',
  'bg-surface-tint text-on-primary',
]

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak tersedia'

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || '?'
const getColorClass = (index: number) => colorClasses[index % colorClasses.length]
const getRoleLabel = (role: ActiveMember['role']) => role === 'admin' ? 'Admin Household' : 'Member Biasa'
const isAdmin = (member: ActiveMember) => member.role === 'admin'

const formattedMembers = computed(() => members.value.map((member, index) => ({
  ...member,
  initial: getInitial(member.name),
  colorClass: getColorClass(index),
  roleLabel: getRoleLabel(member.role),
  joinedAt: formatDate(member.created_at),
})))

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
    const details = error as { message?: string; code?: string; hint?: string }
    const errorParts = [details.code, details.message, details.hint].filter(Boolean)
    errorMessage.value = errorParts.length > 0
      ? errorParts.join(' — ')
      : 'Gagal memuat daftar anggota aktif. Periksa konfigurasi Supabase.'
    console.error('Gagal memuat anggota aktif:', error)
  } finally {
    loading.value = false
  }
}

const handleSoftDelete = (member: ActiveMember) => {
  emit('open-delete', member)
}

onMounted(loadMembers)
watch(() => authStore.household?.id, loadMembers)
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm space-y-space-lg">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
      <div class="space-y-space-2xs">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Daftar Anggota Aktif Household</h2>
        <p class="font-body-sm text-on-surface-variant">Seluruh anggota memiliki hak pencatatan transaksi sesuai izin envelope anggaran keluarga.</p>
      </div>
      <span class="px-space-md py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm font-semibold">
        {{ members.length }} Anggota Aktif
      </span>
    </div>

    <div v-if="loading" class="rounded-lg bg-surface-container-low p-space-lg text-center font-body-md text-on-surface-variant">
      Memuat daftar anggota aktif...
    </div>

    <div v-else-if="errorMessage" class="rounded-lg bg-error-container p-space-lg text-on-error-container font-body-md">
      Gagal memuat daftar anggota: {{ errorMessage }}
    </div>

    <div v-else-if="members.length === 0" class="rounded-lg bg-surface-container-low p-space-lg text-center font-body-md text-on-surface-variant">
      Belum ada anggota aktif pada household ini.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-surface-container-low text-on-surface-variant font-label-md uppercase tracking-wider">
            <th class="py-space-sm px-space-md rounded-l-DEFAULT">Nama & Kontak</th>
            <th class="py-space-sm px-space-md">Peran (Role)</th>
            <th class="py-space-sm px-space-md">Izin Anggaran (FR-02)</th>
            <th class="py-space-sm px-space-md">Bergabung Sejak</th>
            <th class="py-space-sm px-space-md text-right rounded-r-DEFAULT">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container-high/40 font-body-md">
          <tr
            v-for="member in formattedMembers"
            :key="member.id"
            class="hover:bg-surface-container-low/40 transition-colors"
          >
            <td class="py-space-md px-space-md">
              <div class="flex items-center gap-space-sm">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-headline-sm font-semibold', member.colorClass]">
                  {{ member.initial }}
                </div>
                <div>
                  <div class="flex items-center gap-space-xs">
                    <span class="font-title-md text-on-surface font-semibold">{{ member.name }}</span>
                    <span :class="[
                      'font-label-sm px-space-2xs rounded',
                      isAdmin(member) ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container text-on-surface-variant',
                    ]">
                      {{ isAdmin(member) ? 'Admin' : 'Member' }}
                    </span>
                  </div>
                  <span class="font-body-sm text-on-surface-variant">{{ member.email ?? 'Email tidak tersedia' }}</span>
                </div>
              </div>
            </td>
            <td class="py-space-md px-space-md">
              <span :class="[
                'inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full font-label-md font-semibold',
                isAdmin(member) ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container text-on-surface',
              ]">
                <span class="material-symbols-outlined text-[16px]">{{ isAdmin(member) ? 'shield_person' : 'person' }}</span>
                <span>{{ member.roleLabel }}</span>
              </span>
            </td>
            <td class="py-space-md px-space-md">
              <span :class="[
                'inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm font-semibold',
                isAdmin(member) ? 'bg-secondary-fixed text-on-secondary-fixed-variant' : 'bg-surface-container text-on-surface',
              ]">
                <span class="material-symbols-outlined text-[14px]">{{ isAdmin(member) ? 'all_inclusive' : 'check' }}</span>
                {{ isAdmin(member) ? 'Akses Penuh Semua Pos' : 'Akses sesuai izin' }}
              </span>
            </td>
            <td class="py-space-md px-space-md font-body-sm text-on-surface-variant">
              {{ member.joinedAt }}
            </td>
            <td class="py-space-md px-space-md text-right">
              <span v-if="isAdmin(member)" class="font-label-sm text-on-surface-variant/70 italic px-space-sm py-1 bg-surface-container rounded-full">
                Akses Utama Terkunci
              </span>
              <div v-else class="flex items-center justify-end gap-space-xs">
                <button class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" title="Ubah Hak Akses">
                  <span class="material-symbols-outlined text-[18px]">tune</span>
                </button>
                <button
                  @click="handleSoftDelete(member)"
                  class="p-2 rounded-full hover:bg-error-container text-outline hover:text-error transition-colors"
                  title="Keluarkan / Soft Delete Anggota"
                >
                  <span class="material-symbols-outlined text-[18px]">person_remove</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
