import { notFound } from 'next/navigation';
import { ARCHETYPES } from '@/data/archetypes';
import ResultClient from '@/components/ResultClient';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { code } = await params;
  const archetype = ARCHETYPES[code?.toUpperCase()];
  if (!archetype) notFound();

  return <ResultClient code={archetype.code} />;
}
