import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../services/supabaseClient'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const household = ref<any | null>(null)
  const currentMember = ref<any | null>(null)
  const loading = ref(false)

  const initAuth = async () => {
    loading.value = true
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user || null
    if (user.value) {
      await fetchHouseholdAndMember()
    }
    supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user || null
      if (user.value) {
        await fetchHouseholdAndMember()
      } else {
        household.value = null
        currentMember.value = null
      }
    })
    loading.value = false
  }

  const fetchHouseholdAndMember = async () => {
    if (!user.value) return
    try {
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*, households(*)')
        .eq('user_id', user.value.id)
        .eq('status', 'active')
        .single()

      if (memberError) throw memberError
      if (memberData) {
        currentMember.value = memberData
        household.value = memberData.households
      }
    } catch (err) {
      console.error('Error fetching household/member:', err)
    }
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    await fetchHouseholdAndMember()
    return data
  }

  const registerAdmin = async (adminName: string, householdName: string, email: string, password: string) => {
    // 1. Sign up auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: adminName }
      }
    })
    if (authError) throw authError
    if (!authData.user) throw new Error('Gagal membuat akun auth.')

    // 2. Call secure RPC in database to create household and admin member
    const { error: rpcError } = await supabase.rpc('register_new_household_admin', {
      p_household_name: householdName,
      p_admin_name: adminName
    })

    if (rpcError) throw rpcError

    user.value = authData.user
    await fetchHouseholdAndMember()
    return authData
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    household.value = null
    currentMember.value = null
  }

  return {
    user,
    household,
    currentMember,
    loading,
    initAuth,
    login,
    registerAdmin,
    logout,
    fetchHouseholdAndMember
  }
})
