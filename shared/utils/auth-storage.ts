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
        expires: 30, // 30 days
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
      // Try Capacitor Storage first as it's the primary source for mobile
      const { value } = await Preferences.get({ key: AUTH_TOKEN_KEY });
      if (value) return value;

      // Fallback for Web/Server
      const cookieToken = Cookies.get(AUTH_TOKEN_KEY);
      if (cookieToken) return cookieToken;

      const localToken = typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      return localToken;
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
