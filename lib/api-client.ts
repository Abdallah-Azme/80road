import { ofetch, type FetchOptions } from 'ofetch';

/**
 * Base API URL from environment variables.
 * Defaults to the production URL if not set.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://portal.road-80.com/api';

/**
 * Create a specialized instance of ofetch with default configurations.
 */
export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  async onResponseError({ response }) {
    const status = response.status;
    const data = response._data;
    console.error(`[API Error] ${status}:`, data);
  },
});

/**
 * Enhanced API client with common HTTP methods for better DX.
 */
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
