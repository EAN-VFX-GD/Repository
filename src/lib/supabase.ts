import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Add fallback values for development and debugging
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "public-anon-key";

// Log connection status for debugging
if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.warn(
    "Supabase environment variables are missing. Using fallback values for development.",
  );
}

let supabase: any;

try {
  console.log("Initializing Supabase client with URL:", supabaseUrl);
  supabase = createClient<Database>(
    supabaseUrl as string,
    supabaseAnonKey as string,
  );
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
  // Provide a mock client that won't crash the app but will log errors
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithPassword: () =>
        Promise.reject(new Error("Supabase client not initialized")),
      signUp: () =>
        Promise.reject(new Error("Supabase client not initialized")),
      signOut: () =>
        Promise.reject(new Error("Supabase client not initialized")),
      resetPasswordForEmail: () =>
        Promise.reject(new Error("Supabase client not initialized")),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.reject(new Error("Supabase client not initialized")),
          order: () =>
            Promise.reject(new Error("Supabase client not initialized")),
        }),
        order: () =>
          Promise.reject(new Error("Supabase client not initialized")),
      }),
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.reject(new Error("Supabase client not initialized")),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.reject(new Error("Supabase client not initialized")),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.reject(new Error("Supabase client not initialized")),
      }),
    }),
    storage: {
      from: () => ({
        upload: () =>
          Promise.reject(new Error("Supabase client not initialized")),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        remove: () =>
          Promise.reject(new Error("Supabase client not initialized")),
      }),
    },
    functions: {
      invoke: () =>
        Promise.reject(new Error("Supabase client not initialized")),
    },
  };
}

export { supabase };
