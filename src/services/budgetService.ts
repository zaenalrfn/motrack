import { supabase } from './supabaseClient'

export type BudgetCategoryType = 'expense' | 'income'

export interface BudgetCategory {
  id: string
  household_id: string
  name: string
  description: string | null
  type: BudgetCategoryType
  icon: string | null
  icon_bg: string | null
  icon_color: string | null
  is_custom: boolean
}

export interface CategoryBudget {
  id: string
  category_id: string
  month: string
  amount: number
  spent: number
}

export interface CategoryInput {
  householdId: string
  name: string
  description: string
  type: BudgetCategoryType
  icon: string
}

export interface BudgetInput {
  categoryId: string
  month: string
  amount: number
}

interface TransactionAmount {
  category_id: string | null
  amount: number | string
  type: 'expense' | 'income'
  date: string
}

const defaultIconStyles: Record<BudgetCategoryType, { bg: string; color: string }> = {
  expense: { bg: 'bg-surface-container', color: 'text-secondary' },
  income: { bg: 'bg-success-container', color: 'text-success' },
}

const toNumber = (value: number | string | null | undefined) => Number(value ?? 0)

export async function getCategories(householdId: string): Promise<BudgetCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, household_id, name, description, type, icon, icon_bg, icon_color, is_custom')
    .eq('household_id', householdId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as BudgetCategory[]
}

export async function createCategory(input: CategoryInput): Promise<BudgetCategory> {
  const styles = defaultIconStyles[input.type]
  const { data, error } = await supabase.rpc('create_category_for_current_household', {
    p_name: input.name,
    p_description: input.description || '',
    p_type: input.type,
    p_icon: input.icon,
    p_icon_bg: styles.bg,
    p_icon_color: styles.color,
  })

  if (error) throw error
  return data as BudgetCategory
}

export async function updateCategory(
  id: string,
  input: Omit<CategoryInput, 'householdId'>,
): Promise<BudgetCategory> {
  const styles = defaultIconStyles[input.type]
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      description: input.description || null,
      type: input.type,
      icon: input.icon,
      icon_bg: styles.bg,
      icon_color: styles.color,
    })
    .eq('id', id)
    .select('id, household_id, name, description, type, icon, icon_bg, icon_color, is_custom')
    .single()

  if (error) throw error
  return data as BudgetCategory
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

export async function getBudgets(
  householdId: string,
  month: string,
): Promise<CategoryBudget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select('id, category_id, month, amount, categories!inner(household_id)')
    .eq('categories.household_id', householdId)
    .eq('month', month)
    .order('created_at', { ascending: true })

  if (error) throw error

  const budgets = (data ?? []) as Array<{
    id: string
    category_id: string
    month: string
    amount: number | string
  }>

  return budgets.map((budget) => ({
    id: budget.id,
    category_id: budget.category_id,
    month: budget.month,
    amount: toNumber(budget.amount),
    spent: 0,
  }))
}

export async function getSpentByCategory(
  householdId: string,
  month: string,
): Promise<Record<string, number>> {
  const startDate = `${month}-01`
  const [year, monthNumber] = month.split('-').map(Number)
  const nextMonthDate = new Date(Date.UTC(year, monthNumber, 1))
  const nextMonth = nextMonthDate.toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('transactions')
    .select('category_id, amount, type, date')
    .eq('household_id', householdId)
    .eq('type', 'expense')
    .gte('date', startDate)
    .lt('date', nextMonth)

  if (error) throw error

  return (data as TransactionAmount[] | null ?? []).reduce<Record<string, number>>(
    (totals, transaction) => {
      if (transaction.category_id) {
        totals[transaction.category_id] =
          (totals[transaction.category_id] ?? 0) + toNumber(transaction.amount)
      }
      return totals
    },
    {},
  )
}

export async function createBudget(input: BudgetInput): Promise<void> {
  const { error } = await supabase.from('budgets').insert({
    category_id: input.categoryId,
    month: input.month,
    amount: input.amount,
  })

  if (error) throw error
}

export async function updateBudget(id: string, amount: number): Promise<void> {
  const { error } = await supabase
    .from('budgets')
    .update({ amount })
    .eq('id', id)

  if (error) throw error
}

export async function deleteBudget(id: string): Promise<void> {
  const { error } = await supabase.from('budgets').delete().eq('id', id)
  if (error) throw error
}
