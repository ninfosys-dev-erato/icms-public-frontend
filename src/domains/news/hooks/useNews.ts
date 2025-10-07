"use client";

import { useQuery } from '@tanstack/react-query';
import { newsService } from '../services/news-service';

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: () => newsService.getNews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}