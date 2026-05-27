'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';

/**
 * OAuth callback handler.
 * Supabase redirects here after Google login with ?code=... (PKCE flow).
 * We exchange the code for a session and redirect the user back to the
 * result page they came from (via ?next=...).
 */
function CallbackInner() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
      getSupabaseBrowser()
        .auth.exchangeCodeForSession(code)
        .finally(() => router.replace(next));
    } else {
      router.replace(next);
    }
  }, [router, searchParams]);

  return (
    <div
      style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--color-bg, #faf9f6)',
      }}
    >
      <span
        style={{
          display:      'inline-block',
          width:        24,
          height:       24,
          border:       '2px solid #d0cfc9',
          borderTop:    '2px solid #1a1a1a',
          borderRadius: '50%',
          animation:    'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <CallbackInner />
    </Suspense>
  );
}
