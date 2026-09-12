<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  isOpen: boolean
  title: string
  message: string
  detail?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  error?: string
}>(), {
  detail: '',
  confirmLabel: 'Hapus',
  cancelLabel: 'Batal',
  loading: false,
  error: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'confirm'): void
}>()

const titleId = computed(() => `confirmation-title-${props.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)
const descriptionId = computed(() => `${titleId.value}-description`)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !props.loading) emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/40 backdrop-blur-md p-space-md"
    role="presentation"
    @click.self="!loading && emit('close')"
  >
    <section
      class="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-surface-container shadow-2xl p-space-xl space-y-space-lg"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
    >
      <div class="flex items-start gap-space-md">
        <div class="w-12 h-12 shrink-0 rounded-full bg-error-container text-error flex items-center justify-center">
          <span class="material-symbols-outlined text-[25px]">warning</span>
        </div>
        <div class="min-w-0 flex-1">
          <h2 :id="titleId" class="font-headline-sm text-headline-sm font-bold text-on-surface">
            {{ title }}
          </h2>
          <p :id="descriptionId" class="font-body-md text-on-surface-variant mt-space-xs leading-relaxed">
            {{ message }}
          </p>
        </div>
        <button
          type="button"
          :disabled="loading"
          aria-label="Tutup dialog"
          @click="emit('close')"
          class="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div v-if="detail" class="flex items-start gap-space-sm rounded-2xl bg-tertiary-fixed/40 border border-tertiary-fixed px-space-md py-space-sm text-on-tertiary-fixed-variant">
        <span class="material-symbols-outlined text-[19px] mt-0.5">info</span>
        <p class="font-body-sm leading-relaxed">{{ detail }}</p>
      </div>

      <div v-if="error" class="rounded-2xl bg-error-container px-space-md py-space-sm text-on-error-container font-body-sm leading-relaxed">
        {{ error }}
      </div>

      <div class="flex flex-col-reverse sm:flex-row justify-end gap-space-sm border-t border-surface-container pt-space-md">
        <button
          type="button"
          :disabled="loading"
          @click="emit('close')"
          class="px-space-lg py-space-sm rounded-full font-label-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
        >
          {{ cancelLabel }}
        </button>
        <button
          type="button"
          :disabled="loading"
          @click="emit('confirm')"
          class="flex items-center justify-center gap-space-xs px-space-lg py-space-sm rounded-full bg-error text-on-error hover:bg-error/90 font-label-lg shadow-sm transition-colors disabled:opacity-50"
        >
          <span v-if="loading" class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
          <span v-else class="material-symbols-outlined text-[18px]">delete</span>
          {{ loading ? 'Menghapus...' : confirmLabel }}
        </button>
      </div>
    </section>
  </div>
</template>
