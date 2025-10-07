"use client";

import { useEffect, useRef } from 'react';
import { FooterService } from '../services/FooterService';
import { FooterData } from '../types/footer';
import { 
  useFooterStore, 
  useFooterData, 
  useFooterLoading, 
  useFooterError,
  useFooterActions 
} from '../stores/footer-store';

/**
 * Main hook for footer functionality
 */
export function useFooter(locale: 'ne' | 'en') {
  const { data, isLoading, error } = useFooterStore();
  const { setData, setLoading, setError } = useFooterActions();
  const hasFetched = useRef(false);

  const fetchFooterData = async (targetLocale: 'ne' | 'en') => {
    if (isLoading) return;
    
    setLoading(true);
    setError(null);

    try {
      const footerData = await FooterService.getFooterData(targetLocale);
      
      if (FooterService.isFooterDataValid(footerData)) {
        setData(footerData);
      } else {
        console.warn('Footer data validation failed, but proceeding with available data:', footerData);
        setData(footerData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch footer data';
      
      console.error('Footer hook error:', err);
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when needed
  useEffect(() => {
    if (!isLoading && !data && !hasFetched.current) {
      hasFetched.current = true;
      fetchFooterData(locale);
    }
  }, [locale]); // Only depend on locale

  // Reset fetch flag when locale changes
  useEffect(() => {
    hasFetched.current = false;
  }, [locale]);

  const clearError = () => {
    setError(null);
  };

  const isReady = !isLoading && FooterService.isFooterDataValid(data);

  return {
    data,
    isLoading,
    error,
    isReady,
    refetch: () => fetchFooterData(locale),
    clearError,
  };
}

/**
 * Hook for footer configuration only
 */
export function useFooterConfig(locale: 'ne' | 'en') {
  const { data, isLoading, error, isReady, refetch, clearError } = useFooter(locale);
  
  return {
    config: data?.officeInfo || null,
    isLoading,
    error,
    isReady,
    refetch,
    clearError,
  };
}

/**
 * Hook for footer links
 */
export function useFooterLinks(locale: 'ne' | 'en') {
  const { data, isLoading, error } = useFooter(locale);
  
  return {
    links: data?.importantLinks || null,
    isLoading,
    error,
  };
}

/**
 * Hook for footer contact information
 */
export function useFooterContact(locale: 'ne' | 'en') {
  const { data, isLoading, error } = useFooter(locale);
  
  return {
    contactInfo: data?.contactInfo || null,
    officeHours: data?.officeHours || null,
    isLoading,
    error,
  };
}

/**
 * Hook for getting localized text
 */
export function useFooterLocalization(locale: 'ne' | 'en') {
  const getText = (entity: { ne: string; en: string }) => {
    return FooterService.getLocalizedText(entity, locale);
  };

  return { getText };
}
