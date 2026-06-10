// Rate limiter per IP/key.
//
// Two backends, chosen automatically:
//  - Upstash Redis (REST): set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
//    in the environment and limits become global across all serverless
//    instances. Fixed-window counters via INCR + PEXPIRE, no SDK needed.
//  - In-memory fallback: sliding window per warm lambda. Approximate on
//    Vercel (each instance counts separately) but good enough to stop cheap
//    abuse loops when Upstash isn't configured.
//
// On Upstash network errors we FAIL OPEN (allow the request) — availability
// of the payment flow beats strictness of the limiter.

const buckets = new Map<string, number[]>();
const MAX_KEYS = 5_000;

function memoryLimit(key: string, limit: number, windowMs: number): boolean {
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

async function upstashLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const url   = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

  // Fixed window: one counter per window slot, expired automatically.
  const slot     = Math.floor(Date.now() / windowMs);
  const redisKey = `rl:${key}:${slot}`;

  try {
    const res = await fetch(`${url}/pipeline`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify([
        ['INCR', redisKey],
        ['PEXPIRE', redisKey, String(windowMs)],
      ]),
      // The limiter must never hang the request it protects.
      signal: AbortSignal.timeout(2_000),
    });
    if (!res.ok) throw new Error(`Upstash HTTP ${res.status}`);

    const data  = (await res.json()) as Array<{ result?: number; error?: string }>;
    const count = data?.[0]?.result;
    if (typeof count !== 'number') throw new Error('Unexpected Upstash response');

    return count <= limit;
  } catch (err) {
    console.warn('[rateLimit] Upstash unavailable, failing open:', err instanceof Error ? err.message : err);
    return true;
  }
}

/**
 * Returns true when the call is allowed, false when `key` exceeded
 * `limit` calls within the last `windowMs` milliseconds.
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return upstashLimit(key, limit, windowMs);
  }
  return memoryLimit(key, limit, windowMs);
}

/** Best-effort client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
