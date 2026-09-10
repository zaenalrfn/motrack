<template>
  <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm space-y-space-md">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-headline-sm text-headline-sm text-on-surface">Porsi Pengeluaran</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Alokasi belanja terbesar September</p>
      </div>
      <span class="material-symbols-outlined text-primary text-[20px]">pie_chart</span>
    </div>
    <!-- Minimal Category Visual Bars -->
    <div class="space-y-space-sm">
      <!-- 1. Makanan & Dapur -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-label-md text-label-md">
          <span class="text-on-surface font-medium flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-primary"></span> Makanan &amp; Sembako
          </span>
          <span class="text-on-surface font-semibold">Rp 5.240.000 <span class="text-on-surface-variant font-normal text-[11px]">(41%)</span></span>
        </div>
        <div class="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
          <div class="bg-primary h-full rounded-full" style="width: 41%"></div>
        </div>
      </div>
      <!-- 2. Tagihan & Utilitas -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-label-md text-label-md">
          <span class="text-on-surface font-medium flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-tertiary"></span> Tagihan &amp; Utilitas
          </span>
          <span class="text-on-surface font-semibold">Rp 3.200.000 <span class="text-on-surface-variant font-normal text-[11px]">(25%)</span></span>
        </div>
        <div class="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
          <div class="bg-tertiary h-full rounded-full" style="width: 25%"></div>
        </div>
      </div>
      <!-- 3. Pendidikan & Anak -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-label-md text-label-md">
          <span class="text-on-surface font-medium flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary"></span> Pendidikan &amp; Les
          </span>
          <span class="text-on-surface font-semibold">Rp 2.450.000 <span class="text-on-surface-variant font-normal text-[11px]">(19%)</span></span>
        </div>
        <div class="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
          <div class="bg-secondary h-full rounded-full" style="width: 19%"></div>
        </div>
      </div>
      <!-- 4. Transportasi & Bensin -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-label-md text-label-md">
          <span class="text-on-surface font-medium flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-outline"></span> Transportasi
          </span>
          <span class="text-on-surface font-semibold">Rp 1.150.000 <span class="text-on-surface-variant font-normal text-[11px]">(9%)</span></span>
        </div>
        <div class="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
          <div class="bg-outline h-full rounded-full" style="width: 9%"></div>
        </div>
      </div>
      <!-- 5. Lainnya / Hiburan -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-label-md text-label-md">
          <span class="text-on-surface font-medium flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-surface-container-highest"></span> Hiburan &amp; Rekreasi
          </span>
          <span class="text-on-surface font-semibold">Rp 760.000 <span class="text-on-surface-variant font-normal text-[11px]">(6%)</span></span>
        </div>
        <div class="w-full bg-surface-container-low h-2 rounded-full overflow-hidden">
          <div class="bg-surface-container-highest h-full rounded-full" style="width: 6%"></div>
        </div>
      </div>
    </div>
    <div class="pt-space-xs">
      <a class="w-full py-space-xs rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1 transition-colors" href="#">
        <span>Analisis Laporan Lengkap</span>
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </a>
    </div>
  </div>
</template>
