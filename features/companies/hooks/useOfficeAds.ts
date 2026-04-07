import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchOfficeAds } from '../services/offices.service';

export function useOfficeAds(id: string | number) {
  return useQuery({
    queryKey: QUERY_KEYS.offices.ads(id),
    queryFn: () => fetchOfficeAds(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
