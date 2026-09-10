<script setup lang="ts">
import { ref, provide, onMounted } from 'vue'
import TransactionModal from './components/transactions/TransactionModal.vue'
import { useAuthStore } from './stores/useAuthStore'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})

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
