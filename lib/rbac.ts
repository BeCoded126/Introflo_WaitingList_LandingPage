import { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type Role = "admin" | "org_admin" | "user";

interface User {
  id: string;
  role: Role;
  org_id?: string;
}

export interface AccessCheck {
  hasRole?: Role[];
  ownsResource?: {
    table: string;
    field: string;
    value: string;
  };
  inOrg?: {
    table: string;
    id: string;
  };
}

/**
 * Verify a user has the required access. Used in API routes to enforce RBAC.
 * @returns User object if allowed, or NextResponse with 401/403 if denied
 */
export async function checkAccess(
  supabase: SupabaseClient,
  check?: AccessCheck
): Promise<User | NextResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user role and org from DB
  const { data: user, error } = await supabase
    .from("users")
    .select("id, role, org_id")
    .eq("id", session.user.id)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // If no checks needed, just return the user
  if (!check) return user;

  // Check role if specified
  if (check.hasRole && !check.hasRole.includes(user.role)) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 }
    );
  }

  // Check resource ownership if specified
  if (check.ownsResource) {
    const { table, field, value } = check.ownsResource;
    const { data: resource } = await supabase
      .from(table)
      .select("id")
      .eq(field, value)
      .eq("owner_id", user.id)
      .single();

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found or access denied" },
        { status: 403 }
      );
    }
  }

  // Check organization membership if specified
  if (check.inOrg) {
    const { table, id } = check.inOrg;
    const { data: resource } = await supabase
      .from(table)
      .select("org_id")
      .eq("id", id)
      .single();

    if (!resource || resource.org_id !== user.org_id) {
      return NextResponse.json(
        { error: "Resource not found or access denied" },
        { status: 403 }
      );
    }
  }

  return user;
}

/**
 * Helper to verify a user can manage service areas (admin or org_admin)
 */
export async function canManageServiceAreas(
  supabase: SupabaseClient,
  facilityId?: string
): Promise<User | NextResponse> {
  // Must be admin or org_admin
  const userOrError = await checkAccess(supabase, {
    hasRole: ["admin", "org_admin"],
  });

  if (userOrError instanceof NextResponse) return userOrError;

  // If facilityId provided, verify user's org owns it
  if (facilityId) {
    const { data: facility } = await supabase
      .from("facilities")
      .select("org_id")
      .eq("id", facilityId)
      .single();

    if (!facility || facility.org_id !== userOrError.org_id) {
      return NextResponse.json(
        { error: "Facility not found or access denied" },
        { status: 403 }
      );
    }
  }

  return userOrError;
}

/**
 * Helper to verify a user can view service areas (any authenticated user in the org)
 */
export async function canViewServiceAreas(
  supabase: SupabaseClient,
  facilityId: string
): Promise<User | NextResponse> {
  const userOrError = await checkAccess(supabase);
  if (userOrError instanceof NextResponse) return userOrError;

  // Verify facility exists and user is in the same org
  const { data: facility } = await supabase
    .from("facilities")
    .select("org_id")
    .eq("id", facilityId)
    .single();

  if (!facility || facility.org_id !== userOrError.org_id) {
    return NextResponse.json(
      { error: "Facility not found or access denied" },
      { status: 403 }
    );
  }

  return userOrError;
}
