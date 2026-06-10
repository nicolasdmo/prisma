/**
 * Analytics utility — wraps gtag so event calls are safe everywhere.
 * gtag is loaded globally via the Script tag in layout.tsx.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { gtag?: (...args: any[]) => void }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params);
}

// ── Named events ────────────────────────────────────────────────

export const Analytics = {
  /** User completed the 16-question test and saw their archetype */
  testCompleted: (archetypeCode: string) =>
    trackEvent('test_completed', { archetype: archetypeCode }),

  /** User logged in with Google to unlock their free report */
  login: (archetypeCode: string) =>
    trackEvent('login', { method: 'google', archetype: archetypeCode }),

  /** User clicked the buy button for the premium report */
  checkoutStarted: (archetypeCode: string) =>
    trackEvent('checkout_started', { archetype: archetypeCode }),

  /** User successfully purchased the premium report.
   *  `value` + `currency` are required for GA4 to report revenue. */
  purchase: (archetypeCode: string, paymentId: string, value: number, currency: string) =>
    trackEvent('purchase', {
      transaction_id: paymentId,
      archetype:      archetypeCode,
      value,
      currency,
    }),

  /** User viewed their unlocked premium report */
  reportViewed: (archetypeCode: string) =>
    trackEvent('report_viewed', { archetype: archetypeCode }),

  /** User unlocked the free detailed result after Google login */
  resultUnlocked: (archetypeCode: string) =>
    trackEvent('result_unlocked', { archetype: archetypeCode }),
};
