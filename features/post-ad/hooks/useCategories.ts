import { useQuery } from '@tanstack/react-query';
import { postAdService } from '../services/post-ad.service';

export function useCategories() {
  return useQuery({
    queryKey: ['post-ad-categories'],
    queryFn: () => postAdService.getCategories(),
  });
}
