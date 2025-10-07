"use client";

import { useSliderDataQuery } from './useSliderQuery'
import { 
  useSliderStore,
  useSliderData,
  useSliderLoading,
  useSliderError,
  useSliderFetchData,
  useSliderClearError,
  useIsSliderReady,
} from '../stores/slider-store'
import { SliderService } from '../services/SliderService';
import { useEffect, useRef } from 'react'

const sliderService = new SliderService();

/**
 * Interface that both implementations must follow
 * This ensures backward compatibility
 */
export interface SliderHookResult {
  data: any | null
  isLoading: boolean
  error: string | null
  isReady: boolean
  refetch: () => void | Promise<void>
  clearError: () => void
}

/**
 * TanStack Query implementation
 */
function useSliderTanStackQuery(locale: 'ne' | 'en'): SliderHookResult {
  const query = useSliderDataQuery(locale)
  
  return {
    data: query.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isReady: !query.isLoading && !!query.data && !query.error,
    refetch: () => query.refetch(),
    clearError: () => {
      // TanStack Query handles error clearing automatically
      // when refetch succeeds or query is invalidated
    },
  }
}

/**
 * Legacy Zustand implementation (unchanged)
 */
function useSliderZustand(locale: 'ne' | 'en'): SliderHookResult {
  const data = useSliderData();
  const isLoading = useSliderLoading();
  const error = useSliderError();
  const isReady = useIsSliderReady();
  const fetchSliderData = useSliderFetchData();
  const clearError = useSliderClearError();
  const hasFetched = useRef(false);

  // Fetch data when needed (existing logic)
  useEffect(() => {
    if (!isLoading && !data && !hasFetched.current) {
      hasFetched.current = true;
      fetchSliderData(locale);
    }
  }, [locale, isLoading, data, fetchSliderData]);

  // Reset fetch flag when locale changes
  useEffect(() => {
    hasFetched.current = false;
  }, [locale]);

  return {
    data,
    isLoading,
    error,
    isReady,
    refetch: () => fetchSliderData(locale),
    clearError,
  }
}

/**
 * Hybrid hook that can switch between implementations
 * Maintains complete backward compatibility
 */
export const useSliderHybrid = (
  locale: 'ne' | 'en', 
  useTanStackQuery = false
): SliderHookResult => {
  
  // Feature flag check with fallback mechanism
  if (useTanStackQuery) {
    try {
      console.log('🔄 useSliderHybrid: Using TanStack Query implementation');
      return useSliderTanStackQuery(locale);
    } catch (error) {
      console.warn('⚠️ useSliderHybrid: TanStack Query failed, falling back to Zustand:', error);
      // Fall through to Zustand implementation
    }
  }

  console.log('🔄 useSliderHybrid: Using Zustand implementation');
  return useSliderZustand(locale);
}

/**
 * Migration utilities for testing and debugging
 */
export const useSliderMigrationUtils = () => {
  return {
    // Compare both implementations side by side
    compareImplementations: (locale: 'ne' | 'en') => {
      const tanstack = useSliderTanStackQuery(locale);
      const zustand = useSliderZustand(locale);
      
      return {
        tanstack: {
          hasData: !!tanstack.data,
          isLoading: tanstack.isLoading,
          hasError: !!tanstack.error,
          isReady: tanstack.isReady,
        },
        zustand: {
          hasData: !!zustand.data,
          isLoading: zustand.isLoading,
          hasError: !!zustand.error,
          isReady: zustand.isReady,
        }
      };
    },

    // Performance metrics
    getPerformanceMetrics: () => {
      const performance = (window as any).performance;
      const entries = performance?.getEntriesByType?.('measure') || [];
      
      return {
        tanstackQueries: entries.filter((e: any) => e.name.includes('tanstack')),
        zustandOperations: entries.filter((e: any) => e.name.includes('zustand')),
      };
    },

    // Force specific implementation (for testing)
    forceImplementation: (locale: 'ne' | 'en', implementation: 'tanstack' | 'zustand') => {
      if (implementation === 'tanstack') {
        return useSliderTanStackQuery(locale);
      }
      return useSliderZustand(locale);
    }
  }
}

/**
 * Hook for A/B testing slider implementations
 */
export const useSliderABTest = (locale: 'ne' | 'en') => {
  // Simple A/B test based on user ID or session
  const getUserVariant = () => {
    if (typeof window === 'undefined') return 'zustand'; // SSR safety
    
    const stored = localStorage.getItem('slider-ab-variant');
    if (stored && ['tanstack', 'zustand'].includes(stored)) {
      return stored;
    }

    // Assign variant based on random (50/50 split)
    const variant = Math.random() > 0.5 ? 'tanstack' : 'zustand';
    localStorage.setItem('slider-ab-variant', variant);
    return variant;
  }

  const variant = getUserVariant();
  const result = useSliderHybrid(locale, variant === 'tanstack');

  return {
    ...result,
    variant,
    // Track metrics for A/B testing
    trackEvent: (eventName: string, data?: any) => {
      console.log(`📊 Slider A/B Test [${variant}]:`, eventName, data);
      // Here you could send to analytics service
    }
  }
}

/**
 * Development-only hook for testing migrations
 */
export const useSliderDevTools = (locale: 'ne' | 'en') => {
  if (process.env.NODE_ENV !== 'development') {
    return { enabled: false };
  }

  const comparison = useSliderMigrationUtils().compareImplementations(locale);
  
  return {
    enabled: true,
    comparison,
    switchToTanStack: () => useSliderHybrid(locale, true),
    switchToZustand: () => useSliderHybrid(locale, false),
    logComparison: () => {
      console.table(comparison);
    }
  };
}