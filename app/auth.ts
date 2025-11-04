import type { NextAuthConfig } from "next-auth";
import NextAuth from 'next-auth'
import { createClient } from "@supabase/supabase-js";
import { Provider } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const authConfig = {
  providers: [],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Check if user exists in our org/users tables
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, org_id, role")
        .eq("email", user.email)
        .single();

      if (existingUser) {
        // Update last login
        await supabase
          .from("users")
          .update({ last_sign_in: new Date() })
          .eq("id", existingUser.id);

        return true;
      }

      // New user - create org and user
      const { data: org } = await supabase
        .from("orgs")
        .insert([{ name: user.email.split("@")[1] }])
        .select()
        .single();

      if (!org) return false;

      await supabase.from("users").insert([
        {
          email: user.email,
          name: user.name,
          org_id: org.id,
          role: "OWNER",
        },
      ]);

      return true;
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const { data: user } = await supabase
          .from("users")
          .select("id, org_id, role")
          .eq("email", session.user.email)
          .single();

        if (user) {
          (session.user as any).id = user.id;
          (session.user as any).orgId = user.org_id;
          (session.user as any).role = user.role;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
