import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Create a mutable NextResponse so we can set cookies/headers
  const response = NextResponse.next({ request: { headers: request.headers } });
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const seemsValidUrl =
    typeof SUPABASE_URL === "string" && /^https?:\/\//.test(SUPABASE_URL);
  const seemsValidKey =
    typeof SUPABASE_ANON_KEY === "string" && SUPABASE_ANON_KEY.includes(".");
  const isConfigured = Boolean(seemsValidUrl && seemsValidKey);

  // Graceful dev fallback when Supabase env is not configured
  if (!isConfigured) {
    // In development, allow non-API routes to render so UI can be previewed
    if (process.env.NODE_ENV !== "production") {
      if (request.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.json(
          {
            error:
              "Supabase not configured or invalid credentials. Set valid NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
          },
          { status: 503 }
        );
      }
      // Allow access to all pages in dev mode when Supabase not configured (for demo with mock data)
      return response;
    }
    // In production, fail fast
    return NextResponse.json(
      {
        error:
          "Server misconfiguration: Supabase environment variables missing",
      },
      { status: 500 }
    );
  }

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.delete({ name, ...options });
      },
    },
  });

  // Try to read session for both API and app pages
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the request is for /api/* enforce authentication and return JSON errors
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Lookup user role and attach simple headers for downstream handlers
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("id, role, org_id")
      .eq("id", session.user.id)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-role", user.role);
    if (user.org_id) response.headers.set("x-user-org", user.org_id);

    return response;
  }

  // Protect all routes under /app (UI pages)
  if (request.nextUrl.pathname.startsWith("/app")) {
    // In development we allow previewing UI without auth if explicitly opted-in via DEV_PREVIEW (or when Supabase not configured above)
    const devPreview =
      process.env.NODE_ENV !== "production" &&
      process.env.DEV_PREVIEW === "true";
    if (!session?.user && !devPreview) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    if (session?.user) {
      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (!user) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      response.headers.set("x-user-role", user.role);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
