import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { ARCHETYPES } from '@/data/archetypes';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const upper = code?.toUpperCase();
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://prisma-v2-six.vercel.app';

    const result = await preference.create({
      body: {
        items: [
          {
            id: `prisma-reporte-${upper}`,
            title: `Reporte Completo PRISMA · ${archetype.name}`,
            description: `Análisis profundo, lectura de sombra, guía de carrera y plan de acción — arquetipo ${upper}`,
            quantity: 1,
            unit_price: Number(process.env.MP_PRICE ?? 9990),
            currency_id: process.env.MP_CURRENCY ?? 'ARS',
          },
        ],
        back_urls: {
          success: `${baseUrl}/reporte/${upper}/exito`,
          failure: `${baseUrl}/reporte/${upper}?error=pago`,
          pending: `${baseUrl}/reporte/${upper}/pendiente`,
        },
        auto_return: 'approved',
        external_reference: upper,
        statement_descriptor: 'PRISMA TEST',
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
