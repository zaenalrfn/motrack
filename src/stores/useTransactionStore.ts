import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './useAuthStore'
import { getCategories, type BudgetCategory } from '../services/budgetService'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  type CreateTransactionInput,
  type Transaction,
  type TransactionFilters,
} from '../services/transactionService'

export const useTransactionStore = defineStore('transaction', () => {
  const authStore = useAuthStore()
  const transactions = ref<Transaction[]>([])
  const categories = ref<BudgetCategory[]>([])
  const filters = ref<TransactionFilters>({ month: new Date().toISOString().slice(0, 7), type: '' })
  const loading = ref(false)
  const saving = ref(false)
  const error = ref('')

  const householdId = computed(() => authStore.household?.id as string | undefined)
  const memberId = computed(() => authStore.currentMember?.id as string | undefined)
  let categoriesRequest: Promise<void> | null = null

  const syncCategories = async () => {
    if (!householdId.value) {
      categories.value = []
      return
    }

    if (categoriesRequest) return categoriesRequest

    const currentHouseholdId = householdId.value
    categoriesRequest = getCategories(currentHouseholdId)
      .then((loadedCategories) => {
        if (householdId.value === currentHouseholdId) {
          categories.value = loadedCategories
        }
      })
      .finally(() => {
        categoriesRequest = null
      })

    return categoriesRequest
  }

  const refreshCategories = syncCategories

  const loadTransactions = async (nextFilters: TransactionFilters = filters.value) => {
    if (!householdId.value) return
    filters.value = { ...nextFilters }
    loading.value = true
    error.value = ''
    try {
      const loadedTransactions = await getTransactions(householdId.value, filters.value)
      transactions.value = loadedTransactions
      await syncCategories()
    } catch (caught) {
      const details = caught as { code?: string; message?: string; hint?: string }
      error.value = [details.code, details.message, details.hint].filter(Boolean).join(' — ') || 'Gagal memuat transaksi.'
    } finally {
      loading.value = false
    }
  }

  const addTransaction = async (input: Omit<CreateTransactionInput, 'householdId' | 'memberId'>) => {
    if (!householdId.value || !memberId.value) throw new Error('Session household belum siap.')
    saving.value = true
    error.value = ''
    try {
      await createTransaction({ ...input, householdId: householdId.value, memberId: memberId.value })
      await loadTransactions(filters.value)
    } catch (caught) {
      const details = caught as { code?: string; message?: string; hint?: string }
      error.value = [details.code, details.message, details.hint].filter(Boolean).join(' — ') || 'Gagal menyimpan transaksi.'
      throw caught
    } finally {
      saving.value = false
    }
  }

  const removeTransaction = async (id: string) => {
    saving.value = true
    try {
      await deleteTransaction(id)
      await loadTransactions(filters.value)
    } finally {
      saving.value = false
    }
  }

  const totalIncome = computed(() => transactions.value.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0))
  const totalExpense = computed(() => transactions.value.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0))
  const balance = computed(() => totalIncome.value - totalExpense.value)
  const categoryBreakdown = computed(() => {
    const totals = new Map<string, { category: Transaction['category']; amount: number }>()
    transactions.value.filter((item) => item.type === 'expense').forEach((item) => {
      const key = item.category_id ?? 'uncategorized'
      const existing = totals.get(key)
      totals.set(key, { category: item.category, amount: (existing?.amount ?? 0) + item.amount })
    })
    const total = totalExpense.value
    return [...totals.values()].map((item) => ({ ...item, percent: total ? Math.round(item.amount / total * 100) : 0 })).sort((a, b) => b.amount - a.amount)
  })
  const participation = computed(() => {
    const totals = new Map<string, { id: string; name: string; count: number }>()
    transactions.value.forEach((item) => {
      const key = item.created_by ?? 'unknown'
      const existing = totals.get(key)
      totals.set(key, { id: key, name: item.member?.name ?? 'Anggota tidak diketahui', count: (existing?.count ?? 0) + 1 })
    })
    return [...totals.values()].sort((a, b) => b.count - a.count)
  })

  return {
    transactions,
    categories,
    filters,
    loading,
    saving,
    error,
    householdId,
    memberId,
    syncCategories,
    refreshCategories,
    loadTransactions,
    addTransaction,
    removeTransaction,
    totalIncome,
    totalExpense,
    balance,
    categoryBreakdown,
    participation,
  }
})
