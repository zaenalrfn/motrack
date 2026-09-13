<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { supabase } from '../services/supabaseClient'
import { useAuthStore } from '../stores/useAuthStore'
import MainLayout from "../components/layout/MainLayout.vue";
import HouseholdCapacityWidget from "../components/hak-akses/HouseholdCapacityWidget.vue";
import SystemLogNotification from "../components/hak-akses/SystemLogNotification.vue";
import ActiveMembersTable from "../components/hak-akses/ActiveMembersTable.vue";
import InactiveMembersSection from "../components/hak-akses/InactiveMembersSection.vue";
import { invalidateActiveMembersCache } from '../services/memberService'
import type { RealtimeChannel } from '@supabase/supabase-js'

const authStore = useAuthStore()
const capacityWidget = ref<InstanceType<typeof HouseholdCapacityWidget> | null>(null)
const membersTable = ref<InstanceType<typeof ActiveMembersTable> | null>(null)
const inactiveSection = ref<InstanceType<typeof InactiveMembersSection> | null>(null)

let channel: RealtimeChannel | null = null

const refreshMemberData = () => {
  invalidateActiveMembersCache(authStore.household?.id)
  void capacityWidget.value?.refreshMembers(true)
  void membersTable.value?.refresh()
  void inactiveSection.value?.refresh()
}

const subscribeMembers = () => {
  if (channel) supabase.removeChannel(channel)
  const householdId = authStore.household?.id
  if (!householdId) return
  channel = supabase
    .channel(`members-${householdId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: `household_id=eq.${householdId}` }, () => {
      refreshMemberData()
    })
    .subscribe()
}

onMounted(() => {
  subscribeMembers()
})

watch(() => authStore.household?.id, () => {
  subscribeMembers()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})
</script>

<template>
  <MainLayout>
    <div class="w-full px-margin-desktop py-space-xl space-y-space-2xl">
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-space-md"
      >
        <div class="space-y-space-2xs">
          <div
            class="inline-flex items-center gap-space-xs px-space-md py-space-2xs rounded-full bg-primary-fixed text-on-primary-fixed-variant"
          >
            <span class="material-symbols-outlined text-[16px]"
              >diversity_3</span
            >
            <span class="font-label-sm tracking-wider uppercase"
              >Pengaturan Akses & Hak Suara</span
            >
          </div>
          <h1 class="font-headline-lg text-headline-lg text-on-surface">
            Manajemen Anggota & Kuota
          </h1>
          <p
            class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl"
          >
            Kelola partisipasi seluruh keluarga dalam pencatatan kas rumah
            tangga dengan transparansi penuh, perlindungan riwayat transaksi,
            dan privasi terpadu.
          </p>
        </div>
      </div>

      <HouseholdCapacityWidget ref="capacityWidget" @member-added="refreshMemberData" />
      <SystemLogNotification />
      <ActiveMembersTable ref="membersTable" @member-deleted="refreshMemberData" />
      <InactiveMembersSection ref="inactiveSection" @member-restored="refreshMemberData" />
    </div>
  </MainLayout>
</template>
