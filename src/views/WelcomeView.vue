<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore'
import { supabase } from '../services/supabaseClient'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const email = ref(route.query.email ? decodeURIComponent(String(route.query.email)) : '')
const password = ref(route.query.pwd ? decodeURIComponent(String(route.query.pwd)) : '')
const passwordVisible = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleClaim = async () => {
  if (!email.value || !password.value) return
  loading.value = true
  errorMessage.value = ''
  
  try {
    await authStore.login(email.value, password.value)
    
    // Update member status to active if pending
    if (authStore.currentMember && authStore.currentMember.status === 'pending') {
      await supabase
        .from('members')
        .update({ status: 'active' })
        .eq('id', authStore.currentMember.id)
      
      await authStore.fetchHouseholdAndMember()
    }

    router.push('/')
  } catch (err: any) {
    errorMessage.value = err.message || 'Gagal mengklaim akun. Periksa kembali kredensial Anda.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-fixed via-surface-bright to-secondary-fixed p-4 relative overflow-hidden">
    <!-- Decorative background -->
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

      <p class="font-body-md text-on-surface-variant text-left">Akun Anda telah disiapkan oleh Admin Household. Periksa atau lengkapi kredensial Anda untuk login pertama kali.</p>
      
      <div class="bg-surface-container-low p-space-md rounded-2xl space-y-space-sm border border-surface-container text-left">
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase font-bold block mb-1">Email Akun Anda</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
            <input 
              v-model="email" 
              type="email" 
              class="w-full bg-surface-container-lowest text-on-surface pl-10 pr-3 py-2.5 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm font-bold"
            >
          </div>
        </div>
        <div>
          <label class="font-label-sm text-on-surface-variant uppercase font-bold block mb-1">Password Sementara</label>
          <div class="relative flex items-center">
            <span class="absolute left-3 material-symbols-outlined text-on-surface-variant text-[18px]">key</span>
            <input 
              v-model="password" 
              :type="passwordVisible ? 'text' : 'password'" 
              placeholder="Salin dari Admin / Cek Chat"
              class="w-full bg-surface-container-lowest text-on-surface pl-10 pr-10 py-2.5 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm font-bold text-primary"
            >
            <button type="button" @click="passwordVisible = !passwordVisible" class="absolute right-3 text-on-surface-variant hover:text-on-surface">
              <span class="material-symbols-outlined text-[18px]">{{ passwordVisible ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>
      </div>

      <button 
        @click="handleClaim" 
        :disabled="loading || !email || !password"
        class="w-full flex items-center justify-center gap-space-xs bg-secondary hover:bg-secondary/90 text-on-secondary py-3.5 rounded-full font-label-lg transition-all active:scale-95 shadow-md disabled:opacity-60"
      >
        <span v-if="loading" class="material-symbols-outlined animate-spin">refresh</span>
        <span v-else class="material-symbols-outlined">verified_user</span>
        <span>{{ loading ? 'Memverifikasi Token...' : 'Klaim Akun & Masuk Dashboard' }}</span>
      </button>

      <router-link to="/login" class="block text-center font-body-sm text-on-surface-variant hover:text-primary">
        Bukan Anda? <span class="font-semibold underline">Ke halaman login biasa</span>
      </router-link>
    </div>
  </div>
</template>
