import { Providers } from '@/lib/providers';
import { ResponsiveShell } from '@/components/layout/ResponsiveShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ResponsiveShell>
        {children}
      </ResponsiveShell>
    </Providers>
  );
}
