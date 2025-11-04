import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Create a mutable NextResponse so we can set cookies/headers
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.delete({ name, ...options })
        },
      },
    }
  )

  // Try to read session for both API and app pages
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the request is for /api/* enforce authentication and return JSON errors
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lookup user role and attach simple headers for downstream handlers
    const { data: user, error: userErr } = await supabase
      .from('users')
      .select('id, role, org_id')
      .eq('id', session.user.id)
      .single()

    if (userErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', user.role)
    if (user.org_id) response.headers.set('x-user-org', user.org_id)

    return response
  }

  // Protect all routes under /app (UI pages)
  if (request.nextUrl.pathname.startsWith('/app')) {
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }

    response.headers.set('x-user-role', user.role)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
