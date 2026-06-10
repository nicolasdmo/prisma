import { NextRequest, NextResponse } from 'next/server';
import { processApprovedPayment } from '@/lib/processPayment';
import { rateLimit, clientIp } from '@/lib/rateLimit';

/**
 * Access recovery — the safety net now that no email is sent.
 * The buyer provides their MercadoPago payment number (visible in the MP app
 * / receipt) plus the email they paid with. We verify the payment against MP
 * (idempotent: also heals purchases the webhook missed) and, only when the
 * payer email matches, return the report link.
 *
 * Requiring BOTH values keeps payment_id enumeration useless on its own.
 */
export async function POST(req: NextRequest) {
  try {
    if (!(await rateLimit(`recuperar:${clientIp(req.headers)}`, 5, 60_000))) {
      return NextResponse.json({ error: 'Demasiados intentos. Esperá un minuto.' }, { status: 429 });
    }

    const body      = await req.json();
    const paymentId = (body.paymentId ?? '').toString().trim();
    const email     = (body.email ?? '').toString().trim().toLowerCase();

    if (!paymentId || !/^\d{5,30}$/.test(paymentId)) {
      return NextResponse.json({ error: 'Número de pago inválido.' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    let result;
    try {
      result = await processApprovedPayment(paymentId);
    } catch (err) {
      console.error('[recuperar] processPayment error:', err);
      result = null;
    }

    // Same generic message for "not found", "not approved" and "wrong email":
    // never reveal which part failed.
    if (!result || result.email.toLowerCase() !== email) {
      return NextResponse.json(
        { error: 'No encontramos una compra aprobada con esos datos.' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok:  true,
      url: `/reporte/${result.archetypeCode}/ver?token=${result.accessToken}`,
    });
  } catch (err) {
    console.error('[recuperar] unexpected error:', err);
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 });
  }
}
