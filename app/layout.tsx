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
  title: '80road – العقارات في الكويت',
  description: 'منصة 80road للعقارات في الكويت',
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
