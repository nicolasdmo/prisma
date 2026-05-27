import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Browser-safe Supabase client.
 * Uses NEXT_PUBLIC_ env vars so it can be imported in client components.
 * Singleton — safe to call multiple times.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    _client = createClient(url, key);
  }
  return _client;
}
