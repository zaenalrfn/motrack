<script setup lang="ts">
import { useTransactionStore } from '../../stores/useTransactionStore'

const store = useTransactionStore()
</script>

<template>
  <div class="bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col justify-between">
    <div><div class="flex items-center justify-between text-on-surface-variant mb-space-sm"><span class="font-label-md font-medium tracking-wide">Partisipasi Rumah Tangga</span><span class="material-symbols-outlined text-primary text-[22px]">diversity_3</span></div>
      <div v-if="!store.participation.length" class="text-sm text-on-surface-variant py-4">Belum ada transaksi tercatat.</div>
      <div v-else class="space-y-2"><div v-for="member in store.participation" :key="member.name" class="flex items-center justify-between"><span class="font-body-sm text-on-surface">{{ member.name }}</span><span class="font-label-sm text-secondary font-semibold">{{ member.count }} transaksi</span></div></div>
    </div>
    <div class="mt-space-md pt-space-xs flex items-center justify-between border-t border-surface-container"><span class="font-label-sm text-on-surface-variant">Data dari buku kas</span><span class="font-label-sm text-secondary font-bold flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-secondary"></span> Sinkron</span></div>
  </div>
</template>
