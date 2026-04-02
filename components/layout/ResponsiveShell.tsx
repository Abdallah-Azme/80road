import { DesktopHeader } from './DesktopHeader';
import { BottomNav } from '@/components/BottomNav';
import { AppHeader } from '@/components/AppHeader';

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
    <>
      {/* ── Desktop navigation (hidden on mobile) ── */}
      <DesktopHeader />

      {/* ═══════════════════════════════════════════
          MOBILE shell  (<md) vs DESKTOP container
         ═══════════════════════════════════════════ */}
      <div
        className={[
          // Mobile: centered phone shell
          'relative mx-auto w-full max-w-[430px] min-h-screen bg-background',
          'sm:rounded-[40px] sm:shadow-2xl overflow-hidden',
          // Desktop: full-width, no phone shell constraints, clear overflow to prevent x-scroll
          'md:max-w-none md:rounded-none md:shadow-none md:overflow-x-hidden md:min-h-0',
        ].join(' ')}
      >
        {/* Mobile-only top header */}
        <div className="md:hidden">
          <AppHeader title={title} showBack={showBack} />
        </div>

        {/* ── Main scrollable area ── */}
        <main
          className={[
            // Mobile: absolute positioned between header + bottom nav
            'absolute left-0 right-0 overflow-y-auto no-scrollbar',
            // Desktop: static flow, padding top for the header
            'md:static md:overflow-visible md:pt-[72px] md:pb-12',
          ].join(' ')}
          style={{
            // These are only effective on mobile because md:static overrides absolute
            top: 'var(--header-h, 56px)',
            bottom: 'var(--tab-h, 60px)',
          }}
        >
          {/* Main content wrapper adhering to The Container Rule */}
          <div className="md:container md:mx-auto md:px-4 lg:px-8">
            {children}
          </div>
        </main>

        {/* Mobile-only bottom nav */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </>
  );
}
