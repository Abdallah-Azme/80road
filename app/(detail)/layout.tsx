/**
 * (detail) route group layout
 * Covers: /ad/[id] and /profile/[id]
 *
 * These pages are full-screen overlays with their own floating
 * headers — they must NOT inherit the (app) shell's BottomNav
 * or AppHeader. We only provide the QueryClient Providers here.
 */
import { Providers } from '@/lib/providers';

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="relative mx-auto w-full max-w-[430px] min-h-screen bg-background sm:rounded-[40px] sm:shadow-2xl overflow-hidden">
        {children}
      </div>
    </Providers>
  );
}
