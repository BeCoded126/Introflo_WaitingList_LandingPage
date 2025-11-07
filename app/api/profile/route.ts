import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/api";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's facility profile
    const { data: facility, error } = await supabase
      .from("facilities")
      .select("*")
      .eq("organization_id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { images, insurances, services, bio } = body;

    // Validate inputs
    if (images && (!Array.isArray(images) || images.length > 3)) {
      return NextResponse.json({ error: "Images must be an array with max 3 items" }, { status: 400 });
    }

    if (bio && typeof bio === "string" && bio.length > 300) {
      return NextResponse.json({ error: "Bio must be 300 characters or less" }, { status: 400 });
    }

    if (insurances && !Array.isArray(insurances)) {
      return NextResponse.json({ error: "Insurances must be an array" }, { status: 400 });
    }

    if (services && !Array.isArray(services)) {
      return NextResponse.json({ error: "Services must be an array" }, { status: 400 });
    }

    // Update facility profile
    const { data: facility, error } = await supabase
      .from("facilities")
      .update({
        images,
        insurances,
        services,
        bio,
        updated_at: new Date().toISOString(),
      })
      .eq("organization_id", session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
