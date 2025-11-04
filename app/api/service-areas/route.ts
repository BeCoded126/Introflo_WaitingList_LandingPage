import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  )

  const url = new URL(request.url)
  const facilityId = url.searchParams.get('facilityId')

  if (!facilityId) {
    return NextResponse.json({ error: 'facilityId query param required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('service_areas')
    .select('*')
    .eq('facility_id', facilityId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ areas: data || [] })
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Basic RBAC: only ADMIN or OWNER can modify service areas
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (user && !['ADMIN', 'OWNER'].includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const { facilityId, areas } = body || {}

  if (!facilityId || !Array.isArray(areas)) {
    return NextResponse.json({ error: 'facilityId and areas are required' }, { status: 400 })
  }

  // Replace existing areas for the facility with the provided areas
  const { error: delError } = await supabase
    .from('service_areas')
    .delete()
    .eq('facility_id', facilityId)

  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 })
  }

  const toInsert = areas.map((a: any) => ({
    id: a.id ?? undefined,
    facility_id: facilityId,
    lat: a.lat,
    lng: a.lng,
    radius_miles: a.radiusMiles,
    city: a.city ?? null,
    state: a.state ?? null,
  }))

  const { data: inserted, error: insertError } = await supabase
    .from('service_areas')
    .insert(toInsert)

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

  return NextResponse.json({ areas: inserted })
}
