<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import TransactionModal from './components/transactions/TransactionModal.vue'
import { useAuthStore } from './stores/useAuthStore'
import { useTransactionStore } from './stores/useTransactionStore'
import { useBudgetStore } from './stores/useBudgetStore'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const isModalOpen = ref(false)

const openTransactionModal = () => { isModalOpen.value = true }
provide('openTransactionModal', openTransactionModal)

const handleSaved = async () => {
  await Promise.all([
    transactionStore.loadTransactions(),
    budgetStore.loadBudgetData(budgetStore.selectedMonth, true)
  ])
}

onMounted(async () => {
  await authStore.initAuth()
  if (authStore.household?.id) {
    await Promise.all([
      transactionStore.loadTransactions(),
      budgetStore.loadBudgetData()
    ])
  }
})
</script>

<template>
  <router-view />
  <TransactionModal :is-open="isModalOpen" @close="isModalOpen = false" @saved="handleSaved" />
</template>
