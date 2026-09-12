import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './useAuthStore'
import {
  createBudget,
  createCategory,
  deleteBudget,
  deleteCategory,
  getBudgets,
  getCategories,
  getSpentByCategory,
  updateBudget,
  updateCategory,
  type BudgetCategory,

  type CategoryBudget,
  type CategoryInput,
} from '../services/budgetService'

export type { BudgetCategory, CategoryBudget }

export const useBudgetStore = defineStore('budget', () => {
  const authStore = useAuthStore()
  const categories = ref<BudgetCategory[]>([])
  const budgets = ref<CategoryBudget[]>([])
  const selectedMonth = ref(new Date().toISOString().slice(0, 7))
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  const householdId = computed(() => authStore.household?.id as string | undefined)

  const loadBudgetData = async (month = selectedMonth.value) => {
    selectedMonth.value = month
    if (!householdId.value) {
      categories.value = []
      budgets.value = []
      return
    }

    loading.value = true
    error.value = ''
    try {
      const [loadedCategories, loadedBudgets, spentByCategory] = await Promise.all([
        getCategories(householdId.value),
        getBudgets(householdId.value, month),
        getSpentByCategory(householdId.value, month),
      ])

      categories.value = loadedCategories
      budgets.value = loadedBudgets.map((budget) => ({
        ...budget,
        spent: spentByCategory[budget.category_id] ?? 0,
      }))
    } catch (caught) {
      const details = caught as { message?: string }
      error.value = details.message ?? 'Gagal memuat data anggaran.'
    } finally {
      loading.value = false
    }
  }

  const runMutation = async (operation: () => Promise<void>) => {
    saving.value = true
    error.value = ''
    try {
      await operation()
      try {
        await loadBudgetData(selectedMonth.value)
      } catch (refreshError) {
        const details = refreshError as { message?: string }
        error.value = details.message ?? 'Data tersimpan, tetapi gagal menyegarkan tampilan.'
      }
    } catch (caught) {
      const details = caught as { code?: string; message?: string; hint?: string; details?: string }
      error.value = [details.code, details.message, details.details, details.hint]
        .filter(Boolean)
        .join(' — ') || 'Gagal menyimpan perubahan anggaran.'
      throw caught
    } finally {
      saving.value = false
    }
  }

  const addCategory = async (payload: Omit<BudgetCategory, 'id' | 'household_id' | 'is_custom'>) => {
    if (!householdId.value) throw new Error('Household aktif belum tersedia.')
    let created: BudgetCategory | undefined
    await runMutation(async () => {
      created = await createCategory({
        householdId: householdId.value as string,
        name: payload.name,
        description: payload.description ?? '',
        type: payload.type,
        icon: payload.icon ?? 'category',
      })
    })
    return created
  }

  const editCategory = async (id: string, payload: Omit<CategoryInput, 'householdId'>) => {
    await runMutation(() => updateCategory(id, payload))
  }

  const removeCategory = async (id: string) => {
    if (budgets.value.some((budget) => budget.category_id === id)) return false
    await runMutation(() => deleteCategory(id))
    return true
  }

  const addBudget = async (categoryId: string, month: string, amount: number) => {
    await runMutation(() => createBudget({ categoryId, month, amount }))
  }

  const editBudget = async (id: string, amount: number) => {
    await runMutation(() => updateBudget(id, amount))
  }

  const removeBudget = async (id: string) => {
    await runMutation(() => deleteBudget(id))
  }

  const enriched = computed(() => categories.value.map((category) => {
    const budget = budgets.value.find((item) => item.category_id === category.id)
    const amount = budget?.amount ?? 0
    const spent = budget?.spent ?? 0
    const percent = amount > 0 ? Math.round((spent / amount) * 100) : 0

    return {
      id: budget?.id ?? `category-${category.id}`,
      categoryId: category.id,
      category,
      categoryBudget: budget,
      month: selectedMonth.value,
      amount,
      spent,
      percent,
      remaining: amount - spent,
    }
  }))

  const totalBudget = computed(() => budgets.value.reduce((sum, budget) => sum + budget.amount, 0))
  const totalSpent = computed(() => budgets.value.reduce((sum, budget) => sum + budget.spent, 0))
  const totalRemaining = computed(() => totalBudget.value - totalSpent.value)

  return {
    categories,
    budgets,
    householdId,
    enriched,
    selectedMonth,
    loading,
    saving,
    error,
    loadBudgetData,
    addCategory,
    editCategory,
    removeCategory,
    addBudget,
    editBudget,
    removeBudget,
    totalBudget,
    totalSpent,
    totalRemaining,
  }
})
