import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function makeMockQueryBuilder() {
  const builder: any = {
    select: () => builder,
    eq: () => builder,
    order: async () => ({ data: [], error: null }),
    insert: async () => ({ data: [], error: null }),
    delete: async () => ({ error: null }),
    update: () => ({ eq: () => ({ data: [], error: null }) }),
    single: async () => ({ data: null, error: null }),
  };
  return builder;
}

function makeMockClient() {
  const mock: any = {
    auth: {
      async signInWithOtp() {
        return { error: new Error("Supabase not configured") };
      },
      async signInWithOAuth() {
        return { error: new Error("Supabase not configured") };
      },
      async signOut() {
        return { error: null };
      },
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async exchangeCodeForSession() {
        return { error: new Error("Supabase not configured") };
      },
      onAuthStateChange(_cb: any) {
        return {
          data: { subscription: { unsubscribe() {} } },
          error: null,
        } as any;
      },
    },
    from() {
      return makeMockQueryBuilder();
    },
    channel() {
      const ch: any = {
        on() {
          return ch;
        },
        subscribe() {
          return { unsubscribe() {} };
        },
      };
      return ch;
    },
  };
  return mock;
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are not set. Please copy .env.example to .env.local and fill values. Using mock client."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : makeMockClient();

export default supabase;
