<template>
  <section class="flex flex-col gap-space-md">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
      <div>
        <div class="flex items-center gap-space-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
          <h2 class="font-headline-md text-headline-md text-on-surface">Pemantauan Pagu Kategori</h2>
        </div>
        <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Pantau rasio konsumsi dana rumah tangga dan waspadai pos yang menembus ambang batas aman.</p>
      </div>
      <span class="self-start sm:self-auto font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-sm py-1 rounded-full">
        Threshold: &gt;90% Peringatan
      </span>
    </div>

    <!-- Category Envelopes Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md lg:gap-space-lg">
      <!-- Item 1: Makanan & Groceries -->
      <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-space-sm">
            <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[26px]">shopping_cart</span>
            </div>
            <div>
              <h3 class="font-title-md text-title-md text-on-surface">Makanan &amp; Groceries</h3>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Sembako &amp; Konsumsi Harian</span>
            </div>
          </div>
          <span class="px-space-sm py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm font-semibold">
            86% Waspada
          </span>
        </div>
        <div class="flex flex-col gap-space-xs mt-space-xs">
          <div class="flex justify-between items-baseline">
            <span class="font-headline-sm text-on-surface tabular-nums font-semibold">Rp 5.200.000</span>
            <span class="font-body-sm text-on-surface-variant">dari Rp 6.000.000</span>
          </div>
          <div class="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
            <div class="h-full rounded-full bg-primary transition-all" style="width: 86.6%;"></div>
          </div>
          <div class="flex justify-between items-center text-on-surface-variant font-body-sm pt-1">
            <span>Sisa Pagu: <strong class="text-on-surface font-semibold">Rp 800.000</strong></span>
            <span class="text-primary font-medium flex items-center gap-0.5 text-[12px]">
              <span class="material-symbols-outlined text-[14px]">warning</span> Mendekati batas
            </span>
          </div>
        </div>
      </div>

      <!-- Item 2: Transportasi -->
      <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-space-sm">
            <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[26px]">local_gas_station</span>
            </div>
            <div>
              <h3 class="font-title-md text-title-md text-on-surface">Transportasi &amp; Bensin</h3>
              <span class="font-body-sm text-body-sm text-on-surface-variant">BBM, Tol, &amp; Parkir</span>
            </div>
          </div>
          <span class="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm font-semibold">
            74% Normal
          </span>
        </div>
        <div class="flex flex-col gap-space-xs mt-space-xs">
          <div class="flex justify-between items-baseline">
            <span class="font-headline-sm text-on-surface tabular-nums font-semibold">Rp 1.850.000</span>
            <span class="font-body-sm text-on-surface-variant">dari Rp 2.500.000</span>
          </div>
          <div class="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
            <div class="h-full rounded-full bg-tertiary transition-all" style="width: 74%;"></div>
          </div>
          <div class="flex justify-between items-center text-on-surface-variant font-body-sm pt-1">
            <span>Sisa Pagu: <strong class="text-on-surface font-semibold">Rp 650.000</strong></span>
            <span class="text-secondary font-medium">Terkendali</span>
          </div>
        </div>
      </div>

      <!-- Item 3: Tagihan & Listrik (Overbudget) -->
      <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-md flex flex-col justify-between gap-space-md ring-2 ring-error/20 bg-error-container/10 hover:shadow-lg transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-space-sm">
            <div class="w-12 h-12 rounded-full bg-error-container flex items-center justify-center text-error">
              <span class="material-symbols-outlined text-[26px]">bolt</span>
            </div>
            <div>
              <h3 class="font-title-md text-title-md text-error font-semibold">Tagihan &amp; Listrik</h3>
              <span class="font-body-sm text-body-sm text-on-surface-variant">PLN, PDAM, &amp; WiFi Rumah</span>
            </div>
          </div>
          <span class="px-space-sm py-0.5 rounded-full bg-error text-on-error font-label-sm font-semibold flex items-center gap-1 animate-pulse">
            <span class="material-symbols-outlined text-[13px]">error</span> Melebihi Budget!
          </span>
        </div>
        <div class="flex flex-col gap-space-xs mt-space-xs">
          <div class="flex justify-between items-baseline">
            <span class="font-headline-sm text-error tabular-nums font-bold">Rp 2.100.000</span>
            <span class="font-body-sm text-on-surface-variant">dari Rp 2.000.000</span>
          </div>
          <div class="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
            <div class="h-full rounded-full bg-error transition-all" style="width: 100%;"></div>
          </div>
          <div class="flex justify-between items-center text-error font-body-sm pt-1">
            <span class="font-medium">Defisit: <strong>- Rp 100.000</strong></span>
            <span class="font-semibold text-[12px] uppercase tracking-wide">105% Terpakai</span>
          </div>
        </div>
      </div>

      <!-- Item 4: Pendidikan -->
      <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-space-sm">
            <div class="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[26px]">school</span>
            </div>
            <div>
              <h3 class="font-title-md text-title-md text-on-surface">Pendidikan Anak</h3>
              <span class="font-body-sm text-body-sm text-on-surface-variant">SPP &amp; Perlengkapan Belajar</span>
            </div>
          </div>
          <span class="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm font-semibold">
            50% Aman
          </span>
        </div>
        <div class="flex flex-col gap-space-xs mt-space-xs">
          <div class="flex justify-between items-baseline">
            <span class="font-headline-sm text-on-surface tabular-nums font-semibold">Rp 2.000.000</span>
            <span class="font-body-sm text-on-surface-variant">dari Rp 4.000.000</span>
          </div>
          <div class="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
            <div class="h-full rounded-full bg-secondary transition-all" style="width: 50%;"></div>
          </div>
          <div class="flex justify-between items-center text-on-surface-variant font-body-sm pt-1">
            <span>Sisa Pagu: <strong class="text-secondary font-semibold">Rp 2.000.000</strong></span>
            <span class="text-secondary font-medium">Sangat Optimal</span>
          </div>
        </div>
      </div>

      <!-- Item 5: Hiburan -->
      <div class="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-space-sm">
            <div class="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined text-[26px]">movie</span>
            </div>
            <div>
              <h3 class="font-title-md text-title-md text-on-surface">Hiburan &amp; Rekreasi</h3>
              <span class="font-body-sm text-body-sm text-on-surface-variant">Wisata Akhir Pekan &amp; Kuliner</span>
            </div>
          </div>
          <span class="px-space-sm py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm font-semibold">
            66% Normal
          </span>
        </div>
        <div class="flex flex-col gap-space-xs mt-space-xs">
          <div class="flex justify-between items-baseline">
            <span class="font-headline-sm text-on-surface tabular-nums font-semibold">Rp 1.650.000</span>
            <span class="font-body-sm text-on-surface-variant">dari Rp 2.500.000</span>
          </div>
          <div class="w-full h-3 rounded-full bg-surface-container overflow-hidden p-0.5">
            <div class="h-full rounded-full bg-secondary transition-all" style="width: 66%;"></div>
          </div>
          <div class="flex justify-between items-center text-on-surface-variant font-body-sm pt-1">
            <span>Sisa Pagu: <strong class="text-on-surface font-semibold">Rp 850.000</strong></span>
            <span class="text-on-surface-variant font-medium">Dalam Kuota</span>
          </div>
        </div>
      </div>

      <!-- Item 6: Add CTA -->
      <div class="border-2 border-dashed border-outline/30 bg-surface-container-low/60 rounded-lg p-space-lg flex flex-col items-center justify-center text-center gap-space-sm cursor-pointer hover:bg-surface-container-high transition-colors group">
        <div class="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined text-[28px]">post_add</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="font-headline-sm text-headline-sm text-on-surface">Tambah Kategori Baru</span>
          <span class="font-body-sm text-body-sm text-on-surface-variant max-w-[200px] mt-1">Alokasikan dana pos darurat, investasi, atau tabungan liburan</span>
        </div>
      </div>
    </div>
  </section>
</template>
