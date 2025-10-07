import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ContentRepository } from '../repositories/ContentRepository'
import type { ContentQuery, ContentResponse, Category, FAQQuery, FAQResponse } from '@/models'

// Query keys for consistent cache management
export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  list: (query: ContentQuery) => [...contentKeys.lists(), query] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (slug: string) => [...contentKeys.details(), slug] as const,
  featured: () => [...contentKeys.all, 'featured'] as const,
  search: (query: string, filters?: Omit<ContentQuery, 'search'>) => [...contentKeys.all, 'search', query, filters] as const,
  category: (categorySlug: string, query?: Omit<ContentQuery, 'category'>) => [...contentKeys.all, 'category', categorySlug, query] as const,
  attachments: (contentId: string) => [...contentKeys.all, 'attachments', contentId] as const,
}

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  tree: () => [...categoryKeys.all, 'tree'] as const,
  active: () => [...categoryKeys.all, 'active'] as const,
  detail: (slug: string) => [...categoryKeys.all, 'detail', slug] as const,
}

export const faqKeys = {
  all: ['faq'] as const,
  lists: () => [...faqKeys.all, 'list'] as const,
  list: (query: FAQQuery) => [...faqKeys.lists(), query] as const,
  search: (query: string, filters?: Omit<FAQQuery, 'search'>) => [...faqKeys.all, 'search', query, filters] as const,
  random: (limit: number) => [...faqKeys.all, 'random', limit] as const,
  popular: (limit: number) => [...faqKeys.all, 'popular', limit] as const,
  active: () => [...faqKeys.all, 'active'] as const,
  detail: (id: string) => [...faqKeys.all, 'detail', id] as const,
}

// Repository instance
const contentRepository = new ContentRepository()

// Content hooks
/**
 * Hook to fetch all content with optional query parameters
 */
export const useContentList = (query?: ContentQuery) => {
  return useQuery({
    queryKey: contentKeys.list(query || {}),
    queryFn: () => contentRepository.getAllContent(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Hook to fetch featured content
 */
export const useFeaturedContent = () => {
  return useQuery({
    queryKey: contentKeys.featured(),
    queryFn: () => contentRepository.getFeaturedContent(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
  })
}

/**
 * Hook to search content
 */
export const useContentSearch = (searchTerm: string, query?: Omit<ContentQuery, 'search'>, enabled = true) => {
  return useQuery({
    queryKey: contentKeys.search(searchTerm, query),
    queryFn: () => contentRepository.searchContent(searchTerm, query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: Boolean(searchTerm.trim()) && enabled,
    retry: 2,
  })
}

/**
 * Hook to fetch content detail by slug
 */
export const useContentDetail = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: contentKeys.detail(slug),
    queryFn: () => contentRepository.getContentBySlug(slug),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: Boolean(slug) && enabled,
    retry: 3,
  })
}

/**
 * Hook to fetch content by category
 */
export const useContentByCategory = (categorySlug: string, query?: Omit<ContentQuery, 'category'>, enabled = true) => {
  return useQuery({
    queryKey: contentKeys.category(categorySlug, query),
    queryFn: () => contentRepository.getContentByCategory(categorySlug, query),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: Boolean(categorySlug) && enabled,
    retry: 2,
  })
}

/**
 * Hook to fetch content attachments
 */
export const useContentAttachments = (contentId: string, enabled = true) => {
  return useQuery({
    queryKey: contentKeys.attachments(contentId),
    queryFn: () => contentRepository.getContentAttachments(contentId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: Boolean(contentId) && enabled,
    retry: 2,
  })
}

// Category hooks
/**
 * Hook to fetch all categories
 */
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => contentRepository.getAllCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes (categories don't change often)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  })
}

/**
 * Hook to fetch category tree
 */
export const useCategoryTree = () => {
  return useQuery({
    queryKey: categoryKeys.tree(),
    queryFn: () => contentRepository.getCategoryTree(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  })
}

/**
 * Hook to fetch active categories
 */
export const useActiveCategories = () => {
  return useQuery({
    queryKey: categoryKeys.active(),
    queryFn: () => contentRepository.getActiveCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch category detail by slug
 */
export const useCategoryDetail = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: categoryKeys.detail(slug),
    queryFn: () => contentRepository.getCategoryBySlug(slug),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: Boolean(slug) && enabled,
    retry: 2,
  })
}

// FAQ hooks
/**
 * Hook to fetch all FAQs
 */
export const useAllFAQs = () => {
  return useQuery({
    queryKey: faqKeys.lists(),
    queryFn: () => contentRepository.getAllFAQs(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch paginated FAQs
 */
export const useFAQList = (query: FAQQuery) => {
  return useQuery({
    queryKey: faqKeys.list(query),
    queryFn: () => contentRepository.getFAQsPaginated(query),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

/**
 * Hook to search FAQs
 */
export const useFAQSearch = (searchTerm: string, query?: Omit<FAQQuery, 'search'>, enabled = true) => {
  return useQuery({
    queryKey: faqKeys.search(searchTerm, query),
    queryFn: () => contentRepository.searchFAQs(searchTerm, query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    enabled: Boolean(searchTerm.trim()) && enabled,
    retry: 2,
  })
}

/**
 * Hook to fetch random FAQs
 */
export const useRandomFAQs = (limit = 5) => {
  return useQuery({
    queryKey: faqKeys.random(limit),
    queryFn: () => contentRepository.getRandomFAQs(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

/**
 * Hook to fetch popular FAQs
 */
export const usePopularFAQs = (limit = 10) => {
  return useQuery({
    queryKey: faqKeys.popular(limit),
    queryFn: () => contentRepository.getPopularFAQs(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch active FAQs
 */
export const useActiveFAQs = () => {
  return useQuery({
    queryKey: faqKeys.active(),
    queryFn: () => contentRepository.getActiveFAQs(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch FAQ by ID
 */
export const useFAQDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => contentRepository.getFAQById(id),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: Boolean(id) && enabled,
    retry: 2,
  })
}

/**
 * Hook to prefetch content data
 */
export const usePrefetchContent = () => {
  const queryClient = useQueryClient()

  return {
    prefetchDetail: (slug: string) => 
      queryClient.prefetchQuery({
        queryKey: contentKeys.detail(slug),
        queryFn: () => contentRepository.getContentBySlug(slug),
        staleTime: 15 * 60 * 1000,
      }),
    prefetchFeatured: () =>
      queryClient.prefetchQuery({
        queryKey: contentKeys.featured(),
        queryFn: () => contentRepository.getFeaturedContent(),
        staleTime: 10 * 60 * 1000,
      }),
    prefetchCategories: () =>
      queryClient.prefetchQuery({
        queryKey: categoryKeys.lists(),
        queryFn: () => contentRepository.getAllCategories(),
        staleTime: 30 * 60 * 1000,
      }),
  }
}