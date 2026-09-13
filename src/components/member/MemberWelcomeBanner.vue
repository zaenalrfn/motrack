<script setup lang="ts">
defineProps<{
  memberName: string
  householdName: string
  personalTotal: number
  transactionCount: number
  loading?: boolean
}>()

defineEmits<{ (e: 'open-modal'): void }>()

const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID')
</script>

<template>
  <section class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm border border-surface-variant/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg relative overflow-hidden">
    <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-primary-fixed/30 rounded-full blur-xl pointer-events-none"></div>
    <div class="flex items-start gap-space-md max-w-3xl">
      <div class="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
        <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">shield_person</span>
      </div>
      <div class="flex flex-col gap-space-2xs">
        <div class="flex items-center gap-space-xs flex-wrap">
          <span class="font-headline-sm text-headline-sm text-on-surface font-bold">Halo, {{ memberName }}!</span>
          <span class="bg-secondary-container text-on-secondary-container px-space-xs py-space-2xs rounded-full font-label-sm text-label-sm flex items-center gap-1 font-semibold">
            <span class="material-symbols-outlined text-xs">verified</span> Akun Terverifikasi
          </span>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          Anda memiliki peran <strong>Member Aktif</strong> di {{ householdName }}. Anda dapat mencatat pengeluaran kapan saja serta memantau pagu terbuka sesuai izin Admin.
        </p>
      </div>
    </div>
    <div class="flex items-center gap-space-md w-full lg:w-auto bg-surface-container-low rounded-DEFAULT p-space-md border border-surface-variant/40">
      <div class="flex flex-col">
        <span class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Pengeluaran Pribadi (Bulan Ini)</span>
        <span class="font-headline-sm text-headline-sm text-primary tracking-tight font-bold tabular-nums">{{ loading ? 'Memuat...' : formatRupiah(personalTotal) }}</span>
        <span class="font-body-sm text-body-sm text-on-surface-variant">{{ transactionCount }} transaksi tercatat bulan ini</span>
      </div>
      <button @click="$emit('open-modal')" class="bg-primary text-on-primary hover:bg-primary-container px-space-md py-space-sm rounded-full font-label-lg text-label-lg transition-all shadow-sm hover:shadow flex items-center gap-space-xs shrink-0 active:scale-95">
        <span class="material-symbols-outlined text-sm">edit_note</span>
        <span>Catat Baru</span>
      </button>
    </div>
  </section>
</template>
