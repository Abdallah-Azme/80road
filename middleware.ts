import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware to handle cross-platform route protection.
 * Leverages the 'auth_token' cookie set by our authStorage utility.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 🛡️ Definition of Route Categories
  const isAuthPage = pathname === '/auth' || pathname === '/otp';
  const isPrivatePage = pathname.startsWith('/quick-start') || 
                        pathname.startsWith('/profile') || 
                        pathname.startsWith('/post-ad');

  // 1️⃣ Case: User is Authenticated but trying to access Login/OTP pages
  // Expected Behavior: Redirect to Home to prevent double login
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2️⃣ Case: User is NOT Authenticated but trying to access Private pages
  // Expected Behavior: Redirect to Login
  if (!token && isPrivatePage) {
    // Save current pathname to redirect back after login if needed
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

/**
 * Matcher configuration for performance.
 * We only run middleware on relevant application routes.
 */
export const config = {
  matcher: [
    /*
     * 1. Match all application routes except assets/internal Next.js paths.
     * 2. Specifically monitoring auth flow and core protected app paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};
