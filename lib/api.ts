import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production'
}

export const createClient = cache(() => {
  const cookieStore: any = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string) {
          cookieStore.set(name, value, COOKIE_OPTIONS)
        },
        remove(name: string) {
          cookieStore.delete(name, COOKIE_OPTIONS)
        }
      }
    }
  )
})

export async function getFacilityMatches() {
  const supabase = createClient()
  const { data: matches } = await supabase
    .from("matches")
    .select("*")
    .order("score", { ascending: false })
    .limit(10)

  return matches || []
}

export async function getFacilityById(id: string) {
  const supabase = createClient()
  const { data: facility } = await supabase
    .from("facilities")
    .select("*")
    .eq("id", id)
    .single()

  return facility
}

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) return null

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single()

  return user
}

export async function getUserOrganization() {
  const user = await getCurrentUser()
  if (!user?.org_id) return null

  const supabase = createClient()
  const { data: org } = await supabase
    .from("orgs")
    .select("*")
    .eq("id", user.org_id)
    .single()

  return org
}

export async function getReferrals() {
  const supabase = createClient()
  const { data: referrals } = await supabase
    .from('referrals')
    .select(`
      *,
      fromFacility:from_facility(id, name),
      toFacility:to_facility(id, name)
    `)
    .order('created_at', { ascending: false })

  return referrals || []
}

export async function getFacilityServiceAreas() {
  const supabase = createClient()
  const { data: areas } = await supabase
    .from('service_areas')
    .select('*')

  return areas?.map(area => ({
    id: area.id,
    lat: area.lat || 0,
    lng: area.lng || 0,
    radiusMiles: area.radius_miles || 10
  })) || []
}