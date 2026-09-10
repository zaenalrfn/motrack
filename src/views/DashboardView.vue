<script setup lang="ts">
import MainLayout from '../components/layout/MainLayout.vue'
import AlertBanners from '../components/dashboard/AlertBanners.vue'
import StatSummaryCards from '../components/dashboard/StatSummaryCards.vue'
import ParticipationCard from '../components/dashboard/ParticipationCard.vue'
import CategoryBreakdownWidget from '../components/transactions/CategoryBreakdownWidget.vue'
import LedgerTable from '../components/transactions/LedgerTable.vue'
</script>

<template>
  <MainLayout>
    <div class="w-full px-4 sm:px-6 lg:px-margin-desktop py-6 lg:py-space-xl space-y-space-lg">
      <!-- Alert Banners -->
      <AlertBanners />

      <!-- Stat Summary Cards -->
      <StatSummaryCards />

      <!-- Main Content Grid: Ledger + Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-space-lg">
        <!-- Ledger Table (3/4 width on desktop) -->
        <div class="lg:col-span-3">
          <LedgerTable />
        </div>

        <!-- Sidebar Widgets (1/4 width on desktop) -->
        <div class="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-space-lg">
          <ParticipationCard />
          <CategoryBreakdownWidget />
        </div>
      </div>
    </div>
  </MainLayout>
</template>
