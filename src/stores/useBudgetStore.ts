import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface BudgetCategory {
  id: string
  name: string
  description: string
  type: 'expense' | 'income'
  icon: string
  iconBg: string
  iconColor: string
  isCustom: boolean
}

export interface CategoryBudget {
  id: string
  categoryId: string
  month: string
  amount: number
  spent: number
}

const uid = () => 'id_' + Math.random().toString(36).substring(2, 9)

export const useBudgetStore = defineStore('budget', () => {
  const categories = ref<BudgetCategory[]>([
    { id: 'c-makanan', name: 'Makanan & Groceries', description: 'Sembako & Konsumsi Harian', type: 'expense', icon: 'shopping_cart', iconBg: 'bg-primary-fixed', iconColor: 'text-primary', isCustom: false },
    { id: 'c-transport', name: 'Transportasi & Bensin', description: 'BBM, Tol, & Parkir', type: 'expense', icon: 'local_gas_station', iconBg: 'bg-surface-container', iconColor: 'text-secondary', isCustom: false },
    { id: 'c-tagihan', name: 'Tagihan & Listrik', description: 'PLN, PDAM, & WiFi Rumah', type: 'expense', icon: 'bolt', iconBg: 'bg-error-container', iconColor: 'text-error', isCustom: false },
    { id: 'c-pendidikan', name: 'Pendidikan Anak', description: 'SPP & Perlengkapan Belajar', type: 'expense', icon: 'school', iconBg: 'bg-secondary-fixed', iconColor: 'text-secondary', isCustom: false },
    { id: 'c-hiburan', name: 'Hiburan & Rekreasi', description: 'Wisata Akhir Pekan & Kuliner', type: 'expense', icon: 'movie', iconBg: 'bg-surface-container', iconColor: 'text-tertiary', isCustom: false },
  ])

  const budgets = ref<CategoryBudget[]>([
    { id: uid(), categoryId: 'c-makanan', month: '2026-09', amount: 6000000, spent: 5200000 },
    { id: uid(), categoryId: 'c-transport', month: '2026-09', amount: 2500000, spent: 1850000 },
    { id: uid(), categoryId: 'c-tagihan', month: '2026-09', amount: 2000000, spent: 2100000 },
    { id: uid(), categoryId: 'c-pendidikan', month: '2026-09', amount: 4000000, spent: 2000000 },
    { id: uid(), categoryId: 'c-hiburan', month: '2026-09', amount: 2500000, spent: 1650000 },
  ])

  const addCategory = (payload: Omit<BudgetCategory, 'id' | 'isCustom'>) => {
    const cat: BudgetCategory = { ...payload, id: uid(), isCustom: true }
    categories.value.push(cat)
    return cat
  }

  const updateCategory = (id: string, payload: Partial<BudgetCategory>) => {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...payload }
  }

  const deleteCategory = (id: string) => {
    const used = budgets.value.some(b => b.categoryId === id)
    if (used) return false
    categories.value = categories.value.filter(c => c.id !== id)
    return true
  }

  const addBudget = (categoryId: string, month: string, amount: number) => {
    const existing = budgets.value.find(b => b.categoryId === categoryId && b.month === month)
    if (existing) {
      existing.amount = amount
      return existing
    }
    const b: CategoryBudget = { id: uid(), categoryId, month, amount, spent: 0 }
    budgets.value.push(b)
    return b
  }

  const updateBudget = (id: string, amount: number) => {
    const b = budgets.value.find(x => x.id === id)
    if (b) b.amount = amount
  }

  const deleteBudget = (id: string) => {
    budgets.value = budgets.value.filter(b => b.id !== id)
  }

  const enriched = computed(() => {
    return budgets.value.map(b => {
      const cat = categories.value.find(c => c.id === b.categoryId)
      const pct = b.amount > 0 ? Math.round((b.spent / b.amount) * 100) : 0
      return { ...b, category: cat, percent: pct, remaining: b.amount - b.spent }
    })
  })

  const totalBudget = computed(() => budgets.value.reduce((s, b) => s + b.amount, 0))
  const totalSpent = computed(() => budgets.value.reduce((s, b) => s + b.spent, 0))
  const totalRemaining = computed(() => totalBudget.value - totalSpent.value)

  return { categories, budgets, enriched, totalBudget, totalSpent, totalRemaining, addCategory, updateCategory, deleteCategory, addBudget, updateBudget, deleteBudget }
})
