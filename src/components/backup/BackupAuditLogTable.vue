<script setup lang="ts">
const logs = [
  { date: '23 Okt 2024, 21:40', act: 'download Export Bulanan', fmt: 'Full JSON', vol: '1.420 item (4 relasi)', who: 'R', name: 'Rina (Admin)', status: 'Sukses Unduh', statusBg: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  { date: '15 Okt 2024, 14:15', act: 'publish Restore Gabung (Merge)', fmt: 'CSV Bundle (.zip)', vol: '+18 transaksi baru, 0 duplikat', who: 'B', name: 'Budi (Suami)', status: 'Berhasil Dipulihkan', statusBg: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  { date: '30 Sep 2024, 09:12', act: 'download Export Kuartal Q3', fmt: 'Full JSON', vol: '1.280 item', who: 'R', name: 'Rina (Admin)', status: 'Sukses Unduh', statusBg: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
  { date: '12 Sep 2024, 18:04', act: 'file_open Percobaan Restore', fmt: 'CSV Parsial', vol: 'Hanya transactions.csv', who: 'D', name: 'Dimas (Anak)', status: 'Ditolak Otomatis', statusBg: 'bg-error-container text-on-error-container' }
]
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm space-y-space-lg">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-headline-sm text-headline-sm text-on-surface">Log Audit Aktivitas Cadangan & Pemulihan</h3>
        <p class="font-body-sm text-on-surface-variant">Catatan transparan setiap eksekusi ekspor dan impor oleh anggota rumah tangga.</p>
      </div>
      <span class="px-space-md py-space-2xs rounded-full bg-surface-container font-label-sm font-semibold">Total: 4 Aktivitas Terakhir</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-surface-container-low text-on-surface-variant font-label-md uppercase tracking-wider">
            <th class="py-space-sm px-space-md rounded-l-lg">Waktu & Tanggal</th>
            <th class="py-space-sm px-space-md">Aktivitas</th>
            <th class="py-space-sm px-space-md">Format Berkas</th>
            <th class="py-space-sm px-space-md">Volume Entri</th>
            <th class="py-space-sm px-space-md">Pelaksana</th>
            <th class="py-space-sm px-space-md text-right rounded-r-lg">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-surface-container font-body-md">
          <tr v-for="l in logs" :key="l.date" class="hover:bg-surface-container-low/40 transition-colors">
            <td class="py-space-md px-space-md font-body-sm text-on-surface-variant">{{ l.date }}</td>
            <td class="py-space-md px-space-md font-semibold text-on-surface">{{ l.act }}</td>
            <td class="py-space-md px-space-md font-body-sm text-on-surface-variant">{{ l.fmt }}</td>
            <td class="py-space-md px-space-md font-body-sm text-on-surface-variant">{{ l.vol }}</td>
            <td class="py-space-md px-space-md">
              <div class="flex items-center gap-space-xs">
                <div class="w-7 h-7 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs">{{ l.who }}</div>
                <span class="text-on-surface text-body-sm">{{ l.name }}</span>
              </div>
            </td>
            <td class="py-space-md px-space-md text-right">
              <span :class="['px-space-sm py-1 rounded-full font-label-sm font-semibold', l.statusBg]">
                {{ l.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
