'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchListingById } from '../services/listing-detail.service';

export function useListing(id: number) {
  return useQuery({
    queryKey: QUERY_KEYS.listings.detail(id),
    queryFn: () => fetchListingById(id),
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
  });
}
