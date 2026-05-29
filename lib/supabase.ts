import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Export a function or client that is null-safe so that the application doesn't crash
// if credentials are not configured in local development.
export const supabase = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Log initialization status
if (!supabase) {
  console.warn(
    "Supabase configuration missing. Database features will degrade gracefully."
  );
}
