import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy (formerly Middleware) — Global Authentication Guard.
 *
 * Strategy: DENY-by-default.
 * - /auth and /otp are the ONLY public routes.
 * - Every other route requires a valid `auth_token` cookie.
 * - The cookie is written by `authStorage.setToken()` after OTP verification.
 *
 * NOTE: This proxy only runs in the web (standalone/server) deployment.
 * In Capacitor (static export) builds, the client-side AuthGuard component
 * in components/layout/AuthGuard.tsx replicates this logic.
 *
 * Renamed from middleware.ts → proxy.ts per Next.js v16 convention.
 * See: https://nextjs.org/docs/messages/middleware-to-proxy
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // ✅ Public routes — no token required
  const isPublicRoute = pathname.startsWith('/auth') || pathname.startsWith('/otp');

  // 1️⃣ Already authenticated → keep them out of auth pages
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2️⃣ Not authenticated → redirect every protected page to /auth
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/auth', request.url);
    // Preserve the intended destination so we can redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Run proxy on every route except Next.js internals and static assets.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     * - assets (assets folder)
     * - icons (icons folder)
     * - images (images folder)
     * - logo (logo files)
     * Or any file with a common extension: webp, png, jpg, jpeg, svg, gif
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico|public|assets|icons|images|.*\\.(?:webp|png|jpg|jpeg|svg|gif)).*)',
  ],
};
