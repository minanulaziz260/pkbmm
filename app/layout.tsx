import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// Font sans-serif modern yang mudah dibaca (Plus Jakarta Sans)
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Portal Belajar Paket C',
  description:
    'Platform pembelajaran online interaktif untuk siswa Paket C (setara SMA). Belajar mandiri, fleksibel, dan menyenangkan.',
  keywords: ['Paket C', 'LMS', 'Belajar Online', 'Kesetaraan', 'SMA'],
  authors: [{ name: 'PKBM M' }],
  openGraph: {
    title: 'Portal Belajar Paket C',
    description: 'Platform LMS interaktif untuk siswa Paket C.',
    type: 'website',
    locale: 'id_ID',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
