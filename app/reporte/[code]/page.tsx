import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ARCHETYPES, ARCHETYPE_CODES } from '@/data/archetypes';
import { PREMIUM } from '@/data/premiumContent';
import ReporteClient from '@/components/ReporteClient';

interface Props {
  params: Promise<{ code: string }>;
}

// Prerender all 16 archetype report pages at build time
export function generateStaticParams() {
  return ARCHETYPE_CODES.map((code) => ({ code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const archetype = ARCHETYPES[code?.toUpperCase()];
  if (!archetype) return {};
  return {
    title: `Reporte completo · ${archetype.name} (${archetype.code}) — PRISMA`,
    description: `Análisis profundo, guía de carrera, lectura de sombra y plan de acción para el arquetipo ${archetype.name}.`,
  };
}

export default async function ReportePage({ params }: Props) {
  const { code } = await params;
  const upper = code?.toUpperCase();
  const archetype = ARCHETYPES[upper];
  const premium   = PREMIUM[upper];
  if (!archetype || !premium) notFound();

  return <ReporteClient code={upper} />;
}
