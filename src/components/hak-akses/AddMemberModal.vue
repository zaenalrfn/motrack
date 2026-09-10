<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['member-added'])

const showModal = ref(false)
const showCredModal = ref(false)

const form = ref({
  name: '',
  email: '',
  role: 'member',
  category: 'Makanan & Groceries'
})

const generatedCred = ref({
  email: '',
  password: '',
  link: ''
})

const handleCreate = () => {
  const tempPass = 'Fam#' + Math.floor(1000 + Math.random() * 9000)
  const token = Math.random().toString(36).substring(2, 10)
  const baseUrl = window.location.origin

  generatedCred.value = {
    email: form.value.email || 'anggota@keluargatrack.id',
    password: tempPass,
    link: `${baseUrl}/auth/welcome?token=${token}&email=${encodeURIComponent(form.value.email)}&pwd=${encodeURIComponent(tempPass)}`
  }

  showModal.value = false
  showCredModal.value = true
  emit('member-added', { ...form.value, ...generatedCred.value })
}

const copyCreds = () => {
  const text = `Akun KeluargaTrack Anda telah dibuat!\nEmail: ${generatedCred.value.email}\nPassword Sementara: ${generatedCred.value.password}\nLogin via Link: ${generatedCred.value.link}`
  navigator.clipboard.writeText(text)
  alert('Kredensial berhasil disalin!')
}
</script>

<template>
  <div>
    <button @click="showModal = true" class="flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-lg py-space-sm rounded-full font-label-lg transition-transform active:scale-95 shadow-sm">
      <span class="material-symbols-outlined text-[20px]">person_add</span>
      <span>Buat Akun Anggota Baru</span>
    </button>

    <!-- Modal Form Buat Akun -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-surface/40 backdrop-blur-md">
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-xl shadow-2xl space-y-space-md border border-surface-container">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs text-primary">
            <span class="material-symbols-outlined text-[24px]">person_add</span>
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Buat Akun Anggota Baru</h3>
          </div>
          <button @click="showModal = false" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <p class="font-body-sm text-on-surface-variant">Admin membuatkan akun langsung. Sistem akan men-generate kredensial login & magic link otomatis.</p>

        <div class="space-y-space-sm">
          <div>
            <label class="font-label-sm text-on-surface-variant font-medium">Nama Lengkap</label>
            <input v-model="form.name" type="text" placeholder="Contoh: Siska Melati" class="w-full bg-surface-container-low px-space-md py-space-xs rounded-lg mt-1 border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant font-medium">Email Anggota</label>
            <input v-model="form.email" type="email" placeholder="siska@mail.com" class="w-full bg-surface-container-low px-space-md py-space-xs rounded-lg mt-1 border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary">
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant font-medium">Peran / Role</label>
            <select v-model="form.role" class="w-full bg-surface-container-low px-space-md py-space-xs rounded-lg mt-1 border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="member">Member Biasa</option>
              <option value="admin">Admin Tambahan</option>
            </select>
          </div>
          <div>
            <label class="font-label-sm text-on-surface-variant font-medium">Akses Pos Anggaran</label>
            <select v-model="form.category" class="w-full bg-surface-container-low px-space-md py-space-xs rounded-lg mt-1 border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="Makanan & Groceries">Makanan & Groceries</option>
              <option value="Transportasi & Bensin">Transportasi & Bensin</option>
              <option value="Tagihan & Listrik">Tagihan & Listrik</option>
              <option value="Pendidikan Anak">Pendidikan Anak</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-sm pt-space-md border-t border-surface-container">
          <button @click="showModal = false" class="px-space-md py-space-xs rounded-full font-label-md text-on-surface-variant hover:bg-surface-container">Batal</button>
          <button @click="handleCreate" class="bg-primary text-on-primary px-space-lg py-space-xs rounded-full font-label-md hover:bg-primary-container shadow-sm">Buat Akun & Generate Link</button>
        </div>
      </div>
    </div>

    <!-- Modal Success & Credential Preview -->
    <div v-if="showCredModal" class="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-on-surface/40 backdrop-blur-md">
      <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl p-space-xl shadow-2xl space-y-space-md border border-surface-container">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-space-xs text-secondary">
            <span class="material-symbols-outlined text-[24px]">check_circle</span>
            <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface">Akun Berhasil Dibuat!</h3>
          </div>
          <button @click="showCredModal = false" class="text-on-surface-variant hover:text-on-surface">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <p class="font-body-sm text-on-surface-variant">Bagikan magic link atau kredensial berikut kepada anggota keluarga agar dapat langsung mengakses dashboard:</p>

        <div class="bg-surface-container-low p-space-md rounded-xl space-y-2 border border-surface-container">
          <div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Email:</span> <strong class="text-on-surface font-mono">{{ generatedCred.email }}</strong></div>
          <div class="flex justify-between text-body-sm"><span class="text-on-surface-variant">Password Sementara:</span> <strong class="text-primary font-mono">{{ generatedCred.password }}</strong></div>
          <div class="pt-2 border-t border-surface-container">
            <span class="text-on-surface-variant text-xs block mb-1">Magic Link Login:</span>
            <input type="text" readonly :value="generatedCred.link" class="w-full bg-surface-container-lowest text-xs p-2 rounded border border-surface-container font-mono text-on-surface select-all">
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-sm pt-space-md border-t border-surface-container">
          <button @click="copyCreds" class="flex items-center gap-1 px-space-lg py-space-xs rounded-full bg-secondary text-on-secondary font-label-md shadow-sm">
            <span class="material-symbols-outlined text-[16px]">content_copy</span> Salin Kredensial & Link
          </button>
          <button @click="showCredModal = false" class="px-space-md py-space-xs rounded-full font-label-md bg-surface-container hover:bg-surface-container-high text-on-surface">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>
