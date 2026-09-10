<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md lg:gap-space-lg">
    <!-- Card 1: Total Budget -->
    <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Total Budget Dialokasikan</span>
        <div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-[22px]">account_balance_wallet</span>
        </div>
      </div>
      <div class="mt-space-md">
        <div class="font-headline-lg text-[32px] text-on-surface font-bold tabular-nums leading-tight">Rp 18.000.000</div>
        <div class="flex items-center gap-1.5 mt-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span class="text-secondary font-medium">5 Pos Kategori</span> teralokasi untuk periode ini
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-surface-container-high"></div>
    </div>

    <!-- Card 2: Realisasi -->
    <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Realisasi Pengeluaran</span>
        <div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
          <span class="material-symbols-outlined text-[22px]">shopping_basket</span>
        </div>
      </div>
      <div class="mt-space-md">
        <div class="font-headline-lg text-[32px] text-on-surface font-bold tabular-nums leading-tight">Rp 12.800.000</div>
        <div class="flex items-center gap-1.5 mt-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span class="inline-block w-2 h-2 rounded-full bg-tertiary"></span>
          <span>Terpakai <strong class="text-on-surface">71.1%</strong> dari total alokasi keluarga</span>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-tertiary-fixed"></div>
    </div>

    <!-- Card 3: Sisa -->
    <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <span class="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">Sisa Alokasi Bersih</span>
        <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
          <span class="material-symbols-outlined text-[22px]">savings</span>
        </div>
      </div>
      <div class="mt-space-md">
        <div class="font-headline-lg text-[32px] text-secondary font-bold tabular-nums leading-tight">Rp 5.200.000</div>
        <div class="flex items-center gap-1.5 mt-space-xs text-on-surface-variant font-body-sm text-body-sm">
          <span class="inline-flex items-center text-secondary font-semibold">
            <span class="material-symbols-outlined text-[16px]">trending_up</span> Cadangan Aman
          </span>
          <span>tersedia hingga 30 Sept</span>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>
    </div>
  </div>
</template>
