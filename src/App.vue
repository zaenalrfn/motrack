<script setup lang="ts">
import { ref, provide } from 'vue'
import TransactionModal from './components/transactions/TransactionModal.vue'

const isModalOpen = ref(false)
const openTransactionModal = () => {
  isModalOpen.value = true
}

provide('openTransactionModal', openTransactionModal)

const handleSaveTransaction = (transaction: any) => {
  console.log('Saved:', transaction)
}
</script>

<template>
  <router-view />
  <TransactionModal 
    :is-open="isModalOpen" 
    @close="isModalOpen = false" 
    @save="handleSaveTransaction" 
  />
</template>
