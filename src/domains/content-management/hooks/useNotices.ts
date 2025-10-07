import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { NoticeService } from '../services/NoticeService'
import type { NoticeFilter, Notice, NoticeListResponse } from '@/models/notice'

// Query keys for consistent cache management
export const noticeKeys = {
  all: ['notices'] as const,
  lists: () => [...noticeKeys.all, 'list'] as const,
  list: (filters: NoticeFilter) => [...noticeKeys.lists(), filters] as const,
  details: () => [...noticeKeys.all, 'detail'] as const,
  detail: (slug: string) => [...noticeKeys.details(), slug] as const,
  recent: (limit: number) => [...noticeKeys.all, 'recent', limit] as const,
  popular: (limit: number) => [...noticeKeys.all, 'popular', limit] as const,
  archive: (yearBS: string, monthBS?: string) => [...noticeKeys.all, 'archive', yearBS, monthBS] as const,
  search: (query: string, filters?: Partial<NoticeFilter>) => [...noticeKeys.all, 'search', query, filters] as const,
  related: (id: string, limit: number) => [...noticeKeys.all, 'related', id, limit] as const,
  stats: () => [...noticeKeys.all, 'stats'] as const,
}

// Create a fallback service that returns mock data
const createFallbackService = () => ({
  getList: async () => ({ items: [], total: 0, page: 1, pageSize: 20, totalPages: 0, hasNext: false, hasPrev: false }),
  getDetail: async () => null,
  getById: async () => null,
  search: async () => ({ items: [], total: 0, page: 1, pageSize: 20, query: '', suggestions: [] }),
  getArchive: async () => [],
  getStats: async () => ({ total: 0, active: 0, expired: 0, drafts: 0 }),
  incrementDownloadCount: async () => {},
  getRelated: async () => [],
  getByCategory: async () => [],
  getByOffice: async () => [],
  getPopular: async () => [],
  getRecent: async () => [
    {
      id: "demo-1",
      slug: "latest-government-notice",
      title: "हालैका सरकारी सूचनाहरू",
      title_en: "Latest Government Notices", 
      summary: "सरकारी कार्यालयबाट जारी गरिएका महत्वपूर्ण सूचनाहरू",
      summary_en: "Important notices issued by government offices",
      content: "यहाँ पछिल्ला सरकारी सूचनाहरू देखाइनेछ।",
      content_en: "Recent government notices will be displayed here.",
      lang: "en" as const,
      referenceNo: "DEMO-001",
      type: "notice" as const,
      priority: "normal" as const,
      officeId: "office-1",
      adDate: new Date().toISOString().split('T')[0],
      bsDate: "2081-10-12",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ["demo", "tanstack"],
      categories: ["general"],
      attachments: [],
      permalink: "/notices/welcome-notice",
      isActive: true,
      viewCount: 42,
      downloadCount: 0,
      seo: {
        metaTitle: "Demo Notice",
        metaDescription: "TanStack Query demo notice",
        keywords: ["demo", "notice"]
      }
    }
  ],
  getUpcomingDeadlines: async () => [],
  getByDateRange: async () => []
})

// Use fallback service directly - no complex initialization needed
const getNoticeService = () => createFallbackService()

// Keep the old interface for backward compatibility (no-op)
export const initializeNoticeService = (service: any) => {
  console.log('Service initialization called - using fallback service for demo')
}

/**
 * Hook to fetch notice list with filters
 */
