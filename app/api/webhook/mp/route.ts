import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { processApprovedPayment } from '@/lib/processPayment';

/**
 * Verifies the webhook came from MercadoPago via x-signature HMAC.
 * In production a missing MP_WEBHOOK_SECRET rejects the request outright;
 * in development it's skipped so local testing doesn't need the secret.
 */
function verifyMpSignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[webhook/mp] MP_WEBHOOK_SECRET not set — rejecting webhook. Configure it in Vercel.');
      return false;
    }
    return true;
  }

  const signature = req.headers.get('x-signature') ?? '';
  const requestId = req.headers.get('x-request-id') ?? '';

  const parts: Record<string, string> = {};
  for (const piece of signature.split(',')) {
    const [k, v] = piece.split('=');
    if (k && v) parts[k.trim()] = v.trim();
  }
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const hmac     = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(v1));
  } catch {
    return false;
  }
}

/**
 * Records approved payments in Supabase. Delivery of the report happens via
 * the post-payment redirect (/exito → /ver?token=) and, as fallback, the
 * /recuperar page — no transactional email is sent.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP sends: { type: 'payment', data: { id: '...' } }
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true, skipped: 'not a payment event' });
    }

    const paymentId = body.data?.id ? String(body.data.id) : '';
    if (!paymentId) return NextResponse.json({ error: 'No payment id' }, { status: 400 });

    if (!verifyMpSignature(req, paymentId)) {
      console.error('[webhook/mp] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Verify with MP + upsert into purchases (idempotent)
    const result = await processApprovedPayment(paymentId);
    if (!result) {
      return NextResponse.json({ ok: true, skipped: 'not approved or invalid' });
    }

    console.log(
      `[webhook/mp] ✅ Purchase recorded — ${result.archetypeCode}, payment ${paymentId}` +
      (result.alreadyExisted ? ' (already existed)' : '')
    );
    return NextResponse.json({ ok: true, alreadyProcessed: result.alreadyExisted });

  } catch (err: unknown) {
    console.error('[webhook/mp] Fatal:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
