// Central app configuration — single source of truth for URL & pricing.
// Keep every price / domain reference pointing here so they never drift apart.

/** Canonical public URL of the site (used for OG tags, sitemap, checkout). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://prisma-v2-six.vercel.app';

/** Premium report price — numeric amount charged through MercadoPago. */
export const PRICE_AMOUNT = 9999;

/** Currency code for the charge. */
export const PRICE_CURRENCY = 'ARS';

/** Human-readable price shown across the UI. */
export const PRICE_DISPLAY = '$9.999';

/** Anchor (crossed-out) price shown next to the real price for anchoring effect. */
export const PRICE_ANCHOR_DISPLAY = '$18.000';
