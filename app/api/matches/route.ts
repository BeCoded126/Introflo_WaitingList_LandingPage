import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const page = Math.max(1, Number(url.searchParams.get('page') || '1'))
  const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get('per_page') || '10')))
  const orgId = url.searchParams.get('orgId') || undefined
  const facilityId = url.searchParams.get('facilityId') || undefined

  let query = supabase.from('matches').select('*')
    .order('score', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (orgId) query = query.eq('org_id', orgId)
  if (facilityId) query = query.or(`facility_a_id.eq.${facilityId},facility_b_id.eq.${facilityId}`)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ matches: data || [] })
}
