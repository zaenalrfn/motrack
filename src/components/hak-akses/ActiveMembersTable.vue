<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import {
  deleteHouseholdMember,
  getActiveMembers,
  invalidateActiveMembersCache,
  regenerateMemberMagicLink,
  type ActiveMember,
} from '../../services/memberService'

const emit = defineEmits<{
  (event: 'open-delete', member: ActiveMember): void
  (event: 'member-deleted'): void
}>()

const authStore = useAuthStore()
const members = ref<ActiveMember[]>([])
const loading = ref(false)
const errorMessage = ref('')
const linkLoading = ref(false)
const linkError = ref('')
const deleteError = ref('')
const deleteLoading = ref(false)
const deleteMode = ref<'soft' | 'permanent'>('soft')
const showDeleteModal = ref(false)
const deleteTarget = ref<ActiveMember | null>(null)
const magicLinkResult = ref<{ member: ActiveMember; magicLink: string } | null>(null)
const showMagicLinkModal = ref(false)
const copied = ref(false)

const colorClasses = [
  'bg-primary text-on-primary',
  'bg-secondary text-on-secondary',
  'bg-tertiary text-on-tertiary',
  'bg-surface-tint text-on-primary',
]

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Tanggal tidak tersedia'
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || '?'
const getColorClass = (index: number) => colorClasses[index % colorClasses.length]
const getRoleLabel = (role: ActiveMember['role']) => role === 'admin' ? 'Admin Household' : 'Member Biasa'
const isAdmin = (member: ActiveMember) => member.role === 'admin'
const canRegenerateMagicLink = (member: ActiveMember) => !isAdmin(member) && member.has_password !== true

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
    errorMessage.value = errorParts.length > 0 ? errorParts.join(' — ') : 'Gagal memuat daftar anggota aktif. Periksa konfigurasi Supabase.'
    console.error('Gagal memuat anggota aktif:', error)
  } finally {
    loading.value = false
  }
}

const openMagicLink = async (member: ActiveMember) => {
  if (!authStore.household?.id || linkLoading.value) return
  linkLoading.value = true
  linkError.value = ''
  copied.value = false
  try {
    const result = await regenerateMemberMagicLink({ householdId: authStore.household.id, memberId: member.id })
    magicLinkResult.value = { member: { ...member, email: result.member.email }, magicLink: result.magicLink }
    showMagicLinkModal.value = true
  } catch (error) {
    linkError.value = error instanceof Error ? error.message : 'Gagal membuat ulang magic link.'
  } finally {
    linkLoading.value = false
  }
}

const closeMagicLink = () => {
  if (linkLoading.value) return
  showMagicLinkModal.value = false
  linkError.value = ''
}

const copyMagicLink = async () => {
  if (!magicLinkResult.value) return
  await navigator.clipboard.writeText(magicLinkResult.value.magicLink)
  copied.value = true
}

const openDeleteModal = (member: ActiveMember) => {
  deleteTarget.value = member
  deleteMode.value = 'soft'
  deleteError.value = ''
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteTarget.value = null
  deleteError.value = ''
}

const confirmDelete = async () => {
  if (!deleteTarget.value) return
  deleteLoading.value = true
  deleteError.value = ''
  try {
    await deleteHouseholdMember(deleteTarget.value.id, deleteMode.value)
    invalidateActiveMembersCache(authStore.household?.id)
    showDeleteModal.value = false
    deleteTarget.value = null
    deleteError.value = ''
    await loadMembers()
    emit('member-deleted')
  } catch (error) {
    deleteError.value = error instanceof Error ? error.message : 'Gagal menghapus anggota.'
  } finally {
    deleteLoading.value = false
  }
}

const handleSoftDelete = (member: ActiveMember) => openDeleteModal(member)

const refresh = () => {
  void loadMembers()
}

defineExpose({ refresh })

