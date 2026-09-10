<script setup lang="ts">
// Props could be added here later to make it dynamic
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-1 gap-space-md">
    <!-- Capacity Info & Soft Warning -->
    <div
      class="bg-surface-container-lowest rounded-DEFAULT p-space-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md relative overflow-hidden"
    >
      <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
      <div class="flex items-start gap-space-md min-w-0">
        <div
          class="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0"
        >
          <span class="material-symbols-outlined text-[20px]">group</span>
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="font-headline-sm text-[15px] font-semibold text-on-surface"
              >Kuota: 4/6 Terpakai</span
            >
            <span
              class="bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wide"
              >Gratis</span
            >
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant truncate">
            Sisa 2 kursi tersedia.
          </p>
        </div>
      </div>
      <a
        class="shrink-0 flex items-center text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold gap-0.5 self-end sm:self-auto"
        href="#"
      >
        <span>Kelola</span>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
      </a>
    </div>
  </div>
</template>
