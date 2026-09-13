<script setup lang="ts">
import { computed, ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';

const openTransactionModal = inject('openTransactionModal') as () => void;
const router = useRouter();
const authStore = useAuthStore();

const isProfileOpen = ref(false);
const isMobileNavOpen = ref(false);
const isDarkMode = ref(false);
const isLoggingOut = ref(false);
const logoutError = ref('');

const profileName = computed(() => authStore.currentMember?.name || authStore.user?.user_metadata?.name || authStore.user?.email?.split('@')[0] || 'Pengguna');
const profileEmail = computed(() => authStore.user?.email || 'Email belum tersedia');
const profileRole = computed(() => authStore.currentMember?.role === 'admin' ? 'Admin Household' : authStore.currentMember?.role === 'member' ? 'Member Household' : 'Memuat profil...');
const profileHousehold = computed(() => authStore.household?.name || 'Household belum tersedia');
const profileInitial = computed(() => profileName.value.trim().charAt(0).toUpperCase() || '?');
const profileRoleClass = computed(() => authStore.currentMember?.role === 'admin' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 'bg-secondary-fixed text-on-secondary-fixed-variant');
const isAdmin = computed(() => authStore.currentMember?.role === 'admin');
const catatLabel = computed(() => (isAdmin.value ? '+ Catat Transaksi' : '+ Catat Pengeluaran'));

const handleLogout = async () => {
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;
  logoutError.value = '';
  try {
    await authStore.logout();
    isProfileOpen.value = false;
    isMobileNavOpen.value = false;
    await router.replace('/login');
  } catch (error) {
    logoutError.value = error instanceof Error ? error.message : 'Gagal keluar dari akun.';
  } finally {
    isLoggingOut.value = false;
  }
};

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
  <header class="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
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

        <nav v-if="isAdmin" class="hidden lg:flex items-center gap-space-xs">
          <RouterLink to="/" active-class="bg-primary-container text-white font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Dashboard</RouterLink>
          <RouterLink to="/anggaran" active-class="bg-primary-container text-white font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Anggaran</RouterLink>
          <RouterLink to="/hak-akses" active-class="bg-primary-container text-white font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Anggota</RouterLink>
          <RouterLink to="/backup-restore" active-class="bg-primary-container text-white font-semibold" class="px-space-md py-space-xs rounded-full font-label-md whitespace-nowrap text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Backup</RouterLink>
        </nav>
      </div>

      <div class="flex items-center gap-space-xs md:gap-space-md">
        <button @click="openTransactionModal" class="flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md md:px-space-lg py-space-xs rounded-full font-label-lg whitespace-nowrap transition-transform active:scale-95 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
          <span class="hidden md:inline">{{ catatLabel }}</span>
          <span class="md:hidden">Catat</span>
        </button>

        <div class="relative">
          <div @click="isProfileOpen = !isProfileOpen" class="flex items-center gap-space-xs cursor-pointer p-1 rounded-full hover:bg-surface-container">
            <div class="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-semibold text-sm shadow-sm" :title="profileName">{{ profileInitial }}</div>
          </div>

          <div v-if="isProfileOpen" class="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container p-space-sm z-50">
            <div class="px-space-sm py-space-xs border-b border-surface-container mb-space-xs">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="font-label-lg text-on-surface truncate">{{ profileName }}</p>
                  <p class="font-body-sm text-on-surface-variant truncate">{{ profileEmail }}</p>
                </div>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap', profileRoleClass]">{{ profileRole }}</span>
              </div>
              <p class="font-body-sm text-on-surface-variant mt-2 truncate">
                <span class="material-symbols-outlined align-middle text-[15px] mr-1">family_restroom</span>{{ profileHousehold }}
              </p>
            </div>
            <button @click="toggleDarkMode" class="w-full flex items-center justify-between px-space-sm py-space-xs hover:bg-surface-container rounded-lg">
              <span class="font-label-md">Mode Gelap</span>
              <span class="material-symbols-outlined text-[18px]">{{ isDarkMode ? 'toggle_on' : 'toggle_off' }}</span>
            </button>
            <p v-if="logoutError" class="px-space-sm py-1 text-xs text-error">{{ logoutError }}</p>
            <button @click="handleLogout" :disabled="isLoggingOut" class="w-full flex items-center px-space-sm py-space-xs hover:bg-surface-container rounded-lg text-error disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="material-symbols-outlined text-[18px] mr-2" :class="isLoggingOut ? 'animate-spin' : ''">{{ isLoggingOut ? 'refresh' : 'logout' }}</span>
              <span class="font-label-md">{{ isLoggingOut ? 'Keluar...' : 'Logout' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isMobileNavOpen && isAdmin" class="lg:hidden bg-surface-container-lowest border-t border-surface-container p-space-md">
      <nav class="flex flex-col gap-space-xs">
        <RouterLink to="/" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Dashboard & Transaksi</RouterLink>
        <RouterLink to="/anggaran" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Anggaran & Hak Akses</RouterLink>
        <RouterLink to="/hak-akses" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Anggota Keluarga</RouterLink>
        <RouterLink to="/backup-restore" class="px-space-md py-space-sm rounded-lg hover:bg-surface-container">Backup & Restore</RouterLink>
      </nav>
    </div>
  </header>
</template>
