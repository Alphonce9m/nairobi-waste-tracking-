import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create and export the default client instance
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Also export the createClient function for cases where a new instance is needed
export const createClient = () => createSupabaseClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Admin client has been removed from the browser bundle for security reasons.
// The admin client should only be used in server-side code through API routes.
// This prevents exposing admin credentials in the browser.
