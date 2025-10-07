import { useQuery, useQueryClient } from '@tanstack/react-query'
import { sliderService } from '../services/SliderService'
import type { SliderData, SliderResponse, SliderQuery } from '../types/slider'

// Query keys for consistent cache management - FIXED CIRCULAR REFERENCE
const SLIDER_QUERY_ROOT = ['slider'] as const;

export const sliderQueryKeys = {
  all: SLIDER_QUERY_ROOT,
  data: (locale: 'ne' | 'en') => [...SLIDER_QUERY_ROOT, 'data', locale] as const,
  active: (locale: 'ne' | 'en') => [...SLIDER_QUERY_ROOT, 'active', locale] as const,
  byId: (id: string) => [...SLIDER_QUERY_ROOT, 'byId', id] as const,
  byPosition: (position: number) => [...SLIDER_QUERY_ROOT, 'position', position] as const,
}

/**
 * TanStack Query hook to fetch complete slider data
 */
export const useSliderDataQuery = (locale: 'ne' | 'en') => {
  return useQuery({
    queryKey: sliderQueryKeys.data(locale),
    queryFn: async () => {
      console.log('🔍 useSliderDataQuery: Fetching slider data for locale:', locale);
      const data = await sliderService.getSliderData(locale);
      console.log('🔍 useSliderDataQuery: Retrieved data:', data);
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - sliders don't change frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // Transform to match existing interface expectations
    select: (data: SliderData) => {
      console.log('🔍 useSliderDataQuery: Transforming data:', data);
      return data;
    }
  })
}

/**
 * TanStack Query hook to fetch active sliders only
 */
export const useActiveSliders = (locale?: 'ne' | 'en') => {
  return useQuery({
    queryKey: sliderQueryKeys.active(locale || 'en'),
    queryFn: async () => {
      console.log('🔍 useActiveSliders: Fetching active sliders');
      const sliders = await sliderService.getActiveSliders();
      console.log('🔍 useActiveSliders: Retrieved sliders:', sliders);
      return sliders;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    refetchOnWindowFocus: true,
  })
}

/**
 * TanStack Query hook to fetch slider by ID
 */
export const useSliderById = (id: string) => {
  return useQuery({
    queryKey: sliderQueryKeys.byId(id),
    queryFn: () => sliderService.getSliderById(id),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: !!id, // Only run if ID is provided
  })
}

/**
 * TanStack Query hook to fetch sliders by position
 */
export const useSlidersByPosition = (position: number) => {
  return useQuery({
    queryKey: sliderQueryKeys.byPosition(position),
    queryFn: () => sliderService.getSlidersByPosition(position),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: typeof position === 'number' && position >= 0,
  })
}

/**
 * TanStack Query hook for paginated sliders with search
 */
export const useSliders = (query?: SliderQuery) => {
  return useQuery({
    queryKey: [...sliderQueryKeys.all, 'list', query],
    queryFn: () => sliderService.getSliders(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}

/**
 * Hook for cache invalidation and prefetching
 */
export const useSliderCache = () => {
  const queryClient = useQueryClient()

  return {
    // Invalidate all slider cache
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: sliderQueryKeys.all });
    },

    // Invalidate slider data for specific locale
    invalidateData: (locale: 'ne' | 'en') => {
      queryClient.invalidateQueries({ queryKey: sliderQueryKeys.data(locale) });
    },

    // Invalidate active sliders
    invalidateActive: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['slider', 'active'] 
      });
    },

    // Prefetch slider data for locale
    prefetchData: async (locale: 'ne' | 'en') => {
      await queryClient.prefetchQuery({
        queryKey: sliderQueryKeys.data(locale),
        queryFn: () => sliderService.getSliderData(locale),
        staleTime: 10 * 60 * 1000,
      });
    },

    // Prefetch active sliders
    prefetchActive: async () => {
      await queryClient.prefetchQuery({
        queryKey: sliderQueryKeys.active('en'),
        queryFn: () => sliderService.getActiveSliders(),
        staleTime: 5 * 60 * 1000,
      });
    },

    // Remove specific slider from cache
    removeSlider: (id: string) => {
      queryClient.removeQueries({ queryKey: sliderQueryKeys.byId(id) });
    },

    // Get cache stats
    getCacheStats: () => {
      const cache = queryClient.getQueryCache();
      const sliderQueries = cache.getAll().filter(query => 
        Array.isArray(query.queryKey) && query.queryKey[0] === 'slider'
      );
      
      return {
        totalSliderQueries: sliderQueries.length,
        cachedSliderQueries: sliderQueries.filter(q => q.state.data).length,
        staleSliderQueries: sliderQueries.filter(q => q.isStale()).length,
      };
    },
  }
}

/**
 * Hook for slider prefetching strategies
 */
export const useSliderPrefetch = () => {
  const { prefetchData, prefetchActive } = useSliderCache()

  return {
    // Prefetch both locales
    prefetchBothLocales: async () => {
      await Promise.allSettled([
        prefetchData('en'),
        prefetchData('ne')
      ]);
    },

    // Prefetch on component mount
    prefetchOnMount: (locale: 'ne' | 'en') => {
      React.useEffect(() => {
        prefetchData(locale);
      }, [locale]);
    },

    // Prefetch on hover (for navigation)
    prefetchOnHover: () => ({
      onMouseEnter: () => prefetchActive(),
      onFocus: () => prefetchActive(),
    })
  }
}