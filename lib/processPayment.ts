import { MercadoPagoConfig, Payment } from 'mercadopago';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';

export interface PaymentResult {
  email:           string;
  name:            string;
  archetypeCode:   string;
  accessToken:     string;
  amount:          number;
  currency:        string;
  paymentId:       string;
  /** true = record already existed (idempotent re-call) */
  alreadyExisted:  boolean;
}

/**
 * Verifies a MercadoPago payment and upserts the purchase record.
 * Idempotent — same payment_id always returns the same access_token.
 * Returns null when the payment is not approved or data is missing.
 * Throws only on infrastructure errors (MP API down, DB insert fails).
 */
export async function processApprovedPayment(paymentId: string): Promise<PaymentResult | null> {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error('MP_ACCESS_TOKEN not configured');

  // ── Verify the payment with MP ────────────────────────────────
  const client  = new MercadoPagoConfig({ accessToken });
  const payment = new Payment(client);
  const data    = await payment.get({ id: paymentId });

  if (data.status !== 'approved') return null;

  const email         = data.payer?.email ?? '';
  const name          = data.payer?.first_name ?? '';
  const archetypeCode = (data.external_reference ?? '').toUpperCase();
  const amount        = data.transaction_amount ?? 0;
  const currency      = data.currency_id ?? 'ARS';

  if (!email || !archetypeCode || !ARCHETYPES[archetypeCode]) return null;

  // ── Idempotent upsert into purchases ──────────────────────────
  const supabase = getSupabaseAdmin();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from('purchases')
    .select('access_token')
    .eq('payment_id', paymentId)
    .maybeSingle();

  if (existing) {
    return {
      email, name, archetypeCode, amount, currency, paymentId,
      accessToken:    (existing as { access_token: string }).access_token,
      alreadyExisted: true,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: inserted, error } = await (supabase as any)
    .from('purchases')
    .insert({
      email,
      name,
      archetype_code: archetypeCode,
      payment_id:     paymentId,
      payment_status: 'approved',
      amount,
      currency,
    })
    .select('access_token')
    .single();

  if (error) throw new Error(`Supabase insert failed: ${error.message}`);

  return {
    email, name, archetypeCode, amount, currency, paymentId,
    accessToken:    (inserted as { access_token: string }).access_token,
    alreadyExisted: false,
  };
}
