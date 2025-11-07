import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { checkAccess } from "@/lib/rbac";

export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  );

  // Ensure authenticated via session-based RBAC
  const userOrError = await checkAccess(supabase);
  if (userOrError instanceof NextResponse) return userOrError;

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const perPage = Math.min(
    100,
    Math.max(1, Number(url.searchParams.get("per_page") || "10"))
  );
  const orgId =
    url.searchParams.get("orgId") ||
    request.headers.get("x-user-org") ||
    undefined;
  const facilityId = url.searchParams.get("facilityId") || undefined;

  let query = supabase
    .from("matches")
    .select(
      `
      *,
      facility_a:facilities!matches_facility_a_id_fkey (
        id,
        name,
        logo_url,
        industry
      ),
      facility_b:facilities!matches_facility_b_id_fkey (
        id,
        name,
        logo_url,
        industry
      )
    `
    )
    .order("score", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (orgId) query = query.eq("org_id", orgId);
  if (facilityId)
    query = query.or(
      `facility_a_id.eq.${facilityId},facility_b_id.eq.${facilityId}`
    );

  const { data, error } = await query;

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  // Add placeholder images for facilities that don't have a logo
  const matches = (data || []).map((match) => ({
    ...match,
    facility_a: {
      ...match.facility_a,
      logo_url:
        match.facility_a?.logo_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          match.facility_a?.name || "Business"
        )}&background=random`,
    },
    facility_b: {
      ...match.facility_b,
      logo_url:
        match.facility_b?.logo_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          match.facility_b?.name || "Business"
        )}&background=random`,
    },
  }));

  return NextResponse.json({ matches });
}
