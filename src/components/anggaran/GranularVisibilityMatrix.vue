<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { usePermissionStore } from '../../stores/usePermissionStore'

const emit = defineEmits<{ (event: 'open-bulk'): void }>()
const store = usePermissionStore()

const memberRows = computed(() => store.members.map((member) => ({
  ...member,
  count: store.categories.filter((category) => store.hasAccess(member.id, category.id)).length,
})))

const avatarClasses = [
  'bg-primary-fixed text-on-primary-fixed',
  'bg-surface-container-high text-tertiary',
  'bg-secondary-container text-secondary',
  'bg-tertiary-fixed text-on-tertiary-fixed-variant',
]

const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
const avatarClass = (index: number) => avatarClasses[index % avatarClasses.length]

const toggle = async (memberId: string, categoryId: string) => {
  try {
    await store.toggleAccess(memberId, categoryId)
  } catch {
    // Store exposes the actionable error message in the component state.
  }
}

onMounted(() => { void store.loadMatrix() })
watch(() => store.householdId, (householdId) => {
  if (householdId) void store.loadMatrix()
})
</script>

<template>
  <section class="flex flex-col gap-space-md">
    <div class="bg-surface-container-lowest p-space-xl rounded-lg shadow-sm flex flex-col gap-space-lg">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
        <div class="flex flex-col gap-space-2xs">
          <div class="flex items-center md:flex-row flex-col gap-space-xs">
            <span class="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm uppercase font-semibold">FR-16 • Akses Kategori</span>
            <h2 class="font-headline-md text-headline-md text-on-surface">Matriks Hak Akses Kategori</h2>
          </div>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-3xl">
            Atur kategori yang dapat digunakan anggota untuk membuat transaksi. Admin selalu memiliki akses penuh.
          </p>
        </div>
        <div class="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full self-start">
          <span class="material-symbols-outlined text-secondary text-[18px]">lock_open</span>
          <span class="font-label-sm text-on-surface-variant">Perubahan disimpan langsung</span>
        </div>
      </div>

      <div v-if="store.error" class="rounded-xl bg-error-container text-on-error-container px-4 py-3 text-sm">{{ store.error }}</div>
      <div v-else-if="store.loading" class="rounded-2xl bg-surface-container-low p-space-xl text-center text-on-surface-variant">Memuat hak akses...</div>
      <div v-else-if="!store.members.length" class="rounded-2xl bg-surface-container-low p-space-xl text-center text-on-surface-variant">Belum ada anggota aktif.</div>
      <div v-else-if="!store.categories.length" class="rounded-2xl bg-surface-container-low p-space-xl text-center text-on-surface-variant">Belum ada kategori. Buat kategori terlebih dahulu.</div>
      <template v-else>
        <div class="md:hidden flex flex-col gap-4">
          <div v-for="(member, index) in memberRows" :key="member.id" class="bg-surface-container-low p-4 rounded-2xl border border-surface-container space-y-3">
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold', avatarClass(index)]">{{ initials(member.name) }}</div>
              <div class="flex flex-col min-w-0">
                <span class="font-title-md text-on-surface font-semibold truncate">{{ member.name }}</span>
                <span class="font-body-sm text-on-surface-variant">{{ member.role === 'admin' ? 'Admin • Akses penuh' : 'Anggota' }}</span>
              </div>
            </div>
            <div v-if="member.role === 'admin'" class="rounded-xl bg-primary-fixed/60 text-on-primary-fixed-variant px-3 py-2 text-sm">Akses penuh ke semua kategori</div>
            <div v-else class="grid grid-cols-2 gap-2 text-xs">
              <label v-for="category in store.categories" :key="category.id" class="flex items-center gap-2 text-on-surface">
                <input type="checkbox" :checked="store.hasAccess(member.id, category.id)" :disabled="store.saving" @change="toggle(member.id, category.id)" class="w-4 h-4 rounded text-primary accent-primary cursor-pointer disabled:opacity-50" />
                <span class="truncate">{{ category.name }}</span>
              </label>
            </div>
            <div class="text-right pt-2 border-t border-surface-container/60">
              <span class="px-2 py-0.5 rounded-full font-label-sm text-[10px] font-semibold bg-secondary-fixed text-on-secondary-fixed-variant">{{ member.role === 'admin' ? store.categories.length : member.count }} Kategori Terbuka</span>
            </div>
          </div>
        </div>

        <div class="hidden md:block overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr class="bg-surface-container-low text-on-surface-variant font-label-md">
                <th class="sticky left-0 z-10 bg-surface-container-low py-space-md px-space-md rounded-l-lg">Anggota</th>
                <th v-for="category in store.categories" :key="category.id" class="py-space-md px-space-sm text-center">{{ category.name }}</th>
                <th class="py-space-md px-space-md text-right rounded-r-lg">Akses</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container font-body-md">
              <tr v-for="(member, index) in memberRows" :key="member.id" class="hover:bg-surface-container-low/40">
                <td class="sticky left-0 z-10 bg-surface-container-lowest py-space-md px-space-md">
                  <div class="flex items-center gap-2">
                    <div :class="['w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs', avatarClass(index)]">{{ initials(member.name) }}</div>
                    <span class="font-medium truncate">{{ member.name }}</span>
                  </div>
                </td>
                <td v-for="category in store.categories" :key="category.id" class="text-center py-4">
                  <span v-if="member.role === 'admin'" class="material-symbols-outlined text-secondary text-[20px]" title="Akses penuh">check_circle</span>
                  <input v-else type="checkbox" :checked="store.hasAccess(member.id, category.id)" :disabled="store.saving" @change="toggle(member.id, category.id)" class="w-5 h-5 rounded text-primary cursor-pointer disabled:opacity-50" />
                </td>
                <td class="text-right py-4 font-semibold text-xs">{{ member.role === 'admin' ? store.categories.length : member.count }} Aktif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <div class="flex flex-col sm:flex-row items-center justify-between pt-space-md border-t border-surface-container text-on-surface-variant font-body-sm gap-space-sm">
        <div class="flex items-center gap-space-xs"><span class="material-symbols-outlined text-primary text-[18px]">info</span><span>Hak akses hanya berlaku untuk transaksi baru; histori transaksi tidak berubah.</span></div>
        <button @click="emit('open-bulk')" class="font-label-md text-primary hover:text-primary-container font-semibold">Bulk Grant Izin</button>
      </div>
    </div>
  </section>
</template>
