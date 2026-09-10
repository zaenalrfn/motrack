<script setup lang="ts">
import { ref } from 'vue'
import AddMemberModal from './AddMemberModal.vue'

const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
const link = ref(`${baseUrl}/join/hh-rina-88f29c01`)
const copied = ref(false)

const copyLink = () => {
  navigator.clipboard.writeText(link.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const resetLink = () => {
  const rand = Math.random().toString(36).substring(2, 8)
  link.value = `${baseUrl}/join/hh-rina-${rand}`
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
    <!-- Kuota Metric Card -->
    <div class="lg:col-span-7 bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
      <div class="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-secondary-fixed/40 blur-2xl pointer-events-none"></div>
      <div class="space-y-space-md relative z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <span class="w-3 h-3 rounded-full bg-secondary"></span>
            <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status Kapasitas Household</span>
          </div>
          <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
            <span class="material-symbols-outlined text-[14px]">verified</span> Kuota Gratis Selamanya
          </span>
        </div>
        <div class="flex flex-wrap items-baseline gap-space-xs">
          <span class="font-display-lg text-[48px] text-on-surface tracking-tight font-bold">4</span>
          <span class="font-title-md text-title-md text-on-surface-variant font-normal">dari</span>
          <span class="font-display-lg text-[48px] text-primary tracking-tight font-bold">6</span>
          <span class="font-title-md text-title-md text-on-surface font-medium">Anggota Terdaftar</span>
          <span class="ml-auto font-label-lg text-label-lg text-secondary font-semibold bg-secondary-fixed/60 px-space-sm py-1 rounded-full">Sisa 2 Kursi Tersedia</span>
        </div>
        <div class="space-y-space-2xs">
          <div class="w-full bg-surface-container rounded-full h-3 flex overflow-hidden p-0.5">
            <div class="bg-secondary h-full rounded-full transition-all duration-500" style="width: 66.66%;"></div>
          </div>
          <div class="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
            <span>Terisi: 4 Kursi (Admin & 3 Member)</span>
            <span>Batas Maks: 6 Anggota</span>
          </div>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant pt-space-2xs">
          Setiap anggota yang bergabung wajib melalui <strong>persetujuan eksplisit Admin</strong>.
        </p>
      </div>
      <div class="pt-space-lg flex items-center justify-between border-t border-surface-container-high/40 mt-space-md">
        <div class="flex items-center -space-x-2">
          <div class="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold ring-2 ring-surface-container-lowest">R</div>
          <div class="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center font-bold ring-2 ring-surface-container-lowest">B</div>
          <div class="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center font-bold ring-2 ring-surface-container-lowest">D</div>
          <div class="w-10 h-10 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-bold ring-2 ring-surface-container-lowest">F</div>
          <div class="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-semibold border border-dashed border-outline/50">+2</div>
        </div>
        <AddMemberModal />
      </div>
    </div>

    <!-- Invite Link Card -->
    <div class="lg:col-span-5 bg-surface-container-lowest rounded-lg p-space-xl shadow-sm flex flex-col justify-between">
      <div class="space-y-space-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs">
            <span class="material-symbols-outlined text-primary text-[20px]">link</span>
            <h2 class="font-title-md text-title-md text-on-surface">Link Undangan Household</h2>
          </div>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant">Bagikan link ini kepada keluarga Anda.</p>
        <div class="flex items-center gap-space-xs bg-surface-container-low p-space-xs rounded-full">
          <input class="bg-transparent text-on-surface font-body-sm px-space-xs w-full focus:outline-none" readonly :value="link" />
          <button @click="copyLink" class="flex items-center gap-1 px-space-md py-space-xs rounded-full bg-primary text-on-primary font-label-sm hover:bg-primary-container transition-all active:scale-95 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">{{ copied ? 'check' : 'content_copy' }}</span>
            <span>{{ copied ? 'Tersalin!' : 'Salin' }}</span>
          </button>
        </div>
      </div>
      <div class="pt-space-md mt-space-md border-t border-surface-container-high/40 flex items-center justify-between">
        <div>
          <p class="font-label-sm text-on-surface font-semibold">Keamanan Link</p>
          <p class="font-body-sm text-on-surface-variant">Kedaluwarsa dalam 7 hari</p>
        </div>
        <button @click="resetLink" class="flex items-center gap-space-2xs px-space-md py-space-xs rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">
          <span class="material-symbols-outlined text-[16px] text-tertiary">restart_alt</span>
          <span>Reset Link Baru</span>
        </button>
      </div>
    </div>
  </div>
</template>
