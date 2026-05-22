'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Archetype } from '@/data/archetypes';

interface ShareCardProps {
  archetype: Archetype;
}

export default function ShareCard({ archetype }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `prisma-${archetype.code.toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `prisma-${archetype.code.toLowerCase()}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `Soy ${archetype.name}`, text: archetype.tagline });
        return;
      }
    } catch {/* fallback */}
    // Fallback: copy URL
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    alert('Link copiado al portapapeles');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center gap-4"
    >
      {/* The card that gets exported */}
      <div
        ref={cardRef}
        style={{ backgroundColor: archetype.color }}
        className="w-72 h-72 sm:w-80 sm:h-80 rounded-lg flex flex-col items-start justify-end p-7 relative overflow-hidden select-none"
      >
        {/* Background texture lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border-white"
              style={{
                width: '200%',
                height: '1px',
                borderTopWidth: '1px',
                top: `${i * 14}%`,
                left: '-50%',
                transform: 'rotate(-20deg)',
              }}
            />
          ))}
        </div>

        {/* Emoji */}
        <span className="text-4xl mb-3 relative z-10">{archetype.emoji}</span>

        {/* Content */}
        <div className="relative z-10">
          <p
            className="text-white text-xs font-mono tracking-[0.2em] uppercase opacity-70 mb-1"
          >
            PRISMA · {archetype.code}
          </p>
          <h3
            className="text-white text-2xl leading-tight mb-1"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {archetype.name}
          </h3>
          <p className="text-white text-sm opacity-80 leading-snug max-w-[220px]">
            {archetype.tagline}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-ink text-bg-card px-5 py-2.5 rounded-pill font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {downloading ? '…' : '↓ Descargar'}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 border border-line text-ink px-5 py-2.5 rounded-pill font-mono text-xs tracking-widest uppercase hover:bg-bg-elev transition-colors"
        >
          Compartir
        </button>
      </div>
    </motion.div>
  );
}
