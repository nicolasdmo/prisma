import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';
import { ARCHETYPE_CODES } from '@/data/archetypes';
import { rateLimit, clientIp } from '@/lib/rateLimit';

const FAKE_DOMAINS = ['ejemplo.com', 'test.com', 'prueba.com', 'fake.com', 'example.com', 'yopmail.com'];
// Whole-word match so real names like "Testa" or "Adminte" don't get filtered.
const FAKE_NAME_RE = /\b(test|prueba|prisma|fake|admin)\b/i;

function isFakeEntry(name: string, email: string): boolean {
  return (
    FAKE_NAME_RE.test(name) ||
    FAKE_DOMAINS.some((d) => email.toLowerCase().endsWith(`@${d}`))
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`lead:${clientIp(req.headers)}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Demasiados intentos.' }, { status: 429 });
    }

    // Identity comes from the server-side session, never from the request
    // body — otherwise anyone can stuff the leads table with fake emails.
    const session = await auth();
    const email   = session?.user?.email?.trim().toLowerCase() ?? '';
    const name    = session?.user?.name?.trim() ?? '';

    if (!email) {
      return NextResponse.json({ error: 'No autenticado.' }, { status: 401 });
    }

    const body = await req.json();
    const archetypeCode = (body.archetypeCode ?? '').toUpperCase();

    if (!ARCHETYPE_CODES.includes(archetypeCode)) {
      return NextResponse.json({ error: 'Código de arquetipo inválido.' }, { status: 400 });
    }

    // Filter fake entries silently (return 200 so UX is unaffected)
    if (isFakeEntry(name, email)) {
      return NextResponse.json({ ok: true, filtered: true });
    }

    const { error } = await getSupabase()
      .from('leads')
      .insert({ name, email, archetype_code: archetypeCode });

    if (error) {
      console.error('[lead] supabase error:', error.message);
      // If duplicate email, treat as success (don't block the UX)
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      return NextResponse.json({ error: 'Error al guardar. Intentá de nuevo.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[lead] unexpected error:', err);
    return NextResponse.json({ error: 'Error inesperado.' }, { status: 500 });
  }
}