onMounted(loadMembers)
watch(() => authStore.household?.id, loadMembers)
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm space-y-space-lg">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
      <div class="space-y-space-2xs">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Daftar Anggota Aktif Household</h2>
        <p class="font-body-sm text-on-surface-variant">Seluruh anggota memiliki hak pencatatan transaksi sesuai izin kategori keluarga.</p>
      </div>
      <span class="px-space-md py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm font-semibold">{{ members.length }} Anggota Aktif</span>
    </div>

    <div v-if="loading" class="rounded-lg bg-surface-container-low p-space-lg text-center font-body-md text-on-surface-variant">Memuat daftar anggota aktif...</div>
    <div v-else-if="errorMessage" class="rounded-lg bg-error-container p-space-lg text-on-error-container font-body-md">Gagal memuat daftar anggota: {{ errorMessage }}</div>
    <div v-else-if="members.length === 0" class="rounded-lg bg-surface-container-low p-space-lg text-center font-body-md text-on-surface-variant">Belum ada anggota aktif pada household ini.</div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-surface-container-low text-on-surface-variant font-label-md uppercase tracking-wider">
            <th class="py-space-sm px-space-md rounded-l-DEFAULT">Nama & Kontak</th>
            <th class="py-space-sm px-space-md">Peran (Role)</th>
            <th class="py-space-sm px-space-md">Status Akun</th>
            <th class="py-space-sm px-space-md">Bergabung Sejak</th>
            <th class="py-space-sm px-space-md text-right rounded-r-DEFAULT">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container-high/40 font-body-md">
          <tr v-for="member in formattedMembers" :key="member.id" class="hover:bg-surface-container-low/40 transition-colors">
            <td class="py-space-md px-space-md">
              <div class="flex items-center gap-space-sm">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-headline-sm font-semibold', member.colorClass]">{{ member.initial }}</div>
                <div>
                  <div class="flex items-center gap-space-xs">
                    <span class="font-title-md text-on-surface font-semibold">{{ member.name }}</span>
                    <span :class="['font-label-sm px-space-2xs rounded', isAdmin(member) ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container text-on-surface-variant']">{{ isAdmin(member) ? 'Admin' : 'Member' }}</span>
                  </div>
                  <span class="font-body-sm text-on-surface-variant">{{ member.email ?? 'Email tidak tersedia' }}</span>
                </div>
              </div>
            </td>
            <td class="py-space-md px-space-md">
              <span :class="['inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full font-label-md font-semibold', isAdmin(member) ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-surface-container text-on-surface']">
                <span class="material-symbols-outlined text-[16px]">{{ isAdmin(member) ? 'shield_person' : 'person' }}</span>{{ member.roleLabel }}
              </span>
            </td>
            <td class="py-space-md px-space-md">
              <span v-if="isAdmin(member)" class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm font-semibold bg-secondary-fixed text-on-secondary-fixed-variant"><span class="material-symbols-outlined text-[14px]">verified_user</span>Akun siap</span>
              <span v-else-if="!member.has_password" class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm font-semibold bg-tertiary-fixed text-on-tertiary-fixed-variant"><span class="material-symbols-outlined text-[14px]">pending</span>Belum aktivasi password</span>
              <span v-else class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm font-semibold bg-secondary-fixed text-on-secondary-fixed-variant"><span class="material-symbols-outlined text-[14px]">verified_user</span>Siap digunakan</span>
            </td>
            <td class="py-space-md px-space-md font-body-sm text-on-surface-variant">{{ member.joinedAt }}</td>
            <td class="py-space-md px-space-md text-right">
              <span v-if="isAdmin(member)" class="font-label-sm text-on-surface-variant/70 italic px-space-sm py-1 bg-surface-container rounded-full">Akses Utama Terkunci</span>
              <div v-else class="flex items-center justify-end gap-space-xs">
                <button v-if="canRegenerateMagicLink(member)" @click="openMagicLink(member)" :disabled="linkLoading" class="p-2 rounded-full hover:bg-secondary-container text-secondary transition-colors disabled:opacity-50" title="Buka kembali magic link aktivasi"><span class="material-symbols-outlined text-[18px]" :class="linkLoading ? 'animate-spin' : ''">{{ linkLoading ? 'refresh' : 'link' }}</span></button>
                <button class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" title="Ubah Hak Akses"><span class="material-symbols-outlined text-[18px]">tune</span></button>
                <button @click="handleSoftDelete(member)" class="p-2 rounded-full hover:bg-error-container text-outline hover:text-error transition-colors" title="Kelola penghapusan anggota"><span class="material-symbols-outlined text-[18px]">person_remove</span></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="linkError" class="rounded-xl bg-error-container text-on-error-container px-4 py-3 text-sm">{{ linkError }}</div>

    <div v-if="showDeleteModal && deleteTarget" class="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-on-surface/50 backdrop-blur-sm p-0 sm:p-4" @click.self="closeDeleteModal">
      <div class="bg-surface-container-lowest w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl border border-surface-container">
        <div class="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-surface-container">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-11 h-11 shrink-0 rounded-2xl bg-error-container text-on-error-container flex items-center justify-center"><span class="material-symbols-outlined">person_remove</span></div>
            <div class="min-w-0"><h3 class="font-headline-sm font-bold text-on-surface">Hapus Anggota</h3><p class="font-body-sm text-on-surface-variant truncate">{{ deleteTarget.name }} · {{ deleteTarget.email }}</p></div>
          </div>
          <button type="button" @click="closeDeleteModal" :disabled="deleteLoading" class="w-9 h-9 shrink-0 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant disabled:opacity-50"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div class="p-5 sm:p-6 space-y-5">
          <div><p class="font-label-md text-on-surface font-semibold mb-2">Pilih jenis penghapusan</p><div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" @click="deleteMode = 'soft'" :class="deleteMode === 'soft' ? 'ring-2 ring-primary bg-primary-fixed' : 'bg-surface-container-low hover:bg-surface-container'" class="text-left p-4 rounded-2xl border border-surface-container transition-colors"><span class="flex items-center gap-2 font-semibold text-on-surface"><span class="material-symbols-outlined text-[20px]">archive</span>Hapus biasa</span><span class="block text-xs leading-relaxed text-on-surface-variant mt-2">Akses dicabut, tetapi semua histori transaksi tetap tersimpan.</span></button>
            <button type="button" @click="deleteMode = 'permanent'" :class="deleteMode === 'permanent' ? 'ring-2 ring-error bg-error-container' : 'bg-surface-container-low hover:bg-surface-container'" class="text-left p-4 rounded-2xl border border-surface-container transition-colors"><span class="flex items-center gap-2 font-semibold text-error"><span class="material-symbols-outlined text-[20px]">delete_forever</span>Hapus permanen</span><span class="block text-xs leading-relaxed text-on-surface-variant mt-2">Akun, member, dan seluruh histori transaksi akan dihapus.</span></button>
          </div></div>
          <div :class="deleteMode === 'permanent' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'" class="flex items-start gap-3 rounded-2xl px-4 py-3 text-sm leading-relaxed"><span class="material-symbols-outlined text-[20px] shrink-0">{{ deleteMode === 'permanent' ? 'warning' : 'info' }}</span><p><strong>{{ deleteMode === 'permanent' ? 'Peringatan permanen.' : 'Histori tetap aman.' }}</strong> {{ deleteMode === 'permanent' ? 'Tindakan ini tidak dapat dibatalkan.' : 'Jumlah anggota aktif akan langsung berkurang.' }}</p></div>
          <div v-if="deleteError" class="rounded-xl bg-error-container text-on-error-container px-4 py-3 text-sm">{{ deleteError }}</div>
        </div>
        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-5 sm:p-6 pt-0"><button type="button" @click="closeDeleteModal" :disabled="deleteLoading" class="w-full sm:w-auto px-5 py-3 rounded-full hover:bg-surface-container text-on-surface font-semibold disabled:opacity-50">Batal</button><button type="button" @click="confirmDelete" :disabled="deleteLoading" :class="deleteMode === 'permanent' ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary-container'" class="w-full sm:w-auto px-5 py-3 rounded-full text-on-primary font-semibold disabled:opacity-50"><span v-if="deleteLoading" class="material-symbols-outlined text-[18px] align-middle animate-spin mr-1">refresh</span>{{ deleteLoading ? 'Memproses...' : deleteMode === 'permanent' ? 'Hapus Permanen' : 'Hapus & Simpan Histori' }}</button></div>
      </div>
    </div>

    <div v-if="showMagicLinkModal && magicLinkResult" class="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-surface/40 backdrop-blur-md">
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-xl shadow-2xl space-y-space-md border border-surface-container">
        <div class="flex items-center gap-space-xs text-secondary"><span class="material-symbols-outlined text-[24px]">link</span><h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Magic Link Aktivasi</h3></div>
        <p class="font-body-sm text-on-surface-variant">Bagikan link ini kepada {{ magicLinkResult.member.name }}. Link akan membuka halaman welcome untuk membuat password.</p>
        <div class="bg-surface-container-low p-space-md rounded-xl space-y-2 border border-surface-container">
          <div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Email</span><strong class="text-on-surface font-mono">{{ magicLinkResult.member.email }}</strong></div>
          <input readonly :value="magicLinkResult.magicLink" class="w-full bg-surface-container-lowest text-xs p-2 rounded border border-surface-container font-mono text-on-surface select-all">
        </div>
        <div class="flex items-center justify-end gap-space-sm pt-space-md border-t border-surface-container">
          <button type="button" @click="copyMagicLink" class="flex items-center gap-1 px-space-lg py-space-xs rounded-full bg-secondary text-on-secondary font-label-md shadow-sm"><span class="material-symbols-outlined text-[16px]">content_copy</span>{{ copied ? 'Tersalin' : 'Salin Magic Link' }}</button>
          <button type="button" @click="closeMagicLink" class="px-space-md py-space-xs rounded-full font-label-md bg-surface-container hover:bg-surface-container-high text-on-surface">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>
