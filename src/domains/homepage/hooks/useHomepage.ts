import { useQuery } from '@tanstack/react-query'
import { HomepageService } from '../services/homepage-service'
import type { HomepageData, HomepageQuery } from '../types/homepage'

// Query keys for consistent cache management
export const homepageKeys = {
  all: ['homepage'] as const,
  data: (query: HomepageQuery) => [...homepageKeys.all, 'data', query] as const,
  navigation: (lang: string) => [...homepageKeys.all, 'navigation', lang] as const,
  officeSettings: (lang: string) => [...homepageKeys.all, 'officeSettings', lang] as const,
  importantLinks: (lang: string) => [...homepageKeys.all, 'importantLinks', lang] as const,
  highlights: (lang: string) => [...homepageKeys.all, 'highlights', lang] as const,
  news: (lang: string) => [...homepageKeys.all, 'news', lang] as const,
  services: (lang: string) => [...homepageKeys.all, 'services', lang] as const,
  contact: (lang: string) => [...homepageKeys.all, 'contact', lang] as const,
}

/**
 * Hook to fetch complete homepage data
 */
export const useHomepageData = (query: HomepageQuery = {}) => {
  return useQuery({
    queryKey: homepageKeys.data(query),
    queryFn: () => HomepageService.getHomepageData(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Always return fallback data instead of throwing
    select: (data) => data || HomepageService.getFallbackData(query.lang || 'en'),
  })
}

/**
 * Hook to fetch navigation data
 */
export const useNavigationData = (lang = 'en') => {
  return useQuery({
    queryKey: homepageKeys.navigation(lang),
    queryFn: () => HomepageService.getNavigationData(lang),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000),
  })
}

/**
 * Hook to fetch office settings
 */
export const useOfficeSettings = (lang = 'en') => {
  return useQuery({
    queryKey: homepageKeys.officeSettings(lang),
    queryFn: () => HomepageService.getOfficeSettings(lang),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch important links
 */
export const useImportantLinks = (lang = 'en') => {
  return useQuery({
    queryKey: homepageKeys.importantLinks(lang),
    queryFn: () => HomepageService.getImportantLinks(lang),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch highlights
 */
export const useHighlights = (lang = 'en') => {
  return useQuery({
    queryKey: homepageKeys.highlights(lang),
    queryFn: () => HomepageService.getHighlights(lang),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
  })
}

/**
 * Hook to fetch news
 */
export const useNews = (lang = 'en') => {
  return useQuery({
    queryKey: homepageKeys.news(lang),
    queryFn: () => HomepageService.getNews(lang),
    staleTime: 5 * 60 * 1000, // 5 minutes (news changes frequently)
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
  })
}

/**
 * Hook to fetch services
 */
export const useServices = (lang = 'en') => {
  return useQuery({
    queryKey: homepageKeys.services(lang),
    queryFn: () => HomepageService.getServices(lang),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch contact information
 */
export const useContactInfo = (lang = 'en') => {
  return useQuery({
    queryKey: homepageKeys.contact(lang),
    queryFn: () => HomepageService.getContactInfo(lang),
    staleTime: 60 * 60 * 1000, // 1 hour (contact info rarely changes)
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
    retry: 2,
  })
}

/**
 * Hook to get current Nepali date time
 * This doesn't need to be a query since it's a computed value
 */
export const useCurrentNepaliDateTime = () => {
  return HomepageService.getCurrentNepaliDateTime()
}

/**
 * Combined hook for homepage components that need multiple data sources
 */
export const useHomepageComplete = (lang = 'en') => {
  const homepageData = useHomepageData({ lang })
  const navigation = useNavigationData(lang)
  const officeSettings = useOfficeSettings(lang)
  
  return {
    homepageData: homepageData.data,
    navigation: navigation.data,
    officeSettings: officeSettings.data,
    isLoading: homepageData.isLoading || navigation.isLoading || officeSettings.isLoading,
    isError: homepageData.isError || navigation.isError || officeSettings.isError,
    error: homepageData.error || navigation.error || officeSettings.error,
    refetch: () => {
      homepageData.refetch()
      navigation.refetch()
      officeSettings.refetch()
    }
  }
}

/**
 * Hook for sections that need specific data only
 */
export const useHomepageSection = (section: 'hero' | 'services' | 'highlights' | 'news' | 'contact', lang = 'en') => {
  const homepageData = useHomepageData({ lang })
  
  return {
    data: homepageData.data?.[section],
    isLoading: homepageData.isLoading,
    isError: homepageData.isError,
    error: homepageData.error,
    refetch: homepageData.refetch,
  }
}