import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Server-side admin client (service role — never expose to client) */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

/** Public client for use in server components / API routes */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
