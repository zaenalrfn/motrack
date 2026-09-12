import { supabase } from './supabaseClient'

export type MemberRole = 'member' | 'admin'

export interface ActiveMember {
  id: string
  household_id: string
  user_id: string
  name: string
  role: MemberRole
  status: 'active'
  created_at: string
  email: string | null
}

export interface CreatedMember {
  id: string
  name: string
  email: string
  role: MemberRole
  status: 'active'
}

export interface CreateMemberAccountInput {
  householdId: string
  name: string
  email: string
  role: MemberRole
}

export interface CreateMemberAccountResult {
  member: CreatedMember
  magicLink: string
}

export async function getActiveMembers(householdId: string): Promise<ActiveMember[]> {
  const { data, error } = await supabase
    .from('active_household_members')
    .select('id, household_id, user_id, name, role, status, created_at, email')
    .eq('household_id', householdId)
    .eq('status', 'active')
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data ?? []) as ActiveMember[]
}

export async function createMemberAccount(
  input: CreateMemberAccountInput,
): Promise<CreateMemberAccountResult> {
  const { data, error } = await supabase.functions.invoke<CreateMemberAccountResult>(
    'create-member-magic-link',
    { body: input },
  )

  if (error) {
    if (error.message.toLowerCase().includes('failed to send a request')) {
      throw new Error(
        'Edge Function create-member-magic-link belum ter-deploy ke project Supabase ini. Deploy function terlebih dahulu.',
      )
    }

    const details =
      'context' in error && error.context instanceof Response
        ? ` (${error.context.status} ${error.context.statusText})`
        : ''

    if (details.includes('(404')) {
      throw new Error(
        'Edge Function create-member-magic-link tidak ditemukan (404). Pastikan function sudah di-deploy ke project Supabase yang sama dengan VITE_SUPABASE_URL.',
      )
    }

    throw new Error(`${error.message}${details}`)
  }
  if (!data?.member || !data.magicLink) {
    throw new Error('Respons pembuatan akun anggota tidak lengkap.')
  }

  return data
}
