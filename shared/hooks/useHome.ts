import { useMutation, useQuery } from '@tanstack/react-query';
import { homeService, FilterHistoryPayload } from '../services/home.service';

export function useSaveFilterHistory() {
  return useMutation({
    mutationFn: (payload: FilterHistoryPayload) => homeService.saveFilterHistory(payload),
  });
}

export function useCategoriesAppearInFilter() {
  return useQuery({
    queryKey: ['categories-filter'],
    queryFn: () => homeService.getCategoriesAppearInFilter(),
  });
}
