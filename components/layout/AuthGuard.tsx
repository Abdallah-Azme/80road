'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authStorage } from '@/shared/utils/auth-storage';

/**
 * AuthGuard — Client-side Authentication Route Guard
 *
 * WHY THIS EXISTS:
 * Next.js Middleware only runs on the Edge runtime (server-side).
 * In a static export (output: 'export') for Capacitor/mobile builds,
 * middleware is NEVER executed — files are served statically.
 *
 * This component replicates the middleware logic on the client:
 * - If no auth token → redirect to /auth
 * - If token present on auth routes → redirect to /
 *
 * It MUST wrap all protected routes.
 *
 * NOTE: For the web (standalone) deployment, the middleware.ts file
 * continues to handle server-side route protection as the primary guard.
 * This component is a secondary safety net that works on both platforms.
 */

const PUBLIC_ROUTES = ['/auth', '/otp'];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const token = await authStorage.getToken();
        if (cancelled) return;

        const onPublicRoute = isPublicRoute(pathname);

        if (token && onPublicRoute) {
          // Already logged in — keep them out of auth screens
          router.replace('/');
          return;
        }

        if (!token && !onPublicRoute) {
          // Not logged in — redirect to auth with a callback URL
          const callbackUrl = encodeURIComponent(pathname);
          router.replace(`/auth?callbackUrl=${callbackUrl}`);
          return;
        }

        // Access is allowed
        setIsAuthorized(true);
      } catch (error) {
        console.error('[AuthGuard] Token check failed:', error);
        // On error, fail-safe to auth page
        router.replace('/auth');
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    };

    setIsChecking(true);
    setIsAuthorized(false);
    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  // While checking auth status, render nothing to avoid flash of protected content.
  // The parent layout's loading.tsx handles any loading skeleton.
  if (isChecking) return null;
  if (!isAuthorized) return null;

  return <>{children}</>;
}
