import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Using hardcoded values for now
const supabaseUrl = 'https://vhvfcccgtmwzpuphlepr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZodmZjY2NndG13enB1cGhsZXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDc1NTIsImV4cCI6MjA3OTM4MzU1Mn0.zT0qaL92YhVB4Ht21TeciBvQOIwUX6Zwsvj39gYGy3s';

export const createClient = () => {
  return createSupabaseClient(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
};
