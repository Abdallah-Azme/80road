import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { Providers } from '@/lib/providers';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {/* Mobile viewport shell */}
      <div
        className="relative mx-auto w-full max-w-[430px] min-h-screen bg-background sm:rounded-[40px] sm:shadow-2xl overflow-hidden"
      >
        <AppHeader title="80road" />

        <main
          className="absolute left-0 right-0 overflow-y-auto overflow-x-hidden no-scrollbar"
          style={{
            top: 'var(--header-h, 56px)',
            bottom: 'var(--tab-h, 60px)',
          }}
        >
          {children}
        </main>

        <BottomNav />
      </div>
    </Providers>
  );
}
