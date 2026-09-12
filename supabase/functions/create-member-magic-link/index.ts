import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

type CreateMemberRequest = {
  householdId: string
  name: string
  email: string
  role: 'member' | 'admin'
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const appUrl = Deno.env.get('APP_URL')

  if (!supabaseUrl || !anonKey || !serviceRoleKey || !appUrl) {
    return json({ error: 'Server configuration is incomplete' }, 500)
  }

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return json({ error: 'Authentication is required' }, 401)
  }

  const accessToken = authorization.slice('Bearer '.length)
  const callerClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  })
  const adminClient = createClient(supabaseUrl, serviceRoleKey)

  const { data: callerData, error: callerError } = await callerClient.auth.getUser(accessToken)
  if (callerError || !callerData.user) return json({ error: 'Invalid session' }, 401)

  let payload: CreateMemberRequest
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const email = payload.email?.trim().toLowerCase()
  const name = payload.name?.trim()
  if (!payload.householdId || !name || !email || !payload.role) {
    return json({ error: 'householdId, name, email, and role are required' }, 400)
  }
  if (!['member', 'admin'].includes(payload.role)) {
    return json({ error: 'Invalid member role' }, 400)
  }

  const { data: adminMember, error: adminMemberError } = await adminClient
    .from('members')
    .select('id, household_id')
    .eq('user_id', callerData.user.id)
    .eq('role', 'admin')
    .eq('status', 'active')
    .maybeSingle()

  if (adminMemberError) return json({ error: adminMemberError.message }, 500)
  if (!adminMember) {
    return json({ error: 'Only an active household admin can create members' }, 403)
  }

  if (adminMember.household_id !== payload.householdId) {
    return json({ error: 'Household aktif tidak sesuai dengan sesi admin.' }, 403)
  }

  const householdId = adminMember.household_id

  const { data: existingUserData, error: existingUserError } =
    await adminClient.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (existingUserError) return json({ error: existingUserError.message }, 500)

  const existingUser = existingUserData.users.find((user) => user.email?.toLowerCase() === email)
  let userId = existingUser?.id
  let createdUser = false

  if (!userId) {
    const { data: createdData, error: createError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { name },
    })
    if (createError || !createdData.user) {
      return json({ error: createError?.message ?? 'Unable to create auth user' }, 400)
    }
    userId = createdData.user.id
    createdUser = true
  }

  const { data: member, error: memberError } = await callerClient.rpc('create_member_account_record', {
    p_household_id: householdId,
    p_user_id: userId,
    p_name: name,
    p_role: payload.role,
  })

  if (memberError || !member) {
    if (createdUser) await adminClient.auth.admin.deleteUser(userId)
    return json({ error: memberError?.message ?? 'Unable to create member record' }, 400)
  }

  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${appUrl.replace(/\/$/, '')}/auth/welcome` },
  })

  if (linkError || !linkData.properties?.action_link) {
    await adminClient.from('members').delete().eq('id', member.id)
    if (createdUser) await adminClient.auth.admin.deleteUser(userId)
    return json({ error: linkError?.message ?? 'Unable to generate magic link' }, 500)
  }

  return json({
    member: {
      id: member.id,
      name: member.name,
      email,
      role: member.role,
      status: member.status,
    },
    magicLink: linkData.properties.action_link,
  })
})
