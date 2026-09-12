<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import TransactionModal from './components/transactions/TransactionModal.vue'
import { useAuthStore } from './stores/useAuthStore'
import { useTransactionStore } from './stores/useTransactionStore'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const isModalOpen = ref(false)

const openTransactionModal = () => { isModalOpen.value = true }
provide('openTransactionModal', openTransactionModal)

onMounted(async () => {
  await authStore.initAuth()
  if (authStore.household?.id) await transactionStore.loadTransactions()
})
</script>

<template>
  <router-view />
  <TransactionModal :is-open="isModalOpen" @close="isModalOpen = false" @saved="transactionStore.loadTransactions()" />
</template>
