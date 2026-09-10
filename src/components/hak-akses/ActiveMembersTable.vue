<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['open-delete'])

const members = ref([
  { initial: 'R', name: 'Rina', sub: 'Owner', email: 'rina.household@mail.com', roleBg: 'bg-primary text-on-primary', badgeBg: 'bg-primary-fixed text-on-primary-fixed-variant', access: 'Akses Penuh Semua Pos', accessIcon: 'all_inclusive', since: '01 Jan 2024 (Pembuat)', locked: true },
  { initial: 'B', name: 'Budi', sub: 'Suami', email: 'budi@mail.com', roleBg: 'bg-secondary text-on-secondary', badgeBg: 'bg-surface-container text-on-surface-variant', access: 'Pos Belanja & Utilitas', accessIcon: 'check', since: '12 Jan 2024', role: 'member', locked: false, txCount: 214 },
  { initial: 'D', name: 'Dinda', sub: 'Anak', email: 'dinda@student.mail.com', roleBg: 'bg-tertiary text-on-tertiary', badgeBg: 'bg-surface-container text-on-surface-variant', access: 'Pos Uang Saku & Edukasi', accessIcon: 'check', since: '18 Mar 2024', role: 'member', locked: false, txCount: 82 },
  { initial: 'F', name: 'Farhan', sub: 'Adik', email: 'farhan@mail.com', roleBg: 'bg-surface-tint text-on-primary', badgeBg: 'bg-surface-container text-on-surface-variant', access: 'Pos Logistik Mingguan', accessIcon: 'check', since: '02 Mei 2024', role: 'member', locked: false, txCount: 45 }
])

const handleSoftDelete = (m: any) => {
  emit('open-delete', m)
}
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm space-y-space-lg">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
      <div class="space-y-space-2xs">
        <h2 class="font-headline-sm text-headline-sm text-on-surface">Daftar Anggota Aktif Household</h2>
        <p class="font-body-sm text-on-surface-variant">Seluruh anggota memiliki hak pencatatan transaksi sesuai izin envelope anggaran keluarga.</p>
      </div>
      <span class="px-space-md py-space-2xs rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm font-semibold">4 Anggota Aktif</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-surface-container-low text-on-surface-variant font-label-md uppercase tracking-wider">
            <th class="py-space-sm px-space-md rounded-l-DEFAULT">Nama & Kontak</th>
            <th class="py-space-sm px-space-md">Peran (Role)</th>
            <th class="py-space-sm px-space-md">Izin Anggaran (FR-02)</th>
            <th class="py-space-sm px-space-md">Bergabung Sejak</th>
            <th class="py-space-sm px-space-md text-right rounded-r-DEFAULT">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container-high/40 font-body-md">
          <!-- Rina -->
          <tr class="hover:bg-surface-container-low/40 transition-colors">
            <td class="py-space-md px-space-md">
              <div class="flex items-center gap-space-sm">
                <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm font-semibold">R</div>
                <div>
                  <div class="flex items-center gap-space-xs">
                    <span class="font-title-md text-on-surface font-semibold">Rina</span>
                    <span class="px-space-2xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm font-bold uppercase">Owner</span>
                  </div>
                  <span class="font-body-sm text-on-surface-variant">rina.household@mail.com</span>
                </div>
              </div>
            </td>
            <td class="py-space-md px-space-md">
              <span class="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-md font-semibold">
                <span class="material-symbols-outlined text-[16px]">shield_person</span>
                <span>Admin Household</span>
              </span>
            </td>
            <td class="py-space-md px-space-md">
              <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm font-semibold">
                <span class="material-symbols-outlined text-[14px]">all_inclusive</span> Akses Penuh Semua Pos
              </span>
            </td>
            <td class="py-space-md px-space-md font-body-sm text-on-surface-variant">01 Jan 2024 (Pembuat)</td>
            <td class="py-space-md px-space-md text-right">
              <span class="font-label-sm text-on-surface-variant/70 italic px-space-sm py-1 bg-surface-container rounded-full">Akses Utama Terkunci</span>
            </td>
          </tr>

          <!-- Budi, Dinda, Farhan -->
          <tr v-for="m in members.slice(1)" :key="m.email" class="hover:bg-surface-container-low/40 transition-colors">
            <td class="py-space-md px-space-md">
              <div class="flex items-center gap-space-sm">
                <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-headline-sm font-semibold', m.roleBg]">{{ m.initial }}</div>
                <div>
                  <div class="flex items-center gap-space-xs">
                    <span class="font-title-md text-on-surface font-semibold">{{ m.name }}</span>
                    <span :class="['font-label-sm px-space-2xs rounded', m.badgeBg]">{{ m.sub }}</span>
                  </div>
                  <span class="font-body-sm text-on-surface-variant">{{ m.email }}</span>
                </div>
              </div>
            </td>
            <td class="py-space-md px-space-md">
              <select class="bg-surface-container-low text-on-surface rounded-DEFAULT px-space-sm py-1 font-label-md focus:ring-2 focus:ring-primary/40 focus:outline-none">
                <option value="member">Member Biasa</option>
                <option value="admin">Admin Tambahan</option>
              </select>
            </td>
            <td class="py-space-md px-space-md">
              <span class="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm">
                <span class="material-symbols-outlined text-[14px] text-secondary">{{ m.accessIcon }}</span> {{ m.access }}
              </span>
            </td>
            <td class="py-space-md px-space-md font-body-sm text-on-surface-variant">{{ m.since }}</td>
            <td class="py-space-md px-space-md text-right">
              <div class="flex items-center justify-end gap-space-xs">
                <button class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" title="Ubah Hak Akses">
                  <span class="material-symbols-outlined text-[18px]">tune</span>
                </button>
                <button @click="handleSoftDelete(m)" class="p-2 rounded-full hover:bg-error-container text-outline hover:text-error transition-colors" title="Keluarkan / Soft Delete Anggota">
                  <span class="material-symbols-outlined text-[18px]">person_remove</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
