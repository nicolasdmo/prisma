'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Re-runs the server page periodically so late webhooks / cash payments
 * eventually land, then gives up after `maxAttempts` (the page already
 * shows a manual "Refrescar" button as fallback).
 */
export default function AutoRefresh({
  intervalMs  = 5000,
  maxAttempts = 24, // ~2 minutes
}: {
  intervalMs?:  number;
  maxAttempts?: number;
}) {
  const router   = useRouter();
  const attempts = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      attempts.current += 1;
      if (attempts.current > maxAttempts) {
        clearInterval(id);
        return;
      }
      router.refresh();
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, maxAttempts, router]);

  return null;
}
