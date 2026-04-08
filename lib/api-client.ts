import { ofetch, type FetchOptions } from 'ofetch';
import { authStorage } from '@/shared/utils/auth-storage';
import { useUserStore } from '@/stores/user.store';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portal.road-80.com/api';

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  async onRequest({ options }) {
    try {
      const token = await authStorage.getToken();
      
      const headers = new Headers(options.headers);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      // If we are sending FormData, we MUST NOT set the Content-Type header manually.
      // The browser will automatically set it to multipart/form-data with the correct boundary.
      if (options.body instanceof FormData) {
        headers.delete('Content-Type');
      }
      
      options.headers = headers;
    } catch (error) {
      console.warn('[API Client] Request interceptor error:', error);
    }
  },
  async onResponseError({ response }) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        if (process.env.NODE_ENV === 'development') {
          console.log('[API Client] 401 Unauthorized detected. Redirecting to login...');
        }
        
        // Clear session and tokens
        useUserStore.getState().logout();

        // Redirect to /auth with callbackUrl, avoiding loops
        if (!window.location.pathname.startsWith('/auth')) {
          const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/auth?callbackUrl=${callbackUrl}`;
        }
      }
    }
    console.error(`[API Error] ${response.status}:`, response._data);
  },
});

export const api = {
  get: <T = unknown>(url: string, options?: FetchOptions<'json'>) =>
    apiClient<T>(url, { ...options, method: 'GET' }),

  post: <T = unknown>(url: string, body?: unknown, options?: FetchOptions<'json'>) =>
    apiClient<T>(url, { ...options, method: 'POST', body: body as Record<string, unknown> }),

  put: <T = unknown>(url: string, body?: unknown, options?: FetchOptions<'json'>) =>
    apiClient<T>(url, { ...options, method: 'PUT', body: body as Record<string, unknown> }),

  patch: <T = unknown>(url: string, body?: unknown, options?: FetchOptions<'json'>) =>
    apiClient<T>(url, { ...options, method: 'PATCH', body: body as Record<string, unknown> }),

  delete: <T = unknown>(url: string, options?: FetchOptions<'json'>) =>
    apiClient<T>(url, { ...options, method: 'DELETE' }),
};

export default api;
