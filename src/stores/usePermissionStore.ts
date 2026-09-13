import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './useAuthStore'
import { getActiveMembers, type ActiveMember } from '../services/memberService'
import { getCategories, type BudgetCategory } from '../services/budgetService'
import {
  getCategoryGrants,
  grantCategoryAccess,
  revokeCategoryAccess,
  type CategoryGrant,
} from '../services/permissionService'

export const usePermissionStore = defineStore('permission', () => {
  const authStore = useAuthStore()
  const members = ref<ActiveMember[]>([])
  const categories = ref<BudgetCategory[]>([])
  const grants = ref<CategoryGrant[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')
  const CACHE_TTL_MS = 60_000
  let lastLoadedAt = 0
  let loadingRequest: Promise<void> | null = null

  const householdId = computed(() => authStore.household?.id as string | undefined)

  const loadMatrix = async (force = false) => {
    if (!householdId.value) {
      members.value = []
      categories.value = []
      grants.value = []
      return
    }

    const isFresh = lastLoadedAt > 0 && Date.now() - lastLoadedAt < CACHE_TTL_MS && members.value.length > 0
    if (!force && isFresh) return
    if (loadingRequest) return loadingRequest

    loading.value = true
    error.value = ''
    const currentHouseholdId = householdId.value
    loadingRequest = Promise.all([
        getActiveMembers(currentHouseholdId),
      getCategories(currentHouseholdId),
      getCategoryGrants(currentHouseholdId),
    ]).then(([loadedMembers, loadedCategories, loadedGrants]) => {
      if (householdId.value !== currentHouseholdId) return
      members.value = loadedMembers
      categories.value = loadedCategories
      grants.value = loadedGrants
      lastLoadedAt = Date.now()
    }).catch((caught) => {
      const details = caught as { code?: string; message?: string; hint?: string }
      error.value = [details.code, details.message, details.hint].filter(Boolean).join(' — ') || 'Gagal memuat matriks hak akses.'
      throw caught
    }).finally(() => {
      loading.value = false
      loadingRequest = null
    })

    return loadingRequest
  }

  const hasAccess = (memberId: string, categoryId: string) => {
    const member = members.value.find((item) => item.id === memberId)
    if (member?.role === 'admin') return true
    return grants.value.some((grant) => grant.member_id === memberId && grant.category_id === categoryId)
  }

  const toggleAccess = async (memberId: string, categoryId: string) => {
    const nextValue = !hasAccess(memberId, categoryId)
    saving.value = true
    error.value = ''
    try {
      if (nextValue) {
        const grant = await grantCategoryAccess(memberId, categoryId)
        grants.value.push(grant)
        lastLoadedAt = Date.now()
      } else {
        await revokeCategoryAccess(memberId, categoryId)
        grants.value = grants.value.filter((grant) => !(grant.member_id === memberId && grant.category_id === categoryId))
        lastLoadedAt = Date.now()
      }
    } catch (caught) {
      const details = caught as { code?: string; message?: string; hint?: string }
      error.value = [details.code, details.message, details.hint].filter(Boolean).join(' — ') || 'Gagal memperbarui akses kategori.'
      throw caught
    } finally {
      saving.value = false
    }
  }

  const grantMultipleAccess = async (memberIds: string[], categoryIds: string[]) => {
    saving.value = true
    error.value = ''
    try {
      const promises = []
      for (const memberId of memberIds) {
        for (const categoryId of categoryIds) {
          if (!hasAccess(memberId, categoryId)) {
            promises.push(grantCategoryAccess(memberId, categoryId).then(grant => grants.value.push(grant)))
          }
        }
      }
      await Promise.all(promises)
      lastLoadedAt = Date.now()
    } catch (caught) {
      const details = caught as { code?: string; message?: string; hint?: string }
      error.value = [details.code, details.message, details.hint].filter(Boolean).join(' — ') || 'Gagal memberikan akses massal.'
      throw caught
    } finally {
      saving.value = false
    }
  }

  return {
    members,
    categories,
    grants,
    loading,
    saving,
    error,
    householdId,
    loadMatrix,
    hasAccess,
    toggleAccess,
    grantMultipleAccess,
  }
})
