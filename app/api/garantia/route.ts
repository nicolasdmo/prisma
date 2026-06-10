import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { rateLimit, clientIp } from '@/lib/rateLimit';

/**
 * Guarantee request. The buyer proves ownership with their access token;
 * we record the request in contact_messages including HOW LONG AGO the
 * purchase happened, so the owner can evaluate each case individually.
 * No automatic refund happens here — it's a discretionary review queue.
 */
export async function POST(req: NextRequest) {
  try {
    if (!(await rateLimit(`garantia:${clientIp(req.headers)}`, 3, 60_000))) {
      return NextResponse.json({ error: 'Demasiados intentos.' }, { status: 429 });
    }

    const body   = await req.json();
    const token  = (body.token ?? '').toString().trim();
    const motivo = (body.motivo ?? '').toString().trim();

    if (!token || token.length > 100) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 400 });
    }
    if (motivo.length > 1000) {
      return NextResponse.json({ error: 'Mensaje demasiado largo.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('purchases')
      .select('payment_id, archetype, buyer_email, buyer_name, created_at')
      .eq('access_token', token)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Compra no encontrada.' }, { status: 404 });
    }

    const purchasedAt = new Date(data.created_at);
    const hours       = Math.max(0, Math.round((Date.now() - purchasedAt.getTime()) / 36e5));
    const days        = Math.floor(hours / 24);
    const elapsed     = days > 0 ? `${days} día(s) y ${hours - days * 24} h` : `${hours} h`;

    const message =
      `SOLICITUD DE GARANTÍA\n` +
      `Arquetipo: ${data.archetype}\n` +
      `Payment ID: ${data.payment_id}\n` +
      `Compra: ${purchasedAt.toISOString()} — hace ${elapsed} (${hours} h en total)` +
      (motivo ? `\n\nMotivo del comprador:\n${motivo}` : '\n\n(Sin motivo especificado)');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (supabase as any)
      .from('contact_messages')
      .insert({
        name:    data.buyer_name || null,
        email:   data.buyer_email,
        message,
        source:  'prisma-garantia',
      });

    if (insertError) {
      console.error('[garantia] supabase error:', insertError.message);
      return NextResponse.json({ error: 'Error al registrar la solicitud.' }, { status: 500 });
    }

    console.log(`[garantia] Solicitud registrada — pago ${data.payment_id}, hace ${hours} h`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[garantia] unexpected error:', err);
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 });
  }
}
