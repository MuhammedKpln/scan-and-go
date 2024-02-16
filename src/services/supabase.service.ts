import { Database } from "@/models/supabase";
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient<Database>(
  import.meta.env.VITE_SUPABASE_CLIENT_URL,
  import.meta.env.VITE_SUPABASE_CLIENT_ANON_KEY
);
