# PRISMA

Test de personalidad de 16 arquetipos con venta de reporte premium vía MercadoPago.

- **Producción:** https://prisma-v2-six.vercel.app (proyecto Vercel `prisma-v2`)
- **Rama de producción: `master`** — la rama `main` es un sitio estático viejo, ignorala.

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind 4
- Supabase (`leads`, `purchases`, `contact_messages`)
- MercadoPago Checkout Pro v3 (preferencia server-side + webhook firmado HMAC-SHA256)
- NextAuth v5 con Google (gate del perfil gratuito + captura de leads)
- Google Analytics 4

> No se envía ningún email transaccional. La entrega del reporte es 100% por
> link: redirect post-pago + página de recuperación `/recuperar`.

## Flujo del usuario

1. Landing `/` → test de 16 preguntas en `/test` (4 ejes, scoring ponderado en `lib/scoring.ts`)
2. Resultado gratuito en `/r/[code]` (ej. `/r/ISLP`) — login con Google desbloquea el perfil extendido y registra el lead
3. Compra del reporte premium en `/reporte/[code]` → MercadoPago Checkout Pro
4. Vuelta de MP a `/reporte/[code]/exito?payment_id=…` → se verifica el pago contra la API de MP y se redirige a
5. `/reporte/[code]/ver?token=…` — el access token (único por compra) es el acceso permanente al reporte. El webhook (`/api/webhook/mp`) registra el pago en paralelo (sin enviar emails).
6. Si el comprador pierde el link: `/recuperar` — reingresa con su número de operación de MP + el email con el que pagó. También cubre pagos en efectivo acreditados más tarde.

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
- Las APIs públicas (`/api/checkout`, `/api/lead`, `/api/contact`, `/api/garantia`, `/api/recuperar`)
  y la página `/exito` tienen rate limiting por IP (`lib/rateLimit.ts`). Con
  `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` seteadas el límite es global (Upstash via
  REST); sin ellas usa un fallback in-memory por instancia. Ante un error de Upstash, falla abierto.
- `/api/lead` toma email y nombre de la sesión NextAuth del servidor, nunca del body.
- `/api/garantia`: el comprador pide la garantía con su access token; la solicitud queda en
  `contact_messages` (source `prisma-garantia`) con las horas transcurridas desde la compra para
  evaluar caso por caso. No hay reembolso automático.
- `/api/recuperar` exige número de operación de MP **y** el email del pagador (verificado contra la
  API de MP); nunca revela cuál de los dos datos falló.

## Scripts

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint`
- `npm test` — unit tests del scoring (vitest, `tests/scoring.test.ts`)
- `scripts/generate-premium.mjs` — generador del contenido premium
