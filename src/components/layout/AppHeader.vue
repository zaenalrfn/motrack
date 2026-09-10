<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';

const openTransactionModal = inject('openTransactionModal') as () => void;

const isProfileOpen = ref(false);
const isMobileNavOpen = ref(false);
const isDarkMode = ref(false);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }
});
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
    <div class="h-16 md:h-20 w-full px-4 md:px-margin-desktop flex items-center justify-between">
      <div class="flex items-center gap-space-md md:gap-space-xl">
        <button @click="isMobileNavOpen = !isMobileNavOpen" class="lg:hidden p-2 text-on-surface-variant">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="flex items-center gap-space-sm">
          <img alt="Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJIpO97ixd15RtUiY4RCU3rQW6BkqEqZuIxWQ6AGO2aPVOPwggWELgiT_tJtpPhCSwa1q8_LNb6R951wVq8xLOv82q6NZQKYO6KPReWfgI0RFTIwg689vwH9PdlNGUKRtm0nmI4EhC0BxmAgXVpWvGYa52LgQkVnntqumEglRiTpJpl9YXwrtHHMt1-itl2SBIgvd3Myrq3_XvJZ5y8pGq5VVGfBO5OEUmuSd6CIQ1nA7IvHFhBKgKDA">
          <div class="hidden sm:flex flex-col">
            <span class="font-headline-sm text-headline-sm text-primary leading-none">KeluargaTrack</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Money Tracker</span>
          </div>
        </div>

        <nav class="hidden lg:flex items-center gap-space-xs">
          <RouterLink to="/" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Dashboard</RouterLink>
          <RouterLink to="/anggaran" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Anggaran</RouterLink>
          <RouterLink to="/hak-akses" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Anggota</RouterLink>
          <RouterLink to="/backup-restore" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Backup</RouterLink>
        </nav>
      </div>

      <div class="flex items-center gap-space-xs md:gap-space-md">
        <button @click="openTransactionModal" class="flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md md:px-space-lg py-space-xs rounded-full font-label-lg whitespace-nowrap transition-transform active:scale-95 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
          <span class="hidden md:inline">+ Catat Transaksi</span>
          <span class="md:hidden">Catat</span>
        </button>
        
        <div class="relative">
          <div @click="isProfileOpen = !isProfileOpen" class="flex items-center gap-space-xs cursor-pointer p-1 rounded-full hover:bg-surface-container">
            <img alt="Profile" class="w-8 h-8 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4bhRnYrM8EG8HnBmxvIXBoSzFzJbEcveSzqUy5MdhLMrA-zbUaw1iaxMqOCSuXePpWirv5oNxntwqXm_CSFki69W89wA2rZV5QL1Cs0Z9Zy3QHXsdMLcp9UMKFj7IADd4GgFzKq1C9OvX2R6F5HNgxfPQSoFwq9KCzDb1c8NL4CoNb9_wauMuTq46wjruSmD4kS7ljmpLdkVmm_R2NjpBV-WlBeWSBLkRxmTpZ4ci51JiTEXYo8e0Cg">
          </div>

          <div v-if="isProfileOpen" class="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container p-space-sm z-50">
            <div class="px-space-sm py-space-xs border-b border-surface-container mb-space-xs">
              <p class="font-label-lg">Rina</p>
              <p class="font-body-sm text-on-surface-variant">Ibu Rumah Tangga</p>
            </div>
            <button @click="toggleDarkMode" class="w-full flex items-center justify-between px-space-sm py-space-xs hover:bg-surface-container rounded-lg">
              <span class="font-label-md">Mode Gelap</span>
              <span class="material-symbols-outlined text-[18px]">{{ isDarkMode ? 'toggle_on' : 'toggle_off' }}</span>
            </button>
            <RouterLink to="/login" class="w-full flex items-center px-space-sm py-space-xs hover:bg-surface-container rounded-lg text-error">
              <span class="material-symbols-outlined text-[18px] mr-2">logout</span>
              <span class="font-label-md">Logout</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isMobileNavOpen" class="lg:hidden bg-surface-container-lowest border-t border-surface-container p-space-md">
      <nav class="flex flex-col gap-space-xs">
        <RouterLink to="/" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Dashboard & Transaksi</RouterLink>
        <RouterLink to="/anggaran" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Anggaran & Hak Akses</RouterLink>
        <RouterLink to="/hak-akses" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Anggota Keluarga</RouterLink>
        <RouterLink to="/backup-restore" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Backup & Restore</RouterLink>
      </nav>
    </div>
  </header>
</template>
