<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { supabase } from '../services/supabaseClient'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const passwordVisible = ref(false)
const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) {
    errorMessage.value = 'Sesi magic link tidak ditemukan atau sudah kedaluwarsa. Silakan minta link baru kepada admin.'
    return
  }

  email.value = data.user.email ?? ''
  await authStore.fetchHouseholdAndMember()
})

const handleClaim = async () => {
  if (!email.value || !password.value || !passwordConfirmation.value) return
  if (password.value.length < 8) {
    errorMessage.value = 'Password minimal terdiri dari 8 karakter.'
    return
  }
  if (password.value !== passwordConfirmation.value) {
    errorMessage.value = 'Konfirmasi password tidak sama.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { error: updateError } = await supabase.auth.updateUser({ password: password.value })
    if (updateError) throw updateError

    await authStore.fetchHouseholdAndMember()
    if (authStore.currentMember?.status === 'pending') {
      const { error: memberError } = await supabase
        .from('members')
        .update({ status: 'active' })
        .eq('id', authStore.currentMember.id)
      if (memberError) throw memberError
      await authStore.fetchHouseholdAndMember()
    }

    await router.replace('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal mengaktifkan akun.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-fixed via-surface-bright to-secondary-fixed p-4 relative overflow-hidden">
    <div class="absolute top-10 right-10 opacity-10 pointer-events-none hidden sm:block">
      <span class="material-symbols-outlined text-[200px] text-primary">family_restroom</span>
    </div>
    <div class="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full bg-surface-container-lowest/95 backdrop-blur-xl p-space-xl rounded-3xl shadow-[0_24px_48px_-8px_rgba(15,23,42,0.16)] border border-surface-container space-y-space-md relative z-10">
      <div class="flex items-center gap-space-sm">
        <div class="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
          <span class="material-symbols-outlined text-[28px]">waving_hand</span>
        </div>
        <div class="text-left">
          <span class="font-label-sm text-secondary uppercase tracking-wider font-bold">Magic Link Aktif</span>
          <h1 class="font-headline-sm text-headline-sm font-bold text-on-surface">Selamat Datang, Keluarga!</h1>
        </div>
      </div>

      <p class="font-body-md text-on-surface-variant text-left">Akun Anda sudah disiapkan oleh admin. Buat password pribadi untuk menyelesaikan aktivasi akun.</p>
      <div v-if="errorMessage" class="bg-error-container text-on-error-container p-space-sm rounded-xl text-sm">{{ errorMessage }}</div>

      <div class="bg-surface-container-low p-space-md rounded-2xl space-y-space-sm border border-surface-container text-left">
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase font-bold block mb-1">Email Akun Anda</label>
          <input v-model="email" type="email" readonly class="w-full bg-surface-container-lowest text-on-surface px-3 py-2.5 rounded-xl border border-surface-container font-mono text-sm font-bold opacity-75">
        </div>
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase font-bold block mb-1">Password Baru</label>
          <div class="relative flex items-center">
            <input v-model="password" :type="passwordVisible ? 'text' : 'password'" autocomplete="new-password" placeholder="Minimal 8 karakter" class="w-full bg-surface-container-lowest text-on-surface pl-3 pr-10 py-2.5 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm">
            <button type="button" @click="passwordVisible = !passwordVisible" class="absolute right-3 text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[18px]">{{ passwordVisible ? 'visibility_off' : 'visibility' }}</span></button>
          </div>
        </div>
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase font-bold block mb-1">Konfirmasi Password</label>
          <input v-model="passwordConfirmation" type="password" autocomplete="new-password" placeholder="Ulangi password baru" class="w-full bg-surface-container-lowest text-on-surface px-3 py-2.5 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary text-sm">
        </div>
      </div>

      <button @click="handleClaim" :disabled="loading || !email || !password || !passwordConfirmation" class="w-full flex items-center justify-center gap-space-xs bg-secondary hover:bg-secondary/90 text-on-secondary py-3.5 rounded-full font-label-lg transition-all active:scale-95 shadow-md disabled:opacity-60">
        <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
        <span v-else class="material-symbols-outlined">verified_user</span>
        <span>{{ loading ? 'Mengaktifkan Akun...' : 'Aktifkan Akun & Masuk' }}</span>
      </button>

      <router-link to="/login" class="block text-center font-body-sm text-on-surface-variant hover:text-primary">Bukan Anda? <span class="font-semibold underline">Ke halaman login biasa</span></router-link>
    </div>
  </div>
</template>
