import { createClient } from '@supabase/supabase-js';

// Read from Vite env variables; never hard-code secrets in source.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);