// Server-only client using the service role key (bypasses RLS)
// Never import this in client components

import { createClient } from '@supabase/supabase-js';

let _admin: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (!_admin) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) throw new Error('Missing SUPABASE_URL / SUPABASE_SERVICE_KEY');
    _admin = createClient(url, key, { auth: { persistSession: false } });
  }
  return _admin;
}
