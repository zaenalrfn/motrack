<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-md lg:col-span-3">
    <!-- Total Saldo Bersama -->
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div class="flex items-center justify-between text-on-surface-variant mb-space-sm">
        <span class="font-label-md text-label-md font-medium tracking-wide">Saldo Kas</span>
        <span class="material-symbols-outlined text-secondary text-[22px]">account_balance</span>
      </div>
      <div class="flex flex-col">
        <span class="font-display-lg text-[26px] sm:text-[32px] tracking-tight text-on-surface leading-tight font-bold">Rp 28.450.000</span>
        <div class="flex items-center gap-1.5 mt-space-xs text-secondary font-label-sm text-label-sm">
          <span class="material-symbols-outlined text-[14px]">trending_up</span>
          <span class="font-semibold">+14.2%</span>
        </div>
      </div>
    </div>
    
    <!-- Total Pengeluaran Bulan Ini (With Budget Meter) -->
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div class="flex items-center justify-between text-on-surface-variant mb-space-sm">
        <span class="font-label-md text-label-md font-medium tracking-wide">Pengeluaran September</span>
        <div class="bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold">71% Limit</div>
      </div>
      <div class="flex flex-col">
        <span class="font-display-lg text-[32px] tracking-tight text-primary leading-tight font-bold">Rp 12.800.000</span>
        <div class="flex items-center justify-between mt-space-2xs text-on-surface-variant font-body-sm text-body-sm">
          <span>Batas: Rp 18.000.000</span>
          <span class="text-on-surface font-medium">Sisa Rp 5.200.000</span>
        </div>
      </div>
      <!-- Progress bar 71% (Amber state) -->
      <div class="w-full bg-surface-container-high h-2.5 rounded-full mt-space-sm overflow-hidden">
        <div class="bg-tertiary h-full rounded-full transition-all duration-700" style="width: 71%"></div>
      </div>
    </div>
    
    <!-- Total Pemasukan -->
    <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div class="flex items-center justify-between text-on-surface-variant mb-space-sm">
        <span class="font-label-md text-label-md font-medium tracking-wide">Pemasukan September</span>
        <span class="material-symbols-outlined text-secondary text-[22px]">payments</span>
      </div>
      <div class="flex flex-col">
        <span class="font-display-lg text-[32px] tracking-tight text-secondary leading-tight font-bold">Rp 24.500.000</span>
        <div class="flex items-center gap-1.5 mt-space-xs text-secondary font-label-sm text-label-sm">
          <span class="material-symbols-outlined text-[14px]">check_circle</span>
          <span class="font-semibold">Gaji Pokok &amp; Usaha Sampingan</span>
        </div>
      </div>
      <div class="mt-space-md pt-space-xs flex items-center justify-between border-t border-surface-container text-body-sm text-on-surface-variant">
        <span>Target Bulanan</span>
        <span class="font-semibold text-secondary">Tercapai 102%</span>
      </div>
    </div>
  </div>
</template>
