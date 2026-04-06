import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error: unknown) => {
        if (typeof window !== 'undefined') {
          const err = error as { data?: { message?: string }; message?: string; [key: string]: unknown };
          const message = err?.data?.message || err?.message || 'Unexpected error occurred.';
          toast.error(`API Error: ${message}`, {
             description: 'Please try again later or contact support.',
          });
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error: unknown) => {
        if (typeof window !== 'undefined') {
          const err = error as { data?: { message?: string }; message?: string; [key: string]: unknown };
          const message = err?.data?.message || err?.message || 'Unexpected error occurred.';
          toast.error(`Error: ${message}`, {
            id: 'mutation-error', // Prevent duplicate toast for same mutation
          });
        }
      },
    }),
    defaultOptions: {
      queries: {
        // On the server, we never want to refetch stale data
        staleTime: 60 * 1000, // 1 minute
        // Disable retries on the server to keep streaming fast
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a singleton QueryClient on the browser,
 * and a fresh one on the server (per-request).
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always a new client so no shared state between requests
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
