-- Run this in Supabase SQL Editor
-- Creates the purchases table for paid reports.
-- Column names MUST match lib/processPayment.ts and app/reporte/[code]/ver/page.tsx.

CREATE TABLE IF NOT EXISTS purchases (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_email    TEXT        NOT NULL,
  buyer_name     TEXT,
  archetype      TEXT        NOT NULL,
  payment_id     TEXT        UNIQUE NOT NULL,
  payment_status TEXT        DEFAULT 'approved',
  amount         NUMERIC,
  currency       TEXT        DEFAULT 'ARS',
  product_type   TEXT        NOT NULL DEFAULT 'prisma_report',
  access_token   TEXT        UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  email_sent     BOOLEAN     DEFAULT FALSE, -- legacy: ya no se envian emails, columna sin uso

  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS purchases_email_idx        ON purchases(buyer_email);
CREATE INDEX IF NOT EXISTS purchases_access_token_idx ON purchases(access_token);
CREATE INDEX IF NOT EXISTS purchases_payment_id_idx   ON purchases(payment_id);

-- RLS: only service role can read/write (webhook uses service key)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- No public access — all access goes through server-side API
CREATE POLICY "No public access" ON purchases FOR ALL TO anon USING (false);
