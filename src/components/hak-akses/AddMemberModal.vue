<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/useAuthStore'
import { createMemberAccount, type CreatedMember, type MemberRole } from '../../services/memberService'

const emit = defineEmits<{
  (event: 'member-added', result: { member: CreatedMember; magicLink: string }): void
}>()

const authStore = useAuthStore()
const showModal = ref(false)
const showResultModal = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const result = ref<{ member: CreatedMember; magicLink: string } | null>(null)

const form = ref<{ name: string; email: string; role: MemberRole }>({
  name: '',
  email: '',
  role: 'member',
})

const householdReady = computed(() => Boolean(authStore.household?.id))
const formValid = computed(() => Boolean(form.value.name.trim() && form.value.email.trim()))
const canSubmit = computed(() => householdReady.value && formValid.value && !authStore.loading)

const reset = () => {
  form.value = { name: '', email: '', role: 'member' }
  errorMessage.value = ''
}

const closeForm = () => {
  if (!loading.value) {
    showModal.value = false
    reset()
  }
}

const handleCreate = async () => {
  if (!authStore.household?.id) {
    errorMessage.value = 'Data household belum siap. Tutup modal, tunggu sebentar, lalu coba lagi.'
    return
  }
  if (!formValid.value || authStore.loading) return

  loading.value = true
  errorMessage.value = ''

  try {
    const created = await createMemberAccount({
      householdId: authStore.household.id,
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
    })
    result.value = created
    showModal.value = false
    showResultModal.value = true
    emit('member-added', created)
    reset()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal membuat akun anggota.'
  } finally {
    loading.value = false
  }
}

const copyLink = async () => {
  if (!result.value) return
  await navigator.clipboard.writeText(result.value.magicLink)
}
</script>

<template>
  <div>
    <button
      type="button"
      @click="showModal = true"
      class="flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-lg py-space-sm rounded-full font-label-lg transition-transform active:scale-95 shadow-sm"
    >
      <span class="material-symbols-outlined text-[20px]">person_add</span>
      <span>Buat Akun Anggota Baru</span>
    </button>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-surface/40 backdrop-blur-md"
    >
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-xl shadow-2xl space-y-space-md border border-surface-container">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs text-primary">
            <span class="material-symbols-outlined text-[24px]">person_add</span>
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Buat Akun Anggota Baru</h3>
          </div>
          <button type="button" @click="closeForm" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <p class="font-body-sm text-on-surface-variant">
          Akun dibuat aktif oleh admin. Sistem menghasilkan magic link sekali pakai untuk dibagikan secara manual.
        </p>

        <div v-if="authStore.loading" class="bg-secondary-container text-on-secondary-container p-space-sm rounded-lg font-body-sm">
          Menyiapkan data household...
        </div>
        <div v-else-if="!householdReady" class="bg-error-container text-on-error-container p-space-sm rounded-lg font-body-sm">
          Data household belum tersedia. Pastikan sesi admin sudah termuat sebelum membuat anggota.
        </div>
        <div v-if="errorMessage" class="bg-error-container text-on-error-container p-space-sm rounded-lg font-body-sm">
          {{ errorMessage }}
        </div>

        <div class="space-y-space-sm">
          <div>
            <label class="font-label-sm text-on-surface-variant font-medium">Nama Lengkap</label>
            <input v-model="form.name" type="text" autocomplete="name" class="w-full bg-surface-container-low px-space-md py-space-xs rounded-lg mt-1 border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant font-medium">Email Anggota</label>
            <input v-model="form.email" type="email" autocomplete="email" class="w-full bg-surface-container-low px-space-md py-space-xs rounded-lg mt-1 border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant font-medium">Peran / Role</label>
            <select v-model="form.role" class="w-full bg-surface-container-low px-space-md py-space-xs rounded-lg mt-1 border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="member">Member Biasa</option>
              <option value="admin">Admin Tambahan</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-sm pt-space-md border-t border-surface-container">
          <button type="button" @click="closeForm" class="px-space-md py-space-xs rounded-full font-label-md text-on-surface-variant hover:bg-surface-container">Batal</button>
          <button
            type="button"
            :disabled="loading || !canSubmit"
            @click="handleCreate"
            class="bg-primary text-on-primary px-space-lg py-space-xs rounded-full font-label-md hover:bg-primary-container shadow-sm disabled:opacity-50"
          >
            {{ loading ? 'Membuat akun...' : authStore.loading ? 'Menunggu household...' : 'Buat Akun & Generate Link' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showResultModal && result"
      class="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-surface/40 backdrop-blur-md"
    >
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-xl shadow-2xl space-y-space-md border border-surface-container">
        <div class="flex items-center gap-space-xs text-secondary">
          <span class="material-symbols-outlined text-[24px]">check_circle</span>
          <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Akun Berhasil Dibuat</h3>
        </div>
        <p class="font-body-sm text-on-surface-variant">
          Bagikan link ini kepada {{ result.member.name }}. Link hanya dapat digunakan sekali dan akan kedaluwarsa sesuai kebijakan Supabase Auth.
        </p>
        <div class="bg-surface-container-low p-space-md rounded-xl space-y-2 border border-surface-container">
          <div class="flex justify-between text-body-sm">
            <span class="text-on-surface-variant">Email</span>
            <strong class="text-on-surface font-mono">{{ result.member.email }}</strong>
          </div>
          <div class="flex justify-between text-body-sm">
            <span class="text-on-surface-variant">Role</span>
            <strong class="text-on-surface">{{ result.member.role === 'admin' ? 'Admin' : 'Member' }}</strong>
          </div>
          <input
            readonly
            :value="result.magicLink"
            class="w-full bg-surface-container-lowest text-xs p-2 rounded border border-surface-container font-mono text-on-surface select-all"
          >
        </div>
        <div class="flex items-center justify-end gap-space-sm pt-space-md border-t border-surface-container">
          <button type="button" @click="copyLink" class="flex items-center gap-1 px-space-lg py-space-xs rounded-full bg-secondary text-on-secondary font-label-md shadow-sm">
            <span class="material-symbols-outlined text-[16px]">content_copy</span>
            Salin Magic Link
          </button>
          <button type="button" @click="showResultModal = false; result = null" class="px-space-md py-space-xs rounded-full font-label-md bg-surface-container hover:bg-surface-container-high text-on-surface">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>
