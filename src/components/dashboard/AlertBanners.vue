<script setup lang="ts">
// Props could be added here later to make it dynamic
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-space-md">
    <!-- Approval Warning for Pending Join -->
    <div class="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm flex items-center justify-between gap-space-md relative overflow-hidden">
      <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary"></div>
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shrink-0">
          <span class="material-symbols-outlined text-[20px]">person_add</span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-[15px] font-semibold text-on-surface">1 Permintaan Bergabung</span>
            <span class="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wide">Menunggu Admin</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">
            <span class="font-semibold text-on-surface">Doni Pratama</span> (doni@mail.com) ingin masuk ke grup keluarga.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-space-xs shrink-0">
        <button class="px-space-md py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm text-label-sm transition-colors">Tolak</button>
        <button class="px-space-md py-1 rounded-full bg-secondary text-on-secondary hover:opacity-90 font-label-sm text-label-sm shadow-sm transition-transform active:scale-95">Setujui</button>
      </div>
    </div>
    <!-- Capacity Info & Soft Warning -->
    <div class="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm flex items-center justify-between gap-space-md relative overflow-hidden">
      <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
      <div class="flex items-center gap-space-md min-w-0">
        <div class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <span class="material-symbols-outlined text-[20px]">group</span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="font-headline-sm text-[15px] font-semibold text-on-surface">Kuota Anggota: 4 dari 6 Terpakai</span>
            <span class="bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wide">Gratis Permanen</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">
            Sisa 2 kursi tersedia. Percobaan masuk otomatis dibatasi saat mencapai limit 6 akun.
          </p>
        </div>
      </div>
      <a class="shrink-0 flex items-center text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold gap-0.5" href="#">
        <span>Kelola</span>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
      </a>
    </div>
  </div>
</template>
