<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const emit = defineEmits(['add-transaction'])
</script>

<template>
  <div class="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col">
    <AppHeader @add-transaction="emit('add-transaction')" />
    <main class="w-full pt-20 bg-background min-h-screen flex-1">
      <slot></slot>
    </main>
    <AppFooter />
  </div>
</template>
