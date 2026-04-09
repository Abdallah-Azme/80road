import { useQuery } from '@tanstack/react-query';
import { settingsService, SiteSettings } from '../services/settings.service';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsService.getSettings();
      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch settings');
      }
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
