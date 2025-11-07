import { Suspense } from "react";
import { getCurrentUser } from "@/lib/api";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSupabaseConfigured = Boolean(
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
      /^https?:\/\//.test(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes(".")
  );

  // When Supabase is not configured in development, allow preview without redirect
  if (!isSupabaseConfigured && process.env.NODE_ENV !== "production") {
    return (
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  );
}
