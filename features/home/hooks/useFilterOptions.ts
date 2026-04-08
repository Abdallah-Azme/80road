import { useQuery } from '@tanstack/react-query';
import { fetchFilterOptions } from '../services/home.service';

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: fetchFilterOptions,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
