'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from './query-client';
import { DirectionProvider } from '@radix-ui/react-direction';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <DirectionProvider dir="rtl">
      <QueryClientProvider client={queryClient}>
        {children}
        {/* process.env.NODE_ENV is replaced at build time by Next.js bundler.
            In production builds (NODE_ENV=production), the entire block is
            dead-code-eliminated by the bundler — ReactQueryDevtools is never
            included in the production bundle. */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </DirectionProvider>
  );
}
