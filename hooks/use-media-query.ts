'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true when the viewport matches the given CSS media query.
 * Defaults to false on the server / first paint to avoid hydration mismatch.
 * Lint-safe: state is initialised synchronously from a factory, not inside the effect body.
 */
export function useMediaQuery(query: string): boolean {
  // Lazy initialiser runs once on mount (client only) — no setState inside the effect
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
