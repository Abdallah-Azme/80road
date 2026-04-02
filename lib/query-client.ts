import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
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
