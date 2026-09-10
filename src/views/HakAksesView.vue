<script setup lang="ts">
import { ref } from "vue";
import MainLayout from "../components/layout/MainLayout.vue";
import HouseholdCapacityWidget from "../components/hak-akses/HouseholdCapacityWidget.vue";
import SystemLogNotification from "../components/hak-akses/SystemLogNotification.vue";
import ActiveMembersTable from "../components/hak-akses/ActiveMembersTable.vue";
import InactiveMembersSection from "../components/hak-akses/InactiveMembersSection.vue";

const showDeleteModal = ref(false);
const targetMember = ref<any>(null);

const openDeleteModal = (member: any) => {
  targetMember.value = member;
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  showDeleteModal.value = false;
  // Logic to show toast would go here
};
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

      <HouseholdCapacityWidget />
      <SystemLogNotification />
      <ActiveMembersTable @open-delete="openDeleteModal" />
      <InactiveMembersSection />
    </div>

    <!-- Modal Soft Delete -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 bg-inverse-surface/45 backdrop-blur-md flex items-center justify-center p-space-md"
    >
      <div
        class="bg-surface-container-lowest max-w-lg w-full rounded-lg p-space-xl shadow-xl space-y-space-lg"
      >
        <div class="flex items-center gap-space-md">
          <div
            class="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center"
          >
            <span class="material-symbols-outlined text-[24px]"
              >person_remove</span
            >
          </div>
          <div class="space-y-0.5">
            <h3 class="font-headline-sm text-headline-sm text-on-surface">
              Hapus Akses Anggota?
            </h3>
            <p
              class="font-label-sm text-on-surface-variant uppercase tracking-wider"
            >
              Konfirmasi Pencabutan Akses
            </p>
          </div>
        </div>
        <div
          class="bg-surface-container-low rounded-DEFAULT p-space-md space-y-space-xs"
        >
          <div class="flex items-center justify-between">
            <span class="font-title-md text-on-surface font-semibold">{{
              targetMember?.name
            }}</span>
            <span
              class="px-space-xs py-0.5 rounded-full bg-surface-container font-label-sm text-on-surface-variant"
              >{{ targetMember?.sub }}</span
            >
          </div>
          <p class="font-body-sm text-on-surface-variant">
            {{ targetMember?.email }}
          </p>
          <div
            class="pt-space-xs flex items-center gap-1.5 text-secondary font-label-sm font-semibold"
          >
            <span class="material-symbols-outlined text-[16px]">shield</span>
            <span
              >{{ targetMember?.txCount }} Transaksi Lama Tetap Tersimpan
              Utuh</span
            >
          </div>
        </div>
        <p class="font-body-md text-on-surface-variant">
          Akun yang dihapus tidak akan bisa login lagi ke dalam household ini.
          Namun, seluruh catatan pengeluaran, pemasukan, dan log historis di
          ledger keluarga tetap aman.
        </p>
        <div class="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            @click="showDeleteModal = false"
            class="px-space-lg py-space-sm rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg transition-colors"
          >
            Batal
          </button>
          <button
            @click="confirmDelete"
            class="px-space-lg py-space-sm rounded-full bg-error text-on-error hover:bg-error/90 font-label-lg transition-transform active:scale-95 shadow-sm"
          >
            Cabut Akses Sekarang
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
