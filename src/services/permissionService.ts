import { supabase } from './supabaseClient'

export interface CategoryGrant {
  id: string
  member_id: string
  category_id: string
  created_at: string
}

export async function getCategoryGrants(householdId: string): Promise<CategoryGrant[]> {
  const { data, error } = await supabase
    .from('budget_visibility_grants')
    .select('id, member_id, category_id, created_at, members!inner(household_id)')
    .eq('members.household_id', householdId)

  if (error) throw error
  return (data ?? []) as CategoryGrant[]
}

export async function grantCategoryAccess(memberId: string, categoryId: string): Promise<CategoryGrant> {
  const { data, error } = await supabase
    .from('budget_visibility_grants')
    .insert({ member_id: memberId, category_id: categoryId })
    .select('id, member_id, category_id, created_at')
    .single()

  if (error) throw error
  return data as CategoryGrant
}

export async function revokeCategoryAccess(memberId: string, categoryId: string): Promise<void> {
  const { error } = await supabase
    .from('budget_visibility_grants')
    .delete()
    .eq('member_id', memberId)
    .eq('category_id', categoryId)

  if (error) throw error
}
