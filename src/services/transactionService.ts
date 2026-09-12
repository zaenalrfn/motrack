import { supabase } from './supabaseClient'

export type TransactionType = 'expense' | 'income'

export interface Transaction {
  id: string
  household_id: string
  category_id: string | null
  amount: number
  type: TransactionType
  date: string
  note: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  category: {
    id: string
    name: string
    icon: string | null
    icon_bg: string | null
    icon_color: string | null
  } | null
  member: {
    id: string
    name: string
    role: 'admin' | 'member'
    status: string
  } | null
}

export interface CreateTransactionInput {
  householdId: string
  memberId: string
  categoryId: string
  amount: number
  type: TransactionType
  date: string
  note: string
}

export interface TransactionFilters {
  month?: string
  categoryId?: string
  memberId?: string
  type?: TransactionType | ''
}

const toNumber = (value: number | string) => Number(value)

const monthRange = (month: string) => {
  const [year, monthNumber] = month.split('-').map(Number)
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1)).toISOString().slice(0, 10)
  return { start: `${month}-01`, nextMonth }
}

export async function getTransactions(
  householdId: string,
  filters: TransactionFilters = {},
): Promise<Transaction[]> {
  let query = supabase
    .from('transactions')
    .select(`
      id,
      household_id,
      category_id,
      amount,
      type,
      date,
      note,
      created_by,
      created_at,
      updated_at,
      category:categories(id, name, icon, icon_bg, icon_color),
      member:members(id, name, role, status)
    `)
    .eq('household_id', householdId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.month) {
    const range = monthRange(filters.month)
    query = query.gte('date', range.start).lt('date', range.nextMonth)
  }
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
  if (filters.memberId) query = query.eq('created_by', filters.memberId)
  if (filters.type) query = query.eq('type', filters.type)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((item) => ({
    ...item,
    amount: toNumber(item.amount),
  })) as unknown as Transaction[]
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      household_id: input.householdId,
      category_id: input.categoryId,
      amount: input.amount,
      type: input.type,
      date: input.date,
      note: input.note || null,
      created_by: input.memberId,
    })
    .select(`
      id,
      household_id,
      category_id,
      amount,
      type,
      date,
      note,
      created_by,
      created_at,
      updated_at,
      category:categories(id, name, icon, icon_bg, icon_color),
      member:members(id, name, role, status)
    `)
    .single()

  if (error) throw error
  return { ...data, amount: toNumber(data.amount) } as unknown as Transaction
}

export async function updateTransaction(id: string, input: Omit<CreateTransactionInput, 'householdId' | 'memberId'>): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .update({
      category_id: input.categoryId,
      amount: input.amount,
      type: input.type,
      date: input.date,
      note: input.note || null,
    })
    .eq('id', id)

  if (error) throw error
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}
