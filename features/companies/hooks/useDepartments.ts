import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchDepartments } from '../services/offices.service';

export function useDepartments() {
  return useQuery({
    queryKey: QUERY_KEYS.offices.departments,
    queryFn: fetchDepartments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
