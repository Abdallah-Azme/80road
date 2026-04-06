import { ofetch, type FetchOptions } from 'ofetch';
import { authStorage } from '@/shared/utils/auth-storage';

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
      if (token) {
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${token}`);
        options.headers = headers;
      }
    } catch (error) {
      console.warn('[API Client] Request interceptor error:', error);
    }
  },
  async onResponseError({ response }) {
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
