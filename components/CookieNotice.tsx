'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'prisma_cookie_ok';

/** Discreet cookie/analytics notice. Dismissal is remembered in localStorage. */
export default function CookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
    } catch {
      /* storage blocked — just don't show */
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm z-50 rounded-lg border border-line bg-bg-card shadow-lg p-4 text-sm text-ink-soft">
      <p className="mb-3">
        Usamos cookies para medir el uso del sitio y mejorarlo. Leé nuestra{' '}
        <Link href="/privacidad" className="text-ink underline">política de privacidad</Link>.
      </p>
      <button
        onClick={accept}
        className="w-full rounded-pill bg-ink text-bg-card py-2 text-xs font-mono uppercase tracking-widest hover:opacity-85 transition-opacity"
      >
        Entendido
      </button>
    </div>
  );
}
