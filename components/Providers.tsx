'use client';

import { MotionConfig } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';

/**
 * App-wide providers.
 * MotionConfig reducedMotion="user" makes every framer-motion animation
 * respect the OS-level "reduce motion" accessibility preference.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  );
}
