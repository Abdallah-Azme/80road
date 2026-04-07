import api from '@/lib/api-client';

export interface ToggleLikeResponse {
  status: boolean;
  message: string;
}

export const listingService = {
  toggleLike: async (id: number): Promise<ToggleLikeResponse> => {
    return api.post<ToggleLikeResponse>(`/ad/${id}/toggle-like`);
  }
};
