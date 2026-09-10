<template>
  <div class="bg-surface-container-low rounded-lg p-space-xl shadow-sm space-y-space-md border border-surface-container-high">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
      <div class="flex items-center gap-space-xs">
        <span class="material-symbols-outlined text-outline text-[22px]">history_toggle_off</span>
        <div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">Anggota Nonaktif & Histori Tersimpan</h3>
          <p class="font-body-sm text-on-surface-variant">Integritas data terjaga. Riwayat transaksi akun nonaktif tetap aman dan dapat dipulihkan kapan saja.</p>
        </div>
      </div>
      <span class="px-space-sm py-1 rounded-full bg-surface-variant font-label-sm text-on-surface-variant">1 Akun Tersimpan</span>
    </div>

    <div class="bg-surface-container-lowest rounded-DEFAULT p-space-lg shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div class="flex items-start md:items-center gap-space-md">
        <div class="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-title-md font-semibold flex-shrink-0">BS</div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-space-xs">
            <span class="font-title-md text-on-surface font-semibold line-through decoration-outline">Budi Santoso</span>
            <span class="px-space-xs py-0.5 rounded-full bg-surface-variant font-label-sm text-on-surface-variant">Mantan Member</span>
            <span class="font-label-sm text-secondary font-semibold flex items-center gap-1 bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
              <span class="material-symbols-outlined text-[14px]">inventory_2</span> 148 Transaksi Tersimpan Utuh
            </span>
          </div>
          <p class="font-body-sm text-on-surface-variant">budi.santoso.old@mail.com • Dinonaktifkan pada <strong class="text-on-surface">15 Agustus 2026</strong></p>
          <p class="font-body-sm text-outline flex items-center gap-1 pt-1">
            <span class="material-symbols-outlined text-[15px]">info</span>
            Saat diundang kembali, akun ini otomatis aktif kembali dan seluruh 148 riwayat transaksinya langsung tersambung utuh tanpa duplikasi.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-space-sm pl-16 md:pl-0 flex-shrink-0">
        <button class="flex items-center gap-space-xs px-space-lg py-space-xs rounded-full bg-primary text-on-primary hover:bg-primary-container font-label-md transition-all active:scale-95 shadow-sm">
          <span class="material-symbols-outlined text-[18px]">reply</span>
          <span>Undang Kembali ke Household</span>
        </button>
      </div>
    </div>
  </div>
</template>
