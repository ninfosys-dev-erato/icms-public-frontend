import { useQuery } from '@tanstack/react-query'
import { noticeService } from '../services/NoticeService'
import { NoticeQuery } from '../types'

// Query keys for notices
export const noticeKeys = {
  all: ['notices'] as const,
  homepage: () => [...noticeKeys.all, 'homepage'] as const,
  notices: (query: NoticeQuery) => [...noticeKeys.all, 'notices', query] as const,
  allNotices: (page: number, limit: number) => [...noticeKeys.all, 'allNotices', page, limit] as const,
}

// Hook for homepage notices
export const useHomepageNotices = (limit: number = 6) => {
  return useQuery({
    queryKey: noticeKeys.homepage(),
    queryFn: () => noticeService.getHomepageNotices(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for paginated notices
export const useNotices = (query: NoticeQuery) => {
  return useQuery({
    queryKey: noticeKeys.notices(query),
    queryFn: () => noticeService.getNotices(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for all notices (full notices page)
export const useAllNotices = (page: number = 1, limit: number = 20) => {
  console.log('🔍 useAllNotices: Hook called with page:', page, 'limit:', limit);
  
  return useQuery({
    queryKey: noticeKeys.allNotices(page, limit),
    queryFn: async () => {
      console.log('🔍 useAllNotices: Executing query function');
      const result = await noticeService.getAllNotices(page, limit);
      console.log('🔍 useAllNotices: Query result:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
