import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { ARCHETYPES } from '@/data/archetypes';
import { PREMIUM } from '@/data/premiumContent';
import ExitoClient from '@/components/ExitoClient';

interface Props {
  params:       Promise<{ code: string }>;
  searchParams: Promise<{ token?: string }>;
}

// Private, tokenized page — keep it out of search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface PurchaseRow {
  payment_id:     string;
  archetype:      string;
  payment_status: string;
  amount:         number | null;
  currency:       string | null;
}

export default async function VerReportePage({ params, searchParams }: Props) {
  const { code }  = await params;
  const { token } = await searchParams;

  const upper     = code?.toUpperCase();
  const archetype = ARCHETYPES[upper];
  const premium   = PREMIUM[upper];
  if (!archetype || !premium) notFound();
  if (!token) redirect(`/reporte/${upper}`);

  // Verify token in Supabase. The query runs inside try/catch, but the
  // redirect decision happens OUTSIDE — redirect() throws a control-flow
  // exception that must never be swallowed by a catch block.
  let purchase: PurchaseRow | null = null;
  let infraError = false;

  try {
    const supabase = getSupabaseAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('purchases')
      .select('payment_id, archetype, payment_status, amount, currency')
      .eq('access_token', token)
      .single();

    if (!error && data) purchase = data as PurchaseRow;
  } catch (err) {
    console.error('[ver] purchase lookup failed:', err);
    infraError = true;
  }

  if (infraError)                                redirect(`/reporte/${upper}?error=token`);
  if (!purchase)                                 redirect(`/reporte/${upper}?error=token`);
  if (purchase.payment_status !== 'approved')    redirect(`/reporte/${upper}?error=pago`);
  if (purchase.archetype !== upper)              redirect(`/reporte/${upper}?error=token`);

  return (
    <ExitoClient
      code={upper}
      paymentId={purchase.payment_id}
      premium={premium}
      amount={purchase.amount ?? 0}
      currency={purchase.currency ?? 'ARS'}
    />
  );
}
