import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
  if (!supabaseUrl || !anonKey || !serviceRoleKey || !appUrl) return json({ error: 'Server configuration is incomplete' }, 500)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Authentication is required' }, 401)

  const accessToken = authorization.slice('Bearer '.length)
  const callerClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } })
  const adminClient = createClient(supabaseUrl, serviceRoleKey)
  const { data: callerData, error: callerError } = await callerClient.auth.getUser(accessToken)
  if (callerError || !callerData.user) return json({ error: 'Invalid session' }, 401)

  let payload: { householdId?: string; memberId?: string }
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  if (!payload.householdId || !payload.memberId) return json({ error: 'householdId and memberId are required' }, 400)

  const { data: adminMember, error: adminError } = await adminClient
    .from('members')
    .select('id')
    .eq('household_id', payload.householdId)
    .eq('user_id', callerData.user.id)
    .eq('role', 'admin')
    .eq('status', 'active')
    .maybeSingle()
  if (adminError) return json({ error: adminError.message }, 500)
  if (!adminMember) return json({ error: 'Only an active household admin can regenerate member links' }, 403)

  const { data: member, error: memberError } = await adminClient
    .from('members')
    .select('id, user_id, name, role, status')
    .eq('id', payload.memberId)
    .eq('household_id', payload.householdId)
    .eq('status', 'active')
    .maybeSingle()
  if (memberError) return json({ error: memberError.message }, 500)
  if (!member) return json({ error: 'Member tidak ditemukan pada household aktif.' }, 404)
  if (member.role === 'admin') return json({ error: 'Link aktivasi hanya tersedia untuk member non-admin.' }, 400)

  const { data: targetUser, error: userError } = await adminClient.auth.admin.getUserById(member.user_id)
  if (userError || !targetUser.user) return json({ error: userError?.message ?? 'Auth user tidak ditemukan.' }, 404)
  const passwordSetupCompleted = targetUser.user.user_metadata?.password_setup_completed === true
  if (passwordSetupCompleted) return json({ error: 'Member ini sudah menyelesaikan password.' }, 409)

  const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
    type: 'magiclink',
    email: targetUser.user.email ?? '',
    options: { redirectTo: `${appUrl.replace(/\/$/, '')}/auth/welcome` },
  })
  if (linkError || !linkData.properties?.action_link) return json({ error: linkError?.message ?? 'Unable to generate magic link' }, 500)

  return json({
    member: { id: member.id, name: member.name, email: targetUser.user.email, role: member.role, status: member.status },
    magicLink: linkData.properties.action_link,
  })
})
