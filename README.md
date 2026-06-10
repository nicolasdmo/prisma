# PRISMA

Test de personalidad de 16 arquetipos con venta de reporte premium vía MercadoPago.

- **Producción:** https://prisma-v2-six.vercel.app (proyecto Vercel `prisma-v2`)
- **Rama de producción: `master`** — la rama `main` es un sitio estático viejo, ignorala.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind 4
- Supabase (`leads`, `purchases`, `contact_messages`)
- MercadoPago Checkout Pro (preferencia server-side + webhook firmado HMAC-SHA256)
- NextAuth v5 con Google (gate del perfil gratuito + captura de leads)
- Resend (email transaccional con el link del reporte)
- Google Analytics 4

## Flujo del usuario

1. Landing `/` → test de 16 preguntas en `/test` (4 ejes, scoring ponderado en `lib/scoring.ts`)
2. Resultado gratuito en `/r/[code]` (ej. `/r/ISLP`) — login con Google desbloquea el perfil extendido y registra el lead
3. Compra del reporte premium en `/reporte/[code]` → MercadoPago Checkout Pro
4. Vuelta de MP a `/reporte/[code]/exito?payment_id=…` → se verifica el pago contra la API de MP y se redirige a
5. `/reporte/[code]/ver?token=…` — el access token (único por compra) es el acceso permanente al reporte. El webhook (`/api/webhook/mp`) procesa el pago en paralelo y manda el email con el mismo link.

## Setup local

```bash
git clone https://github.com/nicolasdmo/prisma
cd prisma
git checkout master
npm install
cp .env.example .env.local   # completar valores
npm run dev
```

### Variables de entorno

Ver [.env.example](.env.example) — los nombres ahí son los que el código lee de verdad
(`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `AUTH_SECRET`, etc.).

### Base de datos (Supabase SQL Editor)

| Archivo | Tabla | Acceso |
|---|---|---|
| `supabase-setup.sql` | `leads` | anon INSERT only |
| `supabase-purchases.sql` | `purchases` | solo service role |
| `supabase-contact-messages.sql` | `contact_messages` | solo service role |

## Notas de seguridad

- El contenido premium (`data/premiumContent.ts`) **solo** puede importarse desde código server-side
  (`app/reporte/[code]/ver/page.tsx`, `app/reporte/[code]/page.tsx`, `emails/`). Nunca importarlo en un
  componente `'use client'` — terminaría en el bundle público. `ExitoClient` lo recibe por props después
  de la verificación del token.
- El webhook de MP exige firma HMAC en producción (`MP_WEBHOOK_SECRET`); además todo pago se re-verifica
  contra la API de MP en `lib/processPayment.ts` (estado, arquetipo y monto).
- Las APIs públicas (`/api/checkout`, `/api/lead`, `/api/contact`) y la página `/exito` tienen rate
  limiting in-memory por IP (`lib/rateLimit.ts`). Es per-instancia: si el tráfico crece, migrar a
  Upstash/Vercel KV manteniendo la misma API.
- `/api/lead` toma email y nombre de la sesión NextAuth del servidor, nunca del body.

## Scripts

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint`
- `scripts/generate-premium.mjs` — generador del contenido premium
