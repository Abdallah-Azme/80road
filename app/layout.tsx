import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
import './globals.css';

import { Providers } from '@/lib/providers';
import { ResponsiveShell } from '@/components/layout/ResponsiveShell';
import { Toaster } from '@/components/ui/sonner';

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

export const metadata: Metadata = {
  title: {
    default: '80road – العقارات في الكويت',
    template: '%s | 80road',
  },
  description: 'منصة 80road المنصة الأولى للعقارات في الكويت. شقق، فلل، أراضي، مكاتب، والعديد من الفرص العقارية.',
  keywords: ['عقارات الكويت', 'شقق', 'فلل', '80road', 'عقار'],
  authors: [{ name: '80road Team' }],
  creator: '80road',
  publisher: '80road',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://80road.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={tajawal.variable}>
      <head>
        {/* Inline script to apply saved theme before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
             __html: `
              try {
                var t = JSON.parse(localStorage.getItem('road80_ui') || '{}').theme;
                if (t === 'dark') document.documentElement.classList.add('dark');
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <Providers>
          <ResponsiveShell>
            {children}
          </ResponsiveShell>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
