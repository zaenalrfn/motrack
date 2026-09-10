<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["open-bulk"]);

const members = ref([
  {
    name: "Budi Santoso",
    role: "Suami • Anggota",
    avatar: "B",
    avatarBg: "bg-primary-fixed text-on-primary-fixed",
    permissions: {
      makanan: true,
      transportasi: true,
      tagihan: false,
      pendidikan: true,
      hiburan: false,
    },
    count: 3,
  },
  {
    name: "Dinda Putri",
    role: "Anak Pertama • Anggota",
    avatar: "D",
    avatarBg: "bg-surface-container-high text-tertiary",
    permissions: {
      makanan: false,
      transportasi: true,
      tagihan: false,
      pendidikan: true,
      hiburan: true,
    },
    count: 3,
  },
  {
    name: "Farhan Malik",
    role: "Anak Kedua • Remaja",
    avatar: "F",
    avatarBg: "bg-secondary-container text-secondary",
    permissions: {
      makanan: false,
      transportasi: false,
      tagihan: false,
      pendidikan: true,
      hiburan: false,
    },
    count: 1,
  },
]);

const togglePerm = (
  memberIndex: number,
  key: keyof (typeof members.value)[0]["permissions"],
) => {
  const m = members.value[memberIndex];
  m.permissions[key] = !m.permissions[key];
  m.count = Object.values(m.permissions).filter(Boolean).length;
};
</script>

<template>
  <section class="flex flex-col gap-space-md">
    <div
      class="bg-surface-container-lowest p-space-xl rounded-lg shadow-sm flex flex-col gap-space-lg"
    >
      <div
        class="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md"
      >
        <div class="flex flex-col gap-space-2xs">
          <div class="flex items-center md:flex-row flex-col gap-space-xs">
            <span
              class="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm uppercase font-semibold"
              >FR-16 • Granular Visibility</span
            >
            <h2 class="font-headline-md text-headline-md text-on-surface">
              Matriks Hak Akses Granular (Granular Budget Visibility)
            </h2>
          </div>
          <p
            class="font-body-md text-body-md text-on-surface-variant max-w-3xl"
          >
            Secara default anggota non-admin tidak dapat melihat pagu total
            budget. Berikan akses granular per kategori di bawah ini untuk
            menjaga privasi finansial antar anggota.
          </p>
        </div>
        <div
          class="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full self-start"
        >
          <span class="material-symbols-outlined text-secondary text-[18px]"
            >lock_open</span
          >
          <span class="font-label-sm text-on-surface-variant"
            >Toggle checklist untuk membuka akses langsung</span
          >
        </div>
      </div>

      <!-- Mobile View: Card List (< 768px) -->
      <div class="md:hidden flex flex-col gap-4">
        <div
          v-for="(m, idx) in members"
          :key="m.name"
          class="bg-surface-container-low p-4 rounded-2xl border border-surface-container space-y-3"
        >
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                m.avatarBg,
              ]"
            >
              {{ m.avatar }}
            </div>
            <div class="flex flex-col">
              <span class="font-title-md text-on-surface font-semibold">{{
                m.name
              }}</span>
              <span class="font-body-sm text-on-surface-variant">{{
                m.role
              }}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="m.permissions.makanan"
                @change="togglePerm(idx, 'makanan')"
                class="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              Makanan
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="m.permissions.transportasi"
                @change="togglePerm(idx, 'transportasi')"
                class="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              Transport
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="m.permissions.tagihan"
                @change="togglePerm(idx, 'tagihan')"
                class="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              Tagihan
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="m.permissions.pendidikan"
                @change="togglePerm(idx, 'pendidikan')"
                class="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              Pendidikan
            </label>
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                :checked="m.permissions.hiburan"
                @change="togglePerm(idx, 'hiburan')"
                class="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              Hiburan
            </label>
          </div>
          <div class="text-right pt-2 border-t border-surface-container/60">
            <span
              :class="[
                'px-2 py-0.5 rounded-full font-label-sm text-[10px] font-semibold',
                m.count > 0
                  ? 'bg-secondary-fixed text-on-secondary-fixed-variant'
                  : 'bg-surface-container text-on-surface-variant',
              ]"
            >
              {{ m.count }} Kategori Terbuka
            </span>
          </div>
        </div>
      </div>

      <!-- Desktop/Tablet View (>= 768px) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr
              class="bg-surface-container-low text-on-surface-variant font-label-md"
            >
              <th
                class="sticky left-0 z-10 bg-surface-container-low py-space-md px-space-md rounded-l-lg"
              >
                Anggota
              </th>
              <th class="py-space-md px-space-sm text-center">Makanan</th>
              <th class="py-space-md px-space-sm text-center">Transport</th>
              <th class="py-space-md px-space-sm text-center">Tagihan</th>
              <th class="py-space-md px-space-sm text-center">Pendidikan</th>
              <th class="py-space-md px-space-sm text-center">Hiburan</th>
              <th class="py-space-md px-space-md text-right rounded-r-lg">
                Akses
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-container font-body-md">
            <tr
              v-for="(m, idx) in members"
              :key="m.name"
              class="hover:bg-surface-container-low/40"
            >
              <td
                class="sticky left-0 z-10 bg-surface-container-lowest py-space-md px-space-md"
              >
                <div class="flex items-center gap-2">
                  <div
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs',
                      m.avatarBg,
                    ]"
                  >
                    {{ m.avatar }}
                  </div>
                  <span class="font-medium truncate">{{ m.name }}</span>
                </div>
              </td>
              <td class="text-center py-4">
                <input
                  type="checkbox"
                  :checked="m.permissions.makanan"
                  @change="togglePerm(idx, 'makanan')"
                  class="w-5 h-5 rounded text-primary cursor-pointer"
                />
              </td>
              <td class="text-center py-4">
                <input
                  type="checkbox"
                  :checked="m.permissions.transportasi"
                  @change="togglePerm(idx, 'transportasi')"
                  class="w-5 h-5 rounded text-primary cursor-pointer"
                />
              </td>
              <td class="text-center py-4">
                <input
                  type="checkbox"
                  :checked="m.permissions.tagihan"
                  @change="togglePerm(idx, 'tagihan')"
                  class="w-5 h-5 rounded text-primary cursor-pointer"
                />
              </td>
              <td class="text-center py-4">
                <input
                  type="checkbox"
                  :checked="m.permissions.pendidikan"
                  @change="togglePerm(idx, 'pendidikan')"
                  class="w-5 h-5 rounded text-primary cursor-pointer"
                />
              </td>
              <td class="text-center py-4">
                <input
                  type="checkbox"
                  :checked="m.permissions.hiburan"
                  @change="togglePerm(idx, 'hiburan')"
                  class="w-5 h-5 rounded text-primary cursor-pointer"
                />
              </td>
              <td class="text-right py-4 font-semibold text-xs">
                {{ m.count }} Aktif
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer action inside matrix -->
      <div
        class="flex flex-col sm:flex-row items-center justify-between pt-space-md border-t border-surface-container text-on-surface-variant font-body-sm gap-space-sm"
      >
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-primary text-[18px]"
            >info</span
          >
          <span
            >Perubahan pada centang disimpan seketika dan langsung berlaku pada
            dashboard anggota.</span
          >
        </div>
        <button
          @click="$emit('open-bulk')"
          class="font-label-md text-primary hover:text-primary-container font-semibold"
        >
          Reset Semua Izin Default
        </button>
      </div>
    </div>
  </section>
</template>
