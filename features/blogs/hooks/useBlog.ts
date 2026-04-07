'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchBlogById } from '../services/blogs.service';

export function useBlog(id: number | string) {
  return useQuery({
    queryKey: QUERY_KEYS.blogs.detail(id),
    queryFn: () => fetchBlogById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
