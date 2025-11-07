import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const validUrl = /^https?:\/\//.test(supabaseUrl);
const validKey = supabaseAnonKey.includes(".");

const makeMockQueryBuilder = () => {
  const builder: any = {
    select: () => builder,
    or: () => builder,
    eq: () => builder,
    order: async () => ({ data: [], error: null }),
    insert: async () => ({ data: [], error: null }),
    delete: async () => ({ error: null }),
    update: () => ({ eq: () => ({ data: [], error: null }) }),
    single: async () => ({ data: null, error: null }),
  };
  return builder;
};

const makeMockClient = () => {
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
        return { data: { subscription: { unsubscribe() {} } }, error: null } as any;
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
};

export const supabase: any = (() => {
  if (validUrl && validKey) {
    try {
      return createBrowserClient(supabaseUrl, supabaseAnonKey) as any;
    } catch (_e) {
      return makeMockClient();
    }
  }
  return makeMockClient();
})();

export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error };
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
}

export async function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event: any, session: any) => {
    callback(session);
  });
}
