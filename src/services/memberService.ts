import { supabase } from './supabaseClient'

export type MemberRole = 'member' | 'admin'

export interface ActiveMember {
  id: string
  household_id: string
  user_id: string
  name: string
  role: MemberRole
  status: 'active' | 'removed'
  created_at: string
  updated_at?: string
  email: string | null
  has_password?: boolean
  transaction_count?: number
}

export interface CreatedMember {
  id: string
  name: string
  email: string
  role: MemberRole
  status: 'active' | 'removed'
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

export interface RegenerateMemberMagicLinkResult {
  member: CreatedMember
  magicLink: string
}

const MEMBER_CACHE_TTL_MS = 60_000
const memberCache = new Map<string, { data: ActiveMember[]; loadedAt: number }>()
const memberRequests = new Map<string, Promise<ActiveMember[]>>()

export async function getActiveMembers(householdId: string, force = false): Promise<ActiveMember[]> {
  const cached = memberCache.get(householdId)
  if (!force && cached && Date.now() - cached.loadedAt < MEMBER_CACHE_TTL_MS) return cached.data
  const pending = memberRequests.get(householdId)
  if (pending) return pending

  const request = Promise.resolve(supabase
    .from('active_household_members')
    .select('id, household_id, user_id, name, role, status, created_at, email, has_password')
    .eq('household_id', householdId)
    .eq('status', 'active')
    .order('created_at', { ascending: true }))
    .then(({ data, error }) => {
      if (error) throw error
      const result = (data ?? []) as ActiveMember[]
      memberCache.set(householdId, { data: result, loadedAt: Date.now() })
      return result
    })
    .finally(() => memberRequests.delete(householdId))

  memberRequests.set(householdId, request)
  return request
}

export function invalidateActiveMembersCache(householdId?: string) {
  if (householdId) memberCache.delete(householdId)
  else memberCache.clear()
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

export async function deleteHouseholdMember(memberId: string, mode: 'soft' | 'permanent'): Promise<void> {
  const { error } = await supabase.rpc('delete_household_member', {
    p_member_id: memberId,
    p_mode: mode,
  })
  if (error) throw error
}

export async function getRemovedMembers(householdId: string): Promise<ActiveMember[]> {
  const { data, error } = await supabase
    .from('members')
    .select('id, household_id, user_id, name, role, status, created_at')
    .eq('household_id', householdId)
    .eq('status', 'removed')
    .order('created_at', { ascending: false })

  if (error) throw error

  const members = (data ?? []) as ActiveMember[]

  const withCounts = await Promise.all(members.map(async (member) => {
    const { count, error: countError } = await supabase
      .from('transactions')
      .select('id', { count: 'exact', head: true })
      .eq('household_id', householdId)
      .eq('created_by', member.id)
    if (countError) throw countError
    return { ...member, email: null, transaction_count: count ?? 0 }
  }))

  return withCounts
}

export async function restoreHouseholdMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .update({ status: 'active' })
    .eq('id', memberId)
    .eq('status', 'removed')
  if (error) throw error
}


export async function regenerateMemberMagicLink(input: {
  householdId: string
  memberId: string
}): Promise<RegenerateMemberMagicLinkResult> {
  const { data, error } = await supabase.functions.invoke<RegenerateMemberMagicLinkResult>(
    'regenerate-member-magic-link',
    { body: input },
  )

  if (error) {
    const details = 'context' in error && error.context instanceof Response
      ? ` (${error.context.status} ${error.context.statusText})`
      : ''
    throw new Error(`${error.message}${details}`)
  }
  if (!data?.member || !data.magicLink) throw new Error('Respons generate ulang magic link tidak lengkap.')
  return data
}
