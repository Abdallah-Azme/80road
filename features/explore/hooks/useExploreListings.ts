'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchExploreListings } from '@/features/listing-detail/services/listing-detail.service';

export function useExploreListings() {
  return useQuery({
    queryKey: QUERY_KEYS.listings.explore,
    queryFn: fetchExploreListings,
    staleTime: 5 * 60 * 1000,
  });
}
