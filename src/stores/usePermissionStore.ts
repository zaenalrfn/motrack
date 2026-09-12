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

  const householdId = computed(() => authStore.household?.id as string | undefined)

  const loadMatrix = async () => {
    if (!householdId.value) {
      members.value = []
      categories.value = []
      grants.value = []
      return
    }

    loading.value = true
    error.value = ''
    try {
      const [loadedMembers, loadedCategories, loadedGrants] = await Promise.all([
        getActiveMembers(householdId.value),
        getCategories(householdId.value),
        getCategoryGrants(householdId.value),
      ])
      members.value = loadedMembers
      categories.value = loadedCategories
      grants.value = loadedGrants
    } catch (caught) {
      const details = caught as { code?: string; message?: string; hint?: string }
      error.value = [details.code, details.message, details.hint].filter(Boolean).join(' — ') || 'Gagal memuat matriks hak akses.'
    } finally {
      loading.value = false
    }
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
      } else {
        await revokeCategoryAccess(memberId, categoryId)
        grants.value = grants.value.filter((grant) => !(grant.member_id === memberId && grant.category_id === categoryId))
      }
    } catch (caught) {
      const details = caught as { code?: string; message?: string; hint?: string }
      error.value = [details.code, details.message, details.hint].filter(Boolean).join(' — ') || 'Gagal memperbarui akses kategori.'
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
  }
})
