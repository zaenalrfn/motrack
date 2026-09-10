<script setup lang="ts">
import { ref } from 'vue'
const pending = ref(true)

const approve = () => {
  pending.value = false
}
const reject = () => {
  pending.value = false
}
</script>

<template>
  <div v-if="pending" class="space-y-space-md">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-space-xs">
        <div class="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
          <span class="material-symbols-outlined text-[18px]">pending_actions</span>
        </div>
        <div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Antrean Persetujuan Calon Anggota (FR-20)</h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Permintaan bergabung yang menunggu tinjauan eksplisit dari Admin.</p>
        </div>
      </div>
      <span class="px-space-md py-space-2xs rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm font-semibold">1 Permohonan Tertunda</span>
    </div>

    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div class="flex items-start md:items-center gap-space-md">
        <div class="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-headline-sm font-bold flex-shrink-0">DP</div>
        <div class="space-y-0.5">
          <div class="flex items-center gap-space-xs">
            <span class="font-title-md text-title-md text-on-surface font-semibold">Doni Pratama</span>
            <span class="px-space-xs py-0.5 rounded-full bg-surface-container font-label-sm text-on-surface-variant">Pemohon Join</span>
          </div>
          <p class="font-body-md text-on-surface-variant">doni@mail.com</p>
          <div class="flex items-center gap-space-xs text-on-surface-variant font-label-sm pt-1">
            <span class="material-symbols-outlined text-[15px] text-tertiary">schedule</span>
            <span>Memohon via tautan undangan publik pada <strong class="text-on-surface">10 Sep 2026, 09:15 WIB</strong></span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-space-sm">
        <button @click="reject" class="px-space-lg py-space-xs rounded-full bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface font-label-md transition-colors">Tolak Permohonan</button>
        <button @click="approve" class="flex items-center gap-space-xs px-space-lg py-space-xs rounded-full bg-secondary text-on-secondary hover:bg-secondary/90 font-label-md transition-all shadow-sm">
          <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
          <span>Setujui Anggota</span>
        </button>
      </div>
    </div>
  </div>
</template>
