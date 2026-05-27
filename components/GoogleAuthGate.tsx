'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSupabaseBrowser } from '@/lib/supabaseBrowser';
import { Analytics } from '@/lib/analytics';
import { motion } from 'framer-motion';

interface Props {
  archetypeCode: string;
  color:         string;
  onUnlock:      (email: string, name: string) => void;
}

export default function GoogleAuthGate({ archetypeCode, color: _color, onUnlock }: Props) {
  const [loading,   setLoading]   = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [error,     setError]     = useState('');
  const unlockedRef = useRef(false);

  const doUnlock = useCallback(
    (email: string, name: string) => {
      if (unlockedRef.current) return; // prevent double-fire
      unlockedRef.current = true;

      fetch('/api/lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, name, archetypeCode }),
      }).catch(() => {});

      Analytics.login(archetypeCode);
      onUnlock(email, name);
    },
    [archetypeCode, onUnlock],
  );

  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // Check for an existing session (e.g. returning from OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        doUnlock(session.user.email, session.user.user_metadata?.full_name ?? '');
      } else {
        setLoading(false);
      }
    });

    // Also listen for auth state changes (fallback / future re-logins)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        doUnlock(session.user.email, session.user.user_metadata?.full_name ?? '');
      }
    });

    return () => subscription.unsubscribe();
  }, [doUnlock]);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError('');

    const { error: authError } = await getSupabaseBrowser().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        scopes: 'email profile',
      },
    });

    if (authError) {
      setError('Hubo un error al conectar con Google. Intentá de nuevo.');
      setSigningIn(false);
    }
    // On success the browser navigates away — no need to reset signingIn
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="inline-block w-5 h-5 border-2 border-line border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-5 py-2"
    >
      <div className="text-center">
        <p className="font-serif text-2xl text-ink mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          Tu perfil completo te espera
        </p>
        <p className="text-ink-mute text-sm leading-relaxed max-w-xs mx-auto">
          Ingresá con Google para desbloquear tu análisis detallado, tus ejes de personalidad y tu contexto completo.
        </p>
      </div>

      <button
        onClick={handleSignIn}
        disabled={signingIn}
        className="flex items-center gap-3 bg-white text-[#1f1f1f] px-6 py-3.5 rounded-pill font-medium text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {signingIn ? (
          <span className="inline-block w-4 h-4 border-2 border-[#1f1f1f40] border-t-[#1f1f1f] rounded-full animate-spin" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
        )}
        {signingIn ? 'Redirigiendo a Google...' : 'Continuar con Google'}
      </button>

      {error && (
        <p className="text-xs text-center text-red-400 max-w-xs">{error}</p>
      )}

      <p className="font-mono text-[10px] text-ink-faint tracking-wider text-center">
        Gratis · Solo para identificarte · No spam
      </p>
    </motion.div>
  );
}
