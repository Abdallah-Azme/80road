'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchHomeListings } from '../services/listings.service';

export function useHomeListings() {
  return useQuery({
    queryKey: QUERY_KEYS.listings.all,
    queryFn: fetchHomeListings,
    staleTime: 60 * 1000,
  });
}
