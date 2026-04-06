import { apiClient, api } from '@/lib/api-client';

export interface ProfileData {
  id: number;
  name: string;
  country_code: string;
  caption: string | null;
  image: string;
  total_ads_likes?: number;
  total_ads_watch?: number;
  total_active_ads?: number;
  first_login?: number | null;
}

export interface ProfileResponse {
  status: boolean;
  message: string;
  data: ProfileData;
  errors: unknown[];
}

export const profileService = {
  getProfile: () => api.get<ProfileResponse>('/profile'),
  
  updateProfile: (formData: FormData) => 
    apiClient<ProfileResponse>('/profile', {
      method: 'POST',
      body: formData,
      // Pass headers without Content-Type to let browser set it with boundary for FormData
      headers: {
        'Accept': 'application/json',
      }
    })
};
