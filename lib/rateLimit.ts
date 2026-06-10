// In-memory sliding-window rate limiter.
//
// State lives per serverless instance, so limits are approximate on Vercel
// (each warm lambda counts separately). That's fine for the goal here:
// stopping cheap abuse loops (lead spam, MP preference flooding, payment_id
// enumeration) without adding external infrastructure. If traffic grows,
// swap the internals for Upstash/Vercel KV keeping the same API.

const buckets = new Map<string, number[]>();
const MAX_KEYS = 5_000;

/**
 * Returns true when the call is allowed, false when `key` exceeded
 * `limit` calls within the last `windowMs` milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  // Bound memory: drop everything when the map grows too large.
  if (buckets.size > MAX_KEYS) buckets.clear();

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  return true;
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
