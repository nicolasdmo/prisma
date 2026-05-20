import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { ARCHETYPE_CODES } from '@/data/archetypes';

const FAKE_DOMAINS  = ['ejemplo.com', 'test.com', 'prueba.com', 'fake.com', 'example.com', 'yopmail.com'];
const FAKE_KEYWORDS = ['test', 'prueba', 'prisma', 'fake', 'admin'];

function isFakeEntry(name: string, email: string): boolean {
  const nameLower  = name.toLowerCase();
  const emailLower = email.toLowerCase();
  return (
    FAKE_KEYWORDS.some((k) => nameLower.includes(k)) ||
    FAKE_DOMAINS.some((d) => emailLower.endsWith(`@${d}`))
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name          = (body.name ?? '').trim();
    const email         = (body.email ?? '').trim().toLowerCase();
    const archetypeCode = (body.archetypeCode ?? '').toUpperCase();

    // Basic validation
    if (!name || !email || !archetypeCode) {
      return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

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
