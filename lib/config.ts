// Central app configuration — single source of truth for URL & pricing.
// Keep every price / domain reference pointing here so they never drift apart.

/** Canonical public URL of the site (used for OG tags, sitemap, checkout). */
export const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://prisma-v2-six.vercel.app';

/** Formats an ARS amount with dot thousands separators (deterministic, no ICU). */
const formatArs = (n: number) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Premium report price — numeric amount charged through MercadoPago.
 *  ⚠️ Cambiar el precio ACÁ (y redeploy). La env MP_PRICE puede pisar el monto
 *  cobrado en el server, pero el precio mostrado en la UI sale de este archivo —
 *  si divergen, mostrás un precio y cobrás otro. */
export const PRICE_AMOUNT = 9999;

/** Anchor (crossed-out) price shown next to the real price for anchoring effect. */
export const PRICE_ANCHOR_AMOUNT = 18000;

/** Currency code for the charge. */
export const PRICE_CURRENCY = 'ARS';

/** Human-readable price shown across the UI — derived, never edit by hand. */
export const PRICE_DISPLAY = formatArs(PRICE_AMOUNT);

/** Anchor price display — derived, never edit by hand. */
export const PRICE_ANCHOR_DISPLAY = formatArs(PRICE_ANCHOR_AMOUNT);
