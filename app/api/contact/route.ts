import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensaje requerido.' }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin()
      .from('contact_messages')
      .insert({
        name:    name?.trim()    || null,
        email:   email?.trim()   || null,
        message: message.trim(),
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
