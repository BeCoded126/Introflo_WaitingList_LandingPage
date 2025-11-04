import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from '@supabase/ssr';
export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  );

  const url = new URL(request.url);
  const facilityId = url.searchParams.get("facilityId");

  if (!facilityId) {
    return NextResponse.json(
      { error: "facilityId query param required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("service_areas")
    .select("*")
    .eq("facility_id", facilityId);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ areas: data || [] });
}

// Replace (POST) existing set of areas for a facility
export async function POST(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  );

  // Middleware should enforce auth for /api; validate headers as defensive check
  const userId = request.headers.get("x-user-id");
  const userRole = request.headers.get("x-user-role");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!userRole || !["ADMIN", "OWNER"].includes(userRole))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { facilityId, areas } = body || {};

  if (!facilityId || !Array.isArray(areas)) {
    return NextResponse.json(
      { error: "facilityId and areas are required" },
      { status: 400 }
    );
  }

  const { error: delError } = await supabase
    .from("service_areas")
    .delete()
    .eq("facility_id", facilityId);

  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  const toInsert = areas.map((a: any) => ({
    id: a.id ?? undefined,
    facility_id: facilityId,
    lat: a.lat,
    lng: a.lng,
    radius_miles: a.radiusMiles,
    city: a.city ?? null,
    state: a.state ?? null,
  }));

  const { data: inserted, error: insertError } = await supabase
    .from("service_areas")
    .insert(toInsert);

  if (insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ areas: inserted });
}

// Update a single service area partially
export async function PUT(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  );

  const userId = request.headers.get("x-user-id");
  const userRole = request.headers.get("x-user-role");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!userRole || !["ADMIN", "OWNER"].includes(userRole))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { id, lat, lng, radiusMiles, city, state } = body || {};
  if (!id)
    return NextResponse.json({ error: "id is required" }, { status: 400 });

  const updates: any = {};
  if (lat !== undefined) updates.lat = lat;
  if (lng !== undefined) updates.lng = lng;
  if (radiusMiles !== undefined) updates.radius_miles = radiusMiles;
  if (city !== undefined) updates.city = city;
  if (state !== undefined) updates.state = state;

  const { data, error } = await supabase
    .from("service_areas")
    .update(updates)
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ area: data?.[0] ?? null });
}

// Delete a single service area by id
export async function DELETE(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: request.cookies }
  );

  const userId = request.headers.get("x-user-id");
  const userRole = request.headers.get("x-user-role");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!userRole || !["ADMIN", "OWNER"].includes(userRole))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { error: "id query param required" },
      { status: 400 }
    );

  const { error } = await supabase.from("service_areas").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
