<script setup lang="ts">
const emit = defineEmits(['add-transaction']);
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
    <div class="h-20 w-full px-margin-desktop flex items-center justify-between gap-space-lg">
      <div class="flex items-center gap-space-xl">
        <div class="flex items-center gap-space-sm">
          <img alt="Money Tracker Keluarga Logo" class="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJIpO97ixd15RtUiY4RCU3rQW6BkqEqZuIxWQ6AGO2aPVOPwggWELgiT_tJtpPhCSwa1q8_LNb6R951wVq8xLOv82q6NZQKYO6KPReWfgI0RFTIwg689vwH9PdlNGUKRtm0nmI4EhC0BxmAgXVpWvGYa52LgQkVnntqumEglRiTpJpl9YXwrtHHMt1-itl2SBIgvd3Myrq3_XvJZ5y8pGq5VVGfBO5OEUmuSd6CIQ1nA7IvHFhBKgKDA">
          <div class="flex flex-col">
            <span class="font-headline-sm text-headline-sm text-primary leading-none">KeluargaTrack</span>
            <span class="font-label-sm text-label-sm text-on-surface-variant">Money Tracker Keluarga</span>
          </div>
        </div>
        <div class="hidden xl:flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full cursor-pointer hover:bg-surface-container transition-colors">
          <span class="material-symbols-outlined text-primary text-[18px]">home_app_logo</span>
          <span class="font-label-md text-label-md text-on-surface font-semibold">Keluarga Rina (4/6 Anggota)</span>
          <span class="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
        </div>
        <nav class="hidden lg:flex items-center gap-space-xs">
          <RouterLink to="/" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs transition-all rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Dashboard &amp; Transaksi</RouterLink>
          <RouterLink to="/anggaran" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs transition-all rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Anggaran &amp; Hak Akses</RouterLink>
          <RouterLink to="/hak-akses" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs transition-all rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Anggota Keluarga</RouterLink>
          <RouterLink to="/backup-restore" active-class="bg-primary-container text-on-primary-container font-semibold" class="px-space-md py-space-xs transition-all rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container">Backup &amp; Restore</RouterLink>
        </nav>
      </div>
      <div class="flex items-center gap-space-md">
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors cursor-pointer text-on-surface-variant">
          <span class="material-symbols-outlined">notifications</span>
          <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-tertiary rounded-full ring-2 ring-surface"></span>
        </div>
        <button @click="emit('add-transaction')" class="flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-lg py-space-xs rounded-full font-label-lg text-label-lg transition-transform active:scale-95 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Catat Transaksi</span>
        </button>
        <div class="flex items-center gap-space-sm pl-space-xs">
          <div class="hidden sm:flex flex-col items-end">
            <span class="inline-block px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold tracking-wider uppercase">Admin: Rina</span>
            <span class="font-label-md text-label-md text-on-surface-variant">Ibu Rumah Tangga</span>
          </div>
          <div class="relative flex items-center gap-space-2xs cursor-pointer group">
            <img alt="Profile" class="w-8 h-8 rounded-full object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4bhRnYrM8EG8HnBmxvIXBoSzFzJbEcveSzqUy5MdhLMrA-zbUaw1iaxMqOCSuXePpWirv5oNxntwqXm_CSFki69W89wA2rZV5QL1Cs0Z9Zy3QHXsdMLcp9UMKFj7IADd4GgFzKq1C9OvX2R6F5HNgxfPQSoFwq9KCzDb1c8NL4CoNb9_wauMuTq46wjruSmD4kS7ljmpLdkVmm_R2NjpBV-WlBeWSBLkRxmTpZ4ci51JiTEXYo8e0Cg">
            <span class="material-symbols-outlined text-on-surface-variant group-hover:text-on-surface text-[18px]">arrow_drop_down</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
