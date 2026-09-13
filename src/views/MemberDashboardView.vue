<script setup lang="ts">
import { computed, inject, onMounted, watch } from 'vue'
import MainLayout from '../components/layout/MainLayout.vue'
import MemberWelcomeBanner from '../components/member/MemberWelcomeBanner.vue'
import QuickInlineExpenseForm from '../components/member/QuickInlineExpenseForm.vue'
import MemberBudgetGrantsCard from '../components/member/MemberBudgetGrantsCard.vue'
import MemberLedgerTable from '../components/member/MemberLedgerTable.vue'
import MonitoredPortionsWidget from '../components/member/MonitoredPortionsWidget.vue'
import MemberRecentActivityWidget from '../components/member/MemberRecentActivityWidget.vue'
import { useAuthStore } from '../stores/useAuthStore'
import { useTransactionStore } from '../stores/useTransactionStore'
import { useBudgetStore } from '../stores/useBudgetStore'
import { usePermissionStore } from '../stores/usePermissionStore'

const authStore = useAuthStore()
const transactionStore = useTransactionStore()
const budgetStore = useBudgetStore()
const permissionStore = usePermissionStore()
const openTransactionModal = inject('openTransactionModal') as () => void

const loadAll = async () => {
  if (!authStore.household?.id) return
  await Promise.all([
    transactionStore.loadTransactions(),
    budgetStore.loadBudgetData(),
    permissionStore.loadMatrix(),
  ])
}

onMounted(() => { void loadAll() })
watch(() => authStore.household?.id, () => { void loadAll() })

const memberName = computed(() => authStore.currentMember?.name || authStore.user?.user_metadata?.name || 'Member')
const householdName = computed(() => authStore.household?.name || 'Keluarga')
const myTransactions = computed(() => transactionStore.transactions.filter((t) => t.created_by === authStore.currentMember?.id && t.type === 'expense'))
const personalTotal = computed(() => myTransactions.value.reduce((sum, t) => sum + t.amount, 0))
</script>

<template>
  <MainLayout>
    <div class="max-w-[1440px] mx-auto px-space-md lg:px-margin-desktop py-space-lg flex flex-col gap-space-lg relative z-10">
      <MemberWelcomeBanner
        :member-name="memberName"
        :household-name="householdName"
        :personal-total="personalTotal"
        :transaction-count="myTransactions.length"
        :loading="transactionStore.loading"
        @open-modal="openTransactionModal"
      />
      <QuickInlineExpenseForm />
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div class="lg:col-span-8 flex flex-col gap-space-lg min-w-0">
          <MemberBudgetGrantsCard />
          <MemberLedgerTable />
        </div>
        <div class="lg:col-span-4 flex flex-col gap-space-md min-w-0">
          <MonitoredPortionsWidget />
          <MemberRecentActivityWidget />
          <div class="bg-surface-container-lowest rounded-DEFAULT p-space-md border border-surface-variant/30 flex items-start gap-space-sm shadow-sm">
            <span class="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5">tips_and_updates</span>
            <div class="flex flex-col gap-1">
              <span class="font-label-md text-label-md text-on-surface font-semibold">Tips Harmonis Keluarga</span>
              <p class="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Catat segera setelah bertransaksi agar admin dapat merekonsiliasi pos anggaran bulanan tanpa selisih.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
