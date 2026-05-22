import { notFound } from 'next/navigation';
import { ARCHETYPES, ARCHETYPE_CODES } from '@/data/archetypes';
import ResultClient from '@/components/ResultClient';

interface Props {
  params: Promise<{ code: string }>;
}

// Prerender all 16 archetype result pages at build time
export function generateStaticParams() {
  return ARCHETYPE_CODES.map((code) => ({ code }));
}

export default async function ResultPage({ params }: Props) {
  const { code } = await params;
  const archetype = ARCHETYPES[code?.toUpperCase()];
  if (!archetype) notFound();

  return <ResultClient code={archetype.code} />;
}
