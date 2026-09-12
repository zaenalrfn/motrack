<script setup lang="ts">
import { useTransactionStore } from '../../stores/useTransactionStore'

const store = useTransactionStore()
</script>

<template>
  <div v-if="store.error" class="rounded-xl bg-error-container text-on-error-container p-space-md font-body-sm">{{ store.error }}</div>
  <div v-else-if="store.loading" class="rounded-xl bg-surface-container-low p-space-md text-on-surface-variant font-body-sm">Memuat ringkasan transaksi...</div>
</template>
