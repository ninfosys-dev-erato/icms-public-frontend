import { useQuery, useQueryClient } from '@tanstack/react-query'
import { HeaderService } from '../services/HeaderService'
import type { HeaderData, HeaderConfigResponse, HeaderConfigQuery, NavigationItem } from '../types/header'

// Query keys for consistent cache management
export const headerKeys = {
  all: ['header'] as const,
  data: (locale: 'ne' | 'en') => [...headerKeys.all, 'data', locale] as const,
  config: () => [...headerKeys.all, 'config'] as const,
  activeConfig: () => [...headerKeys.config(), 'active'] as const,
  configList: (query?: HeaderConfigQuery) => [...headerKeys.config(), 'list', query] as const,
  configDetail: (id: string) => [...headerKeys.config(), 'detail', id] as const,
  css: (id: string) => [...headerKeys.all, 'css', id] as const,
  preview: (data: any) => [...headerKeys.all, 'preview', data] as const,
}

/**
 * Hook to fetch complete header data including config, office settings, and navigation
 */
export const useHeaderDataQuery = (locale: 'ne' | 'en' = 'en') => {
  return useQuery({
    queryKey: headerKeys.data(locale),
    queryFn: () => HeaderService.getHeaderData(locale),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

/**
 * Hook to fetch active header configuration
 */
export const useActiveHeaderConfig = () => {
  return useQuery({
    queryKey: headerKeys.activeConfig(),
    queryFn: () => HeaderService.getActiveHeaderConfig(),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  })
}

/**
 * Hook to fetch header configurations with optional query
 */
export const useHeaderConfigs = (query?: HeaderConfigQuery) => {
  return useQuery({
    queryKey: headerKeys.configList(query),
    queryFn: () => HeaderService.getHeaderConfigs(query),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })
}

/**
 * Hook to fetch header configuration by ID
 */
export const useHeaderConfigDetail = (id: string, enabled = true) => {
  return useQuery({
    queryKey: headerKeys.configDetail(id),
    queryFn: () => HeaderService.getHeaderConfigById(id),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: Boolean(id) && enabled,
    retry: 2,
  })
}

/**
 * Hook to fetch header CSS by configuration ID
 */
export const useHeaderCSS = (id: string, enabled = true) => {
  return useQuery({
    queryKey: headerKeys.css(id),
    queryFn: () => HeaderService.getHeaderCSS(id),
    staleTime: 30 * 60 * 1000, // 30 minutes (CSS changes less frequently)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled: Boolean(id) && enabled,
    retry: 2,
  })
}

/**
 * Hook to preview header configuration (typically used in admin)
 */
export const usePreviewHeaderConfig = (data: any, enabled = false) => {
  return useQuery({
    queryKey: headerKeys.preview(data),
    queryFn: () => HeaderService.previewHeaderConfig(data),
    staleTime: 0, // No caching for preview
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: Boolean(data) && enabled,
    retry: 1,
  })
}

/**
 * Hook for header navigation with locale support
 */
export const useHeaderNavigationQuery = (locale: 'ne' | 'en' = 'en') => {
  const { data: headerData, isLoading, isError, error } = useHeaderDataQuery(locale)
  
  return {
    navigation: headerData?.navigation || [],
    isLoading,
    isError,
    error,
    refetch: () => headerData?.navigation,
  }
}

/**
 * Hook for office information from header data
 */
export const useOfficeInfoQuery = (locale: 'ne' | 'en' = 'en') => {
  const { data: headerData, isLoading, isError, error } = useHeaderDataQuery(locale)
  
  return {
    officeInfo: headerData?.officeInfo,
    contactInfo: headerData?.contactInfo,
    isLoading,
    isError,
    error,
  }
}

/**
 * Hook for social media links from header data
 */
export const useSocialMediaQuery = (locale: 'ne' | 'en' = 'en') => {
  const { data: headerData, isLoading, isError, error } = useHeaderDataQuery(locale)
  
  return {
    socialMedia: headerData?.socialMedia || [],
    isLoading,
    isError,
    error,
  }
}

/**
 * Hook to find navigation item by href
 */
export const useNavigationItemByHref = (href: string, locale: 'ne' | 'en' = 'en') => {
  const { data: headerData } = useHeaderDataQuery(locale)
  
  if (!headerData || !href) return null
  
  return HeaderService.findNavigationItemByHref(headerData, href)
}

/**
 * Hook to check if navigation item is active
 */
export const useNavigationActive = (item: NavigationItem, currentPath: string) => {
  if (!item || !currentPath) return false
  
  return HeaderService.isNavigationItemActive(item, currentPath)
}

/**
 * Hook to get breadcrumb trail for current path
 */
export const useBreadcrumbTrail = (currentPath: string, locale: 'ne' | 'en' = 'en') => {
  const { data: headerData } = useHeaderDataQuery(locale)
  
  if (!headerData || !currentPath) return []
  
  return HeaderService.getBreadcrumbTrail(headerData, currentPath)
}

/**
 * Hook to get localized text from translatable entities
 */
export const useLocalizedText = (locale: 'ne' | 'en' = 'en') => {
  return (entity: any) => HeaderService.getLocalizedText(entity, locale)
}

/**
 * Hook to validate header data
 */
export const useHeaderDataValid = (locale: 'ne' | 'en' = 'en') => {
  const { data: headerData } = useHeaderDataQuery(locale)
  
  return HeaderService.isHeaderDataValid(headerData)
}

/**
 * Hook to prefetch header data
 */
export const usePrefetchHeader = () => {
  const queryClient = useQueryClient()

  return {
    prefetchHeaderData: (locale: 'ne' | 'en' = 'en') => 
      queryClient.prefetchQuery({
        queryKey: headerKeys.data(locale),
        queryFn: () => HeaderService.getHeaderData(locale),
        staleTime: 10 * 60 * 1000,
      }),
    prefetchActiveConfig: () =>
      queryClient.prefetchQuery({
        queryKey: headerKeys.activeConfig(),
        queryFn: () => HeaderService.getActiveHeaderConfig(),
        staleTime: 15 * 60 * 1000,
      }),
  }
}

/**
 * Hook to invalidate header caches
 */
export const useInvalidateHeaderCache = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: headerKeys.all }),
    invalidateData: (locale?: 'ne' | 'en') => 
      locale 
        ? queryClient.invalidateQueries({ queryKey: headerKeys.data(locale) })
        : queryClient.invalidateQueries({ queryKey: [...headerKeys.all, 'data'] }),
    invalidateConfig: () => queryClient.invalidateQueries({ queryKey: headerKeys.config() }),
    invalidateActiveConfig: () => queryClient.invalidateQueries({ queryKey: headerKeys.activeConfig() }),
  }
}

/**
 * Lightweight hook for components that only need basic header info
 */
export const useBasicHeaderInfo = (locale: 'ne' | 'en' = 'en') => {
  const { data: headerData, isLoading, isError } = useHeaderDataQuery(locale)
  
  return {
    officeName: headerData?.officeInfo?.officeName,
    logoConfig: headerData?.config?.logoConfiguration,
    isLoading,
    isError,
  }
}