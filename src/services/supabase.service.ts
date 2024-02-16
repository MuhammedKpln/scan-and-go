import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_CLIENT_URL,
  import.meta.env.VITE_SUPABASE_CLIENT_ANON_KEY
);
