import type { Metadata } from 'next';
import { ARCHETYPES } from '@/data/archetypes';

interface Props {
  params: Promise<{ code: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code: rawCode } = await params;
  const code      = rawCode?.toUpperCase();
  const archetype = ARCHETYPES[code];

  if (!archetype) {
    return {
      title: 'PRISMA — Resultado',
      description: 'Descubrí tu arquetipo de personalidad.',
    };
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://prisma.vercel.app';
  const url  = `${base}/r/${code}`;

  return {
    title: `${archetype.name} — PRISMA`,
    description: `${archetype.tagline} Hacé el test y descubrí el tuyo.`,
    openGraph: {
      title: `Soy ${archetype.name} ${archetype.emoji}`,
      description: `${archetype.tagline} ¿Y vos?`,
      url,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Soy ${archetype.name} en PRISMA`,
      description: archetype.tagline,
    },
  };
}

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
