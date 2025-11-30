"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Dynamically import supabase on the client inside the effect
      const mod = await import("../../../lib/supabase");
      const supabase = mod.supabase;
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.search
      );
      if (error) {
        console.error("Error during auth callback:", error);
        router.push("/auth_disabled/signin?error=Unable to sign in");
      } else {
        router.push("/app/dashboard");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500" />
    </div>
  );
}
