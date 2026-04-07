'use client';

import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/lib/types';
import { fetchBlogs } from '../services/blogs.service';

export function useBlogs(currentPage: number = 1) {
  return useQuery({
    queryKey: [...QUERY_KEYS.blogs.all, currentPage],
    queryFn: () => fetchBlogs(currentPage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

