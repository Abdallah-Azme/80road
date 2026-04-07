import { Preferences } from '@capacitor/preferences';
import Cookies from 'js-cookie';
import { Capacitor } from '@capacitor/core';

export const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Unified storage utility for authentication tokens.
 * Works seamlessly across Web and Capacitor (Native Mobile) platforms.
 */
export const authStorage = {
  /**
   * Saves the auth token to all applicable storage layers.
   */
  async setToken(token: string) {
    if (!token) return;

    try {
      // 1. Cookies: Primarily for Middleware and Server-Side rendering.
      // Next.js middleware relies on cookies to protect routes.
      Cookies.set(AUTH_TOKEN_KEY, token, { 
        expires: 999, // 999 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/' 
      });

      // 2. LocalStorage: Browser fallback for client-side legacy usage.
      if (Capacitor.getPlatform() === 'web' && typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      }

      // 3. Capacitor Preferences: Persistent storage for Native Mobile apps.
      // This is the most reliable way to persist data on Android/iOS.
      await Preferences.set({ key: AUTH_TOKEN_KEY, value: token });
    } catch (error) {
      console.error('Error during setToken:', error);
    }
  },

  /**
   * Retrieves the auth token from the most reliable available source.
   */
  async getToken(): Promise<string | null> {
    try {
      // 🕵️ Check if we're on the Server (Next.js Node.js runtime)
      if (typeof window === 'undefined') {
        try {
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          return cookieStore.get(AUTH_TOKEN_KEY)?.value || null;
        } catch {
          // If we're on server but not in a request context, cookies() might throw
          console.warn('[authStorage] Server getToken called outside of request context');
          return null;
        }
      }

      // 🕵️ We're on the Client (Browser or Capacitor Native)
      
      // Try Capacitor Storage first for Native Mobile persistency
      if (Capacitor.isNativePlatform()) {
        const { value } = await Preferences.get({ key: AUTH_TOKEN_KEY });
        if (value) return value;
      }

      // Fallback for Web Cookies
      const cookieToken = Cookies.get(AUTH_TOKEN_KEY);
      if (cookieToken) return cookieToken;

      // Final fallback for LocalStorage
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error during getToken:', error);
      return null;
    }
  },

  /**
   * Clears the auth token from all storage layers.
   */
  async removeToken() {
    try {
      Cookies.remove(AUTH_TOKEN_KEY, { path: '/' });
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
      await Preferences.remove({ key: AUTH_TOKEN_KEY });
    } catch (error) {
      console.error('Error during removeToken:', error);
    }
  }
};
