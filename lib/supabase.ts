import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/** Returns a lazily-initialised Supabase client (safe at build time). */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE_URL / SUPABASE_ANON_KEY env vars');
    _client = createClient(url, key);
  }
  return _client;
}
