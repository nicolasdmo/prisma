import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/components/Providers';
import ContactButton from '@/components/ContactButton';
import CookieNotice from '@/components/CookieNotice';
import { SITE_URL } from '@/lib/config';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const instrumentSerif = Instrument_Serif({
  variable: '--font-serif',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'PRISMA — Hay 16 arquetipos. Solo uno sos vos.',
  description:
    '16 preguntas honestas. 2 minutos. El arquetipo que ya intuías que eras, descrito sin vueltas.',
  openGraph: {
    title: 'PRISMA — Hay 16 arquetipos. Solo uno sos vos.',
    description: '16 preguntas. 2 minutos. El que sos.',
    type: 'website',
    // og:image lo provee app/opengraph-image.tsx (1200×630, dinámico).
  },
  twitter: {
    card:        'summary_large_image',
    title:       'PRISMA — Hay 16 arquetipos. Solo uno sos vos.',
    description: '16 preguntas. 2 minutos. El que sos.',
    // twitter:image también usa app/opengraph-image.tsx como fallback (1200×630).
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
        <ContactButton />
        <CookieNotice />
        <Analytics />
        <SpeedInsights />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-47KBVB1F4L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-47KBVB1F4L');
        `}</Script>
      </body>
    </html>
  );
}
