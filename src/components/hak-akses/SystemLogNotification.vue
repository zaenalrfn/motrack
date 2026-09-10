<script setup lang="ts">
import { ref } from 'vue'
const visible = ref(true)
</script>

<template>
  <div v-if="visible" class="w-full bg-error-container/40 rounded-lg p-space-md flex items-start gap-space-md shadow-sm border border-error-container">
    <div class="w-10 h-10 rounded-full bg-error text-on-error flex items-center justify-center flex-shrink-0 mt-0.5">
      <span class="material-symbols-outlined text-[20px]">notification_important</span>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex flex-wrap items-center justify-between gap-space-xs">
        <h4 class="font-title-md text-title-md text-on-surface font-semibold">Notifikasi In-App Sistem (FR-19 Log)</h4>
        <span class="font-label-sm text-label-sm text-on-surface-variant">Kemarin, 14:20 WIB</span>
      </div>
      <p class="font-body-md text-body-md text-on-surface-variant mt-1">
        Percobaan pendaftaran oleh <strong class="text-on-surface font-semibold">wahyu@mail.com</strong> sempat otomatis ditolak oleh sistem karena kuota household mencapai 6/6 anggota.
      </p>
    </div>
    <button @click="visible = false" class="text-on-surface-variant hover:text-on-surface p-1 rounded-full transition-colors">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  </div>
</template>