export const useNoticeList = (params: NoticeFilter) => {
  return useQuery({
    queryKey: noticeKeys.list(params),
    queryFn: () => getNoticeService().getList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Hook to fetch notice detail by slug
 */
export const useNoticeDetail = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: noticeKeys.detail(slug),
    queryFn: () => getNoticeService().getDetail(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    enabled: Boolean(slug) && enabled,
  })
}

/**
 * Hook to fetch recent notices
 */
export const useRecentNotices = (limit = 10) => {
  return useQuery({
    queryKey: noticeKeys.recent(limit),
    queryFn: () => getNoticeService().getRecent(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Disable retries to avoid potential issues for now
  })
}

/**
 * Hook to fetch popular notices
 */
export const usePopularNotices = (limit = 10) => {
  return useQuery({
    queryKey: noticeKeys.popular(limit),
    queryFn: () => getNoticeService().getPopular(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

/**
 * Hook to search notices
 */
export const useNoticeSearch = (query: string, filters?: Partial<NoticeFilter>, enabled = true) => {
  return useQuery({
    queryKey: noticeKeys.search(query, filters),
    queryFn: () => getNoticeService().search(query, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: Boolean(query.trim()) && enabled,
    retry: 2,
  })
}

/**
 * Hook to fetch archive notices
 */
export const useNoticeArchive = (yearBS: string, monthBS?: string) => {
  return useQuery({
    queryKey: noticeKeys.archive(yearBS, monthBS),
    queryFn: () => getNoticeService().getArchive(yearBS, monthBS),
    staleTime: 30 * 60 * 1000, // 30 minutes (archive data changes less frequently)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: Boolean(yearBS),
  })
}

/**
 * Hook to fetch notice statistics
 */
export const useNoticeStats = () => {
  return useQuery({
    queryKey: noticeKeys.stats(),
    queryFn: () => getNoticeService().getStats(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

/**
 * Hook to fetch related notices
 */
export const useRelatedNotices = (id: string, limit = 5, enabled = true) => {
  return useQuery({
    queryKey: noticeKeys.related(id, limit),
    queryFn: () => getNoticeService().getRelated(id, limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: Boolean(id) && enabled,
    retry: 2,
  })
}

/**
 * Hook to fetch notices by category
 */
export const useNoticesByCategory = (category: string, params?: Partial<NoticeFilter>) => {
  return useQuery({
    queryKey: [...noticeKeys.all, 'category', category, params],
    queryFn: () => getNoticeService().getByCategory(category, params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    enabled: Boolean(category),
    retry: 2,
  })
}

/**
 * Hook to fetch upcoming deadlines
 */
export const useUpcomingDeadlines = (days = 30) => {
  return useQuery({
    queryKey: [...noticeKeys.all, 'deadlines', days],
    queryFn: () => getNoticeService().getUpcomingDeadlines(days),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch notices by date range
 */
export const useNoticesByDateRange = (startDate: string, endDate: string, enabled = true) => {
  return useQuery({
    queryKey: [...noticeKeys.all, 'dateRange', startDate, endDate],
    queryFn: () => getNoticeService().getByDateRange(startDate, endDate),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: Boolean(startDate && endDate) && enabled,
    retry: 2,
  })
}

/**
 * Mutation to increment view count
 */
export const useIncrementNoticeView = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => getNoticeService().incrementDownloadCount(id),
    onSuccess: (_, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: noticeKeys.stats() })
      queryClient.invalidateQueries({ queryKey: noticeKeys.popular(10) })
    },
  })
}

/**
 * Mutation to increment download count
 */
export const useIncrementNoticeDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => getNoticeService().incrementDownloadCount(id),
    onSuccess: (_, id) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: noticeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: noticeKeys.stats() })
    },
  })
}

/**
 * Hook to invalidate notice caches
 */
export const useInvalidateNoticeCache = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: noticeKeys.all }),
    invalidateList: (filters?: NoticeFilter) => 
      filters 
        ? queryClient.invalidateQueries({ queryKey: noticeKeys.list(filters) })
        : queryClient.invalidateQueries({ queryKey: noticeKeys.lists() }),
    invalidateDetail: (slug: string) => queryClient.invalidateQueries({ queryKey: noticeKeys.detail(slug) }),
    invalidateRecent: () => queryClient.invalidateQueries({ queryKey: [...noticeKeys.all, 'recent'] }),
    invalidatePopular: () => queryClient.invalidateQueries({ queryKey: [...noticeKeys.all, 'popular'] }),
    invalidateStats: () => queryClient.invalidateQueries({ queryKey: noticeKeys.stats() }),
  }
}

/**
 * Hook to prefetch notice data
 */
export const usePrefetchNotice = () => {
  const queryClient = useQueryClient()

  return {
    prefetchDetail: (slug: string) => 
      queryClient.prefetchQuery({
        queryKey: noticeKeys.detail(slug),
        queryFn: () => getNoticeService().getDetail(slug),
        staleTime: 10 * 60 * 1000,
      }),
    prefetchRecent: (limit = 10) =>
      queryClient.prefetchQuery({
        queryKey: noticeKeys.recent(limit),
        queryFn: () => getNoticeService().getRecent(limit),
        staleTime: 3 * 60 * 1000,
      }),
  }
}