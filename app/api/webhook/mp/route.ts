import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import ReporteEmail from '@/emails/ReporteEmail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MP sends: { type: 'payment', data: { id: '...' } }
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true, skipped: 'not a payment event' });
    }

    const paymentId = String(body.data?.id);
    if (!paymentId) return NextResponse.json({ error: 'No payment id' }, { status: 400 });

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return NextResponse.json({ error: 'MP not configured' }, { status: 500 });

    // ── Verify payment with MP ─────────────────────────────────
    const client  = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const data    = await payment.get({ id: paymentId });

    if (data.status !== 'approved') {
      return NextResponse.json({ ok: true, skipped: `payment status: ${data.status}` });
    }

    const email         = data.payer?.email ?? '';
    const name          = data.payer?.first_name ?? '';
    const archetypeCode = (data.external_reference ?? '').toUpperCase();
    const amount        = data.transaction_amount ?? 0;
    const currency      = data.currency_id ?? 'ARS';

    if (!email || !archetypeCode || !ARCHETYPES[archetypeCode]) {
      console.error('[webhook/mp] Invalid email or archetype:', { email, archetypeCode });
      return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
    }

    // ── Upsert into purchases (idempotent) ────────────────────
    const supabase = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('purchases')
      .select('access_token, email_sent')
      .eq('payment_id', paymentId)
      .maybeSingle();

    let accessTokenUUID: string;

    if (existing) {
      accessTokenUUID = (existing as { access_token: string; email_sent: boolean }).access_token;
      if ((existing as { access_token: string; email_sent: boolean }).email_sent) {
        return NextResponse.json({ ok: true, skipped: 'already processed' });
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: inserted, error } = await (supabase as any)
        .from('purchases')
        .insert({
          email,
          name,
          archetype_code: archetypeCode,
          payment_id: paymentId,
          payment_status: 'approved',
          amount,
          currency,
        })
        .select('access_token')
        .single();

      if (error) {
        console.error('[webhook/mp] Supabase insert error:', error);
        return NextResponse.json({ error: 'DB error' }, { status: 500 });
      }
      accessTokenUUID = inserted.access_token;
    }

    // ── Send email via Resend ─────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('[webhook/mp] RESEND_API_KEY not set');
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://prisma-v2-six.vercel.app';
    const resend  = new Resend(resendKey);

    const archetype = ARCHETYPES[archetypeCode];
    const html      = await render(
      ReporteEmail({ code: archetypeCode, accessToken: accessTokenUUID, baseUrl }) as React.ReactElement
    );

    const { error: emailError } = await resend.emails.send({
      from:    `PRISMA <reporte@${process.env.RESEND_DOMAIN ?? 'prismatest.resend.dev'}>`,
      to:      email,
      subject: `Tu Reporte Completo · ${archetype.name} (${archetypeCode})`,
      html,
    });

    if (emailError) {
      console.error('[webhook/mp] Resend error:', emailError);
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
    }

    // Mark email as sent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('purchases')
      .update({ email_sent: true })
      .eq('payment_id', paymentId);

    console.log(`[webhook/mp] ✅ Report sent to ${email} for archetype ${archetypeCode}`);
    return NextResponse.json({ ok: true });

  } catch (err: unknown) {
    console.error('[webhook/mp] Fatal:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
