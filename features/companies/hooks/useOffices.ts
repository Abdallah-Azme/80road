'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchOffices, fetchOfficeById } from '../services/offices.service';

export function useOffices() {
  return useQuery({
    queryKey: QUERY_KEYS.offices.all,
    queryFn: fetchOffices,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOffice(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.offices.detail(id),
    queryFn: () => fetchOfficeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
