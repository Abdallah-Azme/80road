'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchExploreFeed } from '../services/explore.service';
import { ExploreFilters } from '../types';

export function useExploreListings(filters?: ExploreFilters) {
  return useQuery({
    queryKey: filters ? [...QUERY_KEYS.listings.explore, filters] : QUERY_KEYS.listings.explore,
    queryFn: () => fetchExploreFeed(filters),
    staleTime: 5 * 60 * 1000,
  });
}
