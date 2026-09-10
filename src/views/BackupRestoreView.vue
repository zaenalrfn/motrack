<script setup lang="ts">
import MainLayout from '../components/layout/MainLayout.vue'
import BackupFormatSelector from '../components/backup/BackupFormatSelector.vue'
import BackupDateFilter from '../components/backup/BackupDateFilter.vue'
import RestoreUploadSection from '../components/backup/RestoreUploadSection.vue'
import BackupAuditLogTable from '../components/backup/BackupAuditLogTable.vue'
</script>

<template>
  <MainLayout>
    <div class="w-full px-margin-desktop py-space-xl space-y-space-2xl">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div class="space-y-space-2xs">
          <div class="inline-flex items-center gap-space-xs px-space-md py-space-2xs rounded-full bg-primary-fixed text-on-primary-fixed-variant">
            <span class="material-symbols-outlined text-[16px]">verified_user</span>
            <span class="font-label-sm tracking-wider uppercase">Modul Keamanan & Migrasi BR-07 s/d BR-14 Terintegrasi</span>
          </div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">Pusat Cadangan & Pemulihan Data</h1>
          <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Amankan catatan keuangan keluarga Rina dengan pencadangan terenkripsi mandiri, ekspor arsip komprehensif, atau pulihkan data dari perangkat lain.
          </p>
        </div>
      </div>

      <!-- Sync Status Banner -->
      <div class="bg-secondary-container/20 border border-secondary/30 rounded-lg p-space-md flex items-center justify-between">
        <div class="flex items-center gap-space-sm">
          <span class="material-symbols-outlined text-secondary text-[24px]">cloud_sync</span>
          <div>
            <p class="font-title-md text-on-surface font-semibold">Status Sinkronisasi Cadangan Terakhir</p>
            <p class="font-body-sm text-on-surface-variant">Kemarin, 21:40 WIB</p>
          </div>
        </div>
        <div class="flex items-center gap-space-sm">
          <a href="#export-section" class="px-space-md py-space-xs rounded-full bg-secondary text-on-secondary font-label-md hover:bg-secondary/90 transition-all">Export (Backup)</a>
          <a href="#import-section" class="px-space-md py-space-xs rounded-full bg-surface-container hover:bg-surface-container-high font-label-md text-on-surface transition-all">Restore (Import)</a>
        </div>
      </div>

      <!-- Section 1: Export (Format + Date Filter) -->
      <div id="export-section" class="space-y-space-xl bg-surface-container-lowest rounded-lg p-space-xl shadow-sm">
        <BackupFormatSelector />
        <BackupDateFilter />
      </div>

      <!-- Section 2: Restore (Upload & Validation) -->
      <div id="import-section" class="bg-surface-container-lowest rounded-lg p-space-xl shadow-sm">
        <RestoreUploadSection />
      </div>

      <!-- Section 3: Audit Log -->
      <BackupAuditLogTable />
    </div>
  </MainLayout>
</template>
