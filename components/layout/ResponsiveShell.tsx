import { DesktopHeader } from './DesktopHeader';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';
import { Footer } from './Footer';
import { cn } from '@/lib/utils';

interface ResponsiveShellProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

/**
 * ResponsiveShell (Top Nav Paradigm)
 *
 * Mobile  (<md)  → AppHeader + BottomNav (phone shell).
 * Desktop (≥md)  → Full-width top header, content centered in container mx-auto px-4 md:px-8.
 */
export function ResponsiveShell({
  children,
  title = '80road',
  showBack = false,
}: ResponsiveShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* ── Desktop navigation (hidden on mobile) ── */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ── Mobile-only top header (hidden on desktop) ── */}
      <div className="md:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <AppHeader title={title} showBack={showBack} />
      </div>

      {/* ── Main Content Area ── */}
      <main
        className={cn(
          "flex-1 relative w-full",
          // Desktop: padding top for fixed header
          "md:pt-[72px]",
          // Mobile: padding bottom for fixed nav
          "pb-20 md:pb-0"
        )}
      >
        {children}
      </main>

      {/* ── Global Footer ── */}
      <Footer />

      {/* ── Mobile-only bottom nav (hidden on desktop) ── */}
      <div className={cn(
        "md:hidden fixed bottom-1/2 translate-y-1/2 pointer-events-none z-0", // anchor point
        "md:relative md:inset-0 md:translate-y-0"
      )}>
        {/* Placeholder to reserve space if needed, though BottomNav is fixed */}
      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
