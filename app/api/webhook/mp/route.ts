import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import { SITE_URL } from '@/lib/config';
import { processApprovedPayment } from '@/lib/processPayment';
import ReporteEmail from '@/emails/ReporteEmail';

/**
 * Verifies the webhook came from MercadoPago via x-signature HMAC.
 * Skipped (returns true) when MP_WEBHOOK_SECRET is not set.
 */
function verifyMpSignature(req: NextRequest, dataId: string): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) return true;

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP sends: { type: 'payment', data: { id: '...' } }
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true, skipped: 'not a payment event' });
    }

    const paymentId = String(body.data?.id);
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

    // Already processed by a previous call → don't re-send the email
    if (result.alreadyExisted) {
      return NextResponse.json({ ok: true, alreadyProcessed: true });
    }

    // ── Optional: send confirmation email (fault-tolerant) ─────
    // The user already has access via /reporte/[code]/exito → /ver?token=
    // so email failures are non-fatal.
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.log('[webhook/mp] Resend not configured — skipping email (user has access via redirect)');
      return NextResponse.json({ ok: true, emailSkipped: 'no-resend-key' });
    }

    try {
      const resend    = new Resend(resendKey);
      const archetype = ARCHETYPES[result.archetypeCode];

      const html = await render(
        ReporteEmail({
          code:        result.archetypeCode,
          accessToken: result.accessToken,
          baseUrl:     SITE_URL,
        }) as React.ReactElement
      );

      // Use the user's verified Resend domain when available.
      // Falls back to onboarding@resend.dev which only works to the account owner.
      const fromAddr = process.env.RESEND_DOMAIN
        ? `PRISMA <reporte@${process.env.RESEND_DOMAIN}>`
        : 'PRISMA <onboarding@resend.dev>';

      const { error: emailError } = await resend.emails.send({
        from:    fromAddr,
        to:      result.email,
        subject: `Tu Reporte Completo · ${archetype.name} (${result.archetypeCode})`,
        html,
      });

      if (emailError) {
        console.warn('[webhook/mp] Email send failed (non-fatal):', emailError);
        return NextResponse.json({ ok: true, emailError: 'send-failed' });
      }

      // Mark email_sent so we don't retry
      const supabase = getSupabaseAdmin();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('purchases')
        .update({ email_sent: true })
        .eq('payment_id', paymentId);

      console.log(`[webhook/mp] ✅ Email sent to ${result.email} for ${result.archetypeCode}`);
      return NextResponse.json({ ok: true });

    } catch (err) {
      console.warn('[webhook/mp] Email send error (non-fatal):', err);
      return NextResponse.json({ ok: true, emailError: 'exception' });
    }

  } catch (err: unknown) {
    console.error('[webhook/mp] Fatal:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
