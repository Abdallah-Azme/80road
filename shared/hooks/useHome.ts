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

export function useHomeData() {
  return useQuery({
    queryKey: ['home-data'],
    queryFn: () => homeService.getHomeData(),
  });
}

export function useAdsByHistory() {
  return useQuery({
    queryKey: ['ads-by-history'],
    queryFn: () => homeService.getAdsByHistory(),
    staleTime: 5 * 60 * 1000,
  });
}
