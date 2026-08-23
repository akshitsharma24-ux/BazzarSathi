import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Auth + Bazaar Chat are only usable when these are configured (Vercel env
// vars / local .env). Everything else in the app works without Supabase at
// all -- this is additive, not a hard dependency for the core product.
export const supabaseEnabled = Boolean(url && anonKey);

export const supabase = supabaseEnabled ? createClient(url, anonKey) : null;
