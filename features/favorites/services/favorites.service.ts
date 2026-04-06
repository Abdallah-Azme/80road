import { api } from '@/lib/api-client';

export interface ToggleLikeResponse {
  status: boolean;
  message: string;
  data: unknown[];
  errors: unknown[];
}

export const favoritesService = {
  toggleLike: (id: number) => api.post<ToggleLikeResponse>(`/ad/${id}/toggle-like`),
};
