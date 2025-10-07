import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FooterService } from '../services/FooterService';
import type { FooterData } from '../types/footer';

// Query keys for consistent cache management
export const footerKeys = {
  all: ['footer'] as const,
  data: (locale: 'ne' | 'en') => [...footerKeys.all, 'data', locale] as const,
  links: (locale: 'ne' | 'en') => [...footerKeys.all, 'links', locale] as const,
  contact: (locale: 'ne' | 'en') => [...footerKeys.all, 'contact', locale] as const,
  officeInfo: (locale: 'ne' | 'en') => [...footerKeys.all, 'officeInfo', locale] as const,
}

/**
 * Hook to fetch complete footer data including office info, links, and contact
 */
export const useFooterDataQuery = (locale: 'ne' | 'en' = 'en') => {
  return useQuery({
    queryKey: footerKeys.data(locale),
    queryFn: () => FooterService.getFooterData(locale),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook for footer links with locale support
 */
export const useFooterLinksQuery = (locale: 'ne' | 'en' = 'en') => {
  const { data: footerData, isLoading, isError, error } = useFooterDataQuery(locale);
  
  return {
    links: footerData?.importantLinks || null,
    isLoading,
    isError,
    error,
    refetch: () => footerData?.importantLinks,
  };
};

/**
 * Hook for office information from footer data
 */
export const useFooterOfficeInfoQuery = (locale: 'ne' | 'en' = 'en') => {
  const { data: footerData, isLoading, isError, error } = useFooterDataQuery(locale);
  
  return {
    officeInfo: footerData?.officeInfo,
    officeHours: footerData?.officeHours,
    isLoading,
    isError,
    error,
  };
};

/**
 * Hook for contact information from footer data
 */
export const useFooterContactQuery = (locale: 'ne' | 'en' = 'en') => {
  const { data: footerData, isLoading, isError, error } = useFooterDataQuery(locale);
  
  return {
    contactInfo: footerData?.contactInfo || null,
    isLoading,
    isError,
    error,
  };
};

/**
 * Hook to get localized text from translatable entities
 */
export const useFooterLocalizedText = (locale: 'ne' | 'en' = 'en') => {
  return (entity: any) => FooterService.getLocalizedText(entity, locale);
};

/**
 * Hook to validate footer data
 */
export const useFooterDataValid = (locale: 'ne' | 'en' = 'en') => {
  const { data: footerData } = useFooterDataQuery(locale);
  
  return footerData ? FooterService.isFooterDataValid(footerData) : false;
};

/**
 * Hook to prefetch footer data
 */
export const usePrefetchFooter = () => {
  const queryClient = useQueryClient();

  return {
    prefetchFooterData: (locale: 'ne' | 'en' = 'en') => 
      queryClient.prefetchQuery({
        queryKey: footerKeys.data(locale),
        queryFn: () => FooterService.getFooterData(locale),
        staleTime: 10 * 60 * 1000,
      }),
  };
};

/**
 * Hook to invalidate footer caches
 */
export const useInvalidateFooterCache = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => queryClient.invalidateQueries({ queryKey: footerKeys.all }),
    invalidateData: (locale?: 'ne' | 'en') => 
      locale 
        ? queryClient.invalidateQueries({ queryKey: footerKeys.data(locale) })
        : queryClient.invalidateQueries({ queryKey: [...footerKeys.all, 'data'] }),
  };
};

/**
 * Lightweight hook for components that only need basic footer info
 */
export const useBasicFooterInfo = (locale: 'ne' | 'en' = 'en') => {
  const { data: footerData, isLoading, isError } = useFooterDataQuery(locale);
  
  return {
    officeName: footerData?.officeInfo?.officeName,
    officeAddress: footerData?.officeInfo?.address,
    isLoading,
    isError,
  };
};
