<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../services/supabaseClient'
import { useAuthStore } from '../stores/useAuthStore'

const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      errorMessage.value = exchangeError.message
      return
    }
  }

  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    errorMessage.value = error?.message ?? 'Magic link tidak valid atau sudah kedaluwarsa.'
    return
  }

  await authStore.fetchHouseholdAndMember()
  await router.replace('/auth/welcome')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-surface-container p-4">
    <div class="max-w-md w-full bg-surface-container-lowest rounded-2xl p-space-xl text-center shadow-lg">
      <span v-if="!errorMessage" class="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
      <span v-else class="material-symbols-outlined text-error text-4xl">error</span>
      <h1 class="font-headline-sm text-on-surface mt-3">
        {{ errorMessage ? 'Magic Link Tidak Dapat Digunakan' : 'Memverifikasi Magic Link...' }}
      </h1>
      <p v-if="errorMessage" class="font-body-md text-on-surface-variant mt-2">{{ errorMessage }}</p>
      <router-link v-if="errorMessage" to="/login" class="inline-block mt-5 text-primary font-semibold hover:underline">
        Kembali ke login
      </router-link>
    </div>
  </div>
</template>
