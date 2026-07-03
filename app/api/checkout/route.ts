import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ARCHETYPES } from '@/data/archetypes';
import { SITE_URL, PRICE_AMOUNT, PRICE_CURRENCY } from '@/lib/config';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    // A real buyer clicks "comprar" a handful of times at most.
    if (!(await rateLimit(`checkout:${clientIp(req.headers)}`, 10, 60_000))) {
      return NextResponse.json({ error: 'Demasiados intentos. Esperá un minuto.' }, { status: 429 });
    }

    const { code } = await req.json();
    const upper = typeof code === 'string' ? code.toUpperCase() : '';
    const archetype = ARCHETYPES[upper];

    if (!archetype) {
      return NextResponse.json({ error: 'Arquetipo inválido' }, { status: 400 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json({ error: 'MP no configurado' }, { status: 500 });
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: `prisma-reporte-${upper}`,
            title: `Reporte Completo PRISMA · ${archetype.name}`,
            description: `Análisis profundo, lectura de sombra, guía de carrera y plan de acción — arquetipo ${upper}`,
            quantity: 1,
            unit_price: Number(process.env.MP_PRICE ?? PRICE_AMOUNT),
            currency_id: process.env.MP_CURRENCY ?? PRICE_CURRENCY,
          },
        ],
        back_urls: {
          success: `${SITE_URL}/reporte/${upper}/exito`,
          failure: `${SITE_URL}/reporte/${upper}?error=pago`,
          pending: `${SITE_URL}/reporte/${upper}/pendiente`,
        },
        auto_return: 'approved',
        external_reference: upper,
        statement_descriptor: 'PRISMA TEST',
        // Explicit per-preference webhook target — delivery no longer depends
        // solely on the app-level webhook configured in the MP panel.
        notification_url: `${SITE_URL}/api/webhook/mp`,
      },
    });

    return NextResponse.json({
      init_point: result.init_point,
      id: result.id,
    });
  } catch (err: unknown) {
    console.error('[checkout]', err);
    const msg = err instanceof Error ? err.message : 'Error inesperado';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
