'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Legacy OAuth callback — no longer used.
 * NextAuth handles the callback at /api/auth/callback/google.
 * This page only exists in case of old bookmarks / cached redirects.
 */
export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, [router]);
  return null;
}
