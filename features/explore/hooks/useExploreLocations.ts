import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api-client';

export interface State {
  id: number;
  name: string;
}

export async function fetchStates(countryId: number = 1): Promise<State[]> {
  try {
    const response = await api.get<{ status: boolean; data: State[] }>(`/countries/${countryId}/states`);
    if (response.status) return response.data;
    return [];
  } catch (error) {
    console.error('[Explore Locations] Error fetching states:', error);
    return [];
  }
}

export function useExploreStates(countryId: number = 1) {
  return useQuery({
    queryKey: ['states', countryId],
    queryFn: () => fetchStates(countryId),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
