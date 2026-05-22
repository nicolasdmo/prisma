'use client';

import { MotionConfig } from 'framer-motion';

/**
 * App-wide providers.
 * MotionConfig reducedMotion="user" makes every framer-motion animation
 * respect the OS-level "reduce motion" accessibility preference.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
