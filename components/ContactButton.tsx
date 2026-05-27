'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Floating contact button — bottom-right corner.
 * Opens a small modal; submits to /api/contact which saves to Supabase.
 */
export default function ContactButton() {
  const [open,    setOpen]    = useState(false);
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<Status>('idle');

  const reset = () => {
    setName(''); setEmail(''); setMessage(''); setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');

    const res = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      setStatus('sent');
      setTimeout(() => { setOpen(false); reset(); }, 2200);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Contacto"
        className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95"
        style={{
          background: 'var(--bg-elev)',
          border:     '1px solid var(--line)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-ink-soft">
          <path
            d="M14 2H2a1 1 0 00-1 1v8a1 1 0 001 1h5l2 2 2-2h3a1 1 0 001-1V3a1 1 0 00-1-1z"
            stroke="currentColor" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed bottom-20 right-5 z-50 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-line shadow-2xl"
              style={{ background: 'var(--bg-card)' }}
            >
              <div className="px-5 pt-5 pb-6 flex flex-col gap-4">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-ink-mute">
                    Contacto
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-ink-faint hover:text-ink transition-colors text-xl leading-none"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>

                {status === 'sent' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-6 flex flex-col items-center gap-3 text-center"
                  >
                    <span className="text-2xl">✓</span>
                    <p className="text-ink text-sm">Mensaje recibido. Te respondo pronto.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                    <input
                      type="text"
                      placeholder="Nombre (opcional)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-line bg-bg-elev text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Email (para responderte)"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-line bg-bg-elev text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors"
                    />
                    <textarea
                      placeholder="Tu mensaje..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2.5 rounded-lg border border-line bg-bg-elev text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors resize-none"
                    />

                    {status === 'error' && (
                      <p className="text-xs text-red-400">Error al enviar. Intentá de nuevo.</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending' || !message.trim()}
                      className="w-full py-2.5 rounded-lg font-mono text-xs tracking-widest uppercase font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'var(--ink)', color: 'var(--bg)' }}
                    >
                      {status === 'sending' ? 'Enviando…' : 'Enviar'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
