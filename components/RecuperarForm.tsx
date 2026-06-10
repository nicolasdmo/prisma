'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'idle' | 'sending' | 'error';

export default function RecuperarForm() {
  const router = useRouter();
  const [paymentId, setPaymentId] = useState('');
  const [email,     setEmail]     = useState('');
  const [status,    setStatus]    = useState<Status>('idle');
  const [error,     setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');

    try {
      const res  = await fetch('/api/recuperar', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ paymentId, email }),
      });
      const data = await res.json();

      if (res.ok && data.url) {
        router.push(data.url);
        return;
      }
      setError(data.error ?? 'No pudimos recuperar tu compra. Verificá los datos.');
      setStatus('error');
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        inputMode="numeric"
        placeholder="Número de operación (ej: 123456789012)"
        value={paymentId}
        onChange={(e) => setPaymentId(e.target.value.replace(/\D/g, ''))}
        required
        className="w-full px-4 py-3 rounded-lg border border-line bg-bg-elev text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors"
      />
      <input
        type="email"
        placeholder="Email con el que pagaste"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-lg border border-line bg-bg-elev text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-ink-soft transition-colors"
      />

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !paymentId || !email}
        className="w-full py-3.5 rounded-pill bg-ink text-bg-card font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Buscando tu compra…' : 'Recuperar mi reporte'}
      </button>
    </form>
  );
}
