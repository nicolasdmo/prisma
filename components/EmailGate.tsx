'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface EmailGateProps {
  archetypeCode: string;
  onUnlock: () => void;
}

export default function EmailGate({ archetypeCode, onUnlock }: EmailGateProps) {
  const [name, setName]   = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), archetypeCode }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al guardar');
      }

      setStatus('done');
      setTimeout(onUnlock, 600);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Algo salió mal. Intentá de nuevo.');
    }
  };

  if (status === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 py-10 text-center"
      >
        <span className="text-3xl">✓</span>
        <p className="font-serif text-xl text-ink" style={{ fontFamily: 'var(--font-serif)' }}>
          Desbloqueando tu perfil…
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-bg-elev border border-line rounded-lg p-6 sm:p-8 max-w-md mx-auto"
    >
      <p className="eyebrow mb-3">Desbloqueá tu perfil completo</p>
      <h3
        className="font-serif text-2xl text-ink mb-2"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Fortalezas · Zona de crecimiento · Referentes
      </h3>
      <p className="text-ink-mute text-sm mb-6 leading-relaxed">
        Ingresá tu nombre y mail para desbloquear el resto de tu resultado y recibir tu tarjeta para compartir.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-bg-card border border-line rounded-sm px-4 py-3 text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors"
        />
        <input
          type="email"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-bg-card border border-line rounded-sm px-4 py-3 text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors"
        />

        {errorMsg && (
          <p className="text-sm text-red-600 font-mono">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-ink text-bg-card py-3 rounded-sm font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? 'Guardando…' : 'Ver mi perfil completo'}
        </button>
      </form>

      <p className="mt-4 text-ink-faint font-mono text-[10px] tracking-wider text-center">
        Sin spam. Solo tu resultado.
      </p>
    </motion.div>
  );
}
