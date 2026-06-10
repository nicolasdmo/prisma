import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`contact:${clientIp(req.headers)}`, 3, 60_000)) {
      return NextResponse.json({ error: 'Demasiados mensajes. Esperá un minuto.' }, { status: 429 });
    }

    const { name, email, message } = await req.json();

    const cleanMessage = (message ?? '').toString().trim();
    const cleanName    = (name ?? '').toString().trim();
    const cleanEmail   = (email ?? '').toString().trim();

    if (!cleanMessage) {
      return NextResponse.json({ error: 'Mensaje requerido.' }, { status: 400 });
    }
    // Anti-spam: reject oversized payloads.
    if (cleanMessage.length > 2000 || cleanName.length > 120 || cleanEmail.length > 200) {
      return NextResponse.json({ error: 'Datos demasiado largos.' }, { status: 400 });
    }
    // Validate email format when provided.
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (getSupabaseAdmin() as any)
      .from('contact_messages')
      .insert({
        name:    cleanName  || null,
        email:   cleanEmail || null,
        message: cleanMessage,
        source:  'prisma',
      });

    if (error) {
      console.error('[contact] supabase error:', error.message);
      return NextResponse.json({ error: 'Error al guardar.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] unexpected error:', err);
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 });
  }
}
