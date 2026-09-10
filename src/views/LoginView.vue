<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Silakan masukkan email dan password terlebih dahulu.'
    return
  }
  loading.value = true
  errorMessage.value = ''
  
  setTimeout(() => {
    loading.value = false
    router.push('/')
  }, 800)
}
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-surface-container via-surface-bright to-surface-container-high p-4 relative overflow-hidden">
    <!-- Decorative background blobs -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full bg-surface-container-lowest/90 backdrop-blur-xl p-space-xl rounded-3xl shadow-[0_24px_48px_-8px_rgba(15,23,42,0.12)] border border-surface-container space-y-space-lg relative z-10">
      <!-- Logo & Header -->
      <div class="flex flex-col items-center text-center space-y-space-xs">
        <div class="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm mb-1">
          <span class="material-symbols-outlined text-[36px]">account_balance_wallet</span>
        </div>
        <h1 class="font-headline-lg text-[28px] text-on-surface font-bold tracking-tight">KeluargaTrack</h1>
        <p class="font-body-md text-on-surface-variant">Solusi Transparan Finansial Rumah Tangga Terpercaya</p>
      </div>

      <!-- Error alert -->
      <div v-if="errorMessage" class="bg-error-container text-on-error-container p-space-sm rounded-xl text-body-sm flex items-center gap-2">
        <span class="material-symbols-outlined text-[18px]">error</span>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-space-md">
        <div class="space-y-1">
          <label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Email Terdaftar</label>
          <div class="relative flex items-center">
            <span class="absolute left-4 material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
            <input 
              v-model="email" 
              type="email" 
              placeholder="nama@email.com" 
              class="w-full bg-surface-container-low text-on-surface pl-12 pr-4 py-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-body-md transition-all"
            >
          </div>
        </div>

        <div class="space-y-1">
          <label class="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Kata Sandi</label>
          <div class="relative flex items-center">
            <span class="absolute left-4 material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="w-full bg-surface-container-low text-on-surface pl-12 pr-4 py-3 rounded-xl border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary font-body-md transition-all"
            >
          </div>
        </div>

        <div class="flex items-center justify-between text-body-sm pt-1">
          <label class="flex items-center gap-2 cursor-pointer select-none">
            <input v-model="remember" type="checkbox" class="w-4 h-4 rounded text-primary focus:ring-primary accent-primary cursor-pointer">
            <span class="text-on-surface-variant">Ingat saya</span>
          </label>
          <a href="#" class="text-primary font-semibold hover:underline">Lupa sandi?</a>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary py-3.5 rounded-full font-label-lg transition-transform active:scale-95 shadow-md disabled:opacity-70 cursor-pointer"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-[20px]">refresh</span>
          <span v-else class="material-symbols-outlined text-[20px]">login</span>
          <span>{{ loading ? 'Masuk ke Dashboard...' : 'Masuk ke Household' }}</span>
        </button>
      </form>

      <!-- Footer Info -->
      <div class="pt-space-md border-t border-surface-container text-center text-body-sm text-on-surface-variant">
        <span>Belum punya akses? Minta Admin keluarga untuk</span>
        <router-link to="/hak-akses" class="text-primary font-semibold block mt-1 hover:underline">Buat Akun / Undang Anggota Baru</router-link>
      </div>
    </div>
  </div>
</template>
