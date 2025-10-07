"use client";

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { HeaderService } from '../services/HeaderService';
import { NavigationItem, HeaderData } from '../types/header';
import { 
  useHeaderCurrentLocale,
  useHeaderSetLocale 
} from '../stores/header-store';

/**
 * Main hook for header functionality
 */
export function useHeader(locale: 'ne' | 'en') {
  const [data, setData] = useState<HeaderData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const currentLocale = useHeaderCurrentLocale();
  const setLocale = useHeaderSetLocale();

  const fetchHeaderData = async (targetLocale: 'ne' | 'en') => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const headerData = await HeaderService.getHeaderData(targetLocale);
      
      if (HeaderService.isHeaderDataValid(headerData)) {
        setData(headerData);
        setLocale(targetLocale);
      } else {
        console.warn('Header data validation failed, but proceeding with available data:', headerData);
        setData(headerData);
        setLocale(targetLocale);
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch header data';
      
      console.error('Header hook error:', err);
      setError(errorMessage);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when needed
  useEffect(() => {
    if (!isLoading && !data && !hasFetched.current) {
      hasFetched.current = true;
      fetchHeaderData(locale);
    }
  }, [locale]); // Only depend on locale

  // Reset fetch flag when locale changes
  useEffect(() => {
    hasFetched.current = false;
  }, [locale]);

  const clearError = () => {
    setError(null);
  };

  const isReady = !isLoading && HeaderService.isHeaderDataValid(data);

  return {
    data,
    isLoading,
    error,
    isReady,
    refetch: () => fetchHeaderData(locale),
    clearError,
  };
}

/**
 * Hook for header configuration only
 */
export function useHeaderConfig(locale: 'ne' | 'en') {
  const { data, isLoading, error, isReady, refetch, clearError } = useHeader(locale);
  
  return {
    config: data?.config || null,
    isLoading,
    error,
    isReady,
    refetch,
    clearError,
  };
}

/**
 * Hook for getting active header config from API (legacy - use useActiveHeaderConfig from useHeaderQuery instead)
 */
export function useActiveHeaderConfigLegacy() {
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveConfig = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const activeConfig = await HeaderService.getActiveHeaderConfig();
      setConfig(activeConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch active header config';
      console.error('Active header config error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveConfig();
  }, []);

  return {
    config,
    isLoading,
    error,
    refetch: fetchActiveConfig,
  };
}

/**
 * Hook for navigation functionality
 */
export function useHeaderNavigation(locale: 'ne' | 'en') {
  const { data, isLoading, error } = useHeader(locale);
  const pathname = usePathname();

  const navigation = data?.navigation || [];
  
  // Debug logging for useHeaderNavigation
  console.log('useHeaderNavigation: Full data object:', data);
  console.log('useHeaderNavigation: Navigation from data.navigation:', navigation);
  console.log('useHeaderNavigation: Navigation count:', navigation.length);
  console.log('useHeaderNavigation: Items with submenus:', 
    navigation.filter(item => item.submenu && item.submenu.length > 0));
  
  // Get active navigation item
  const activeItem = data ? HeaderService.findNavigationItemByHref(data, pathname) : null;
  
  // Get breadcrumb trail
  const breadcrumbs = data ? HeaderService.getBreadcrumbTrail(data, pathname) : [];
  
  // Check if item is active
  const isItemActive = (item: NavigationItem) => {
    return data ? HeaderService.isNavigationItemActive(item, pathname) : false;
  };

  return {
    navigation,
    activeItem,
    breadcrumbs,
    isItemActive,
    isLoading,
    error,
  };
}

/**
 * Hook for getting localized text
 */
export function useHeaderLocalization(locale: 'ne' | 'en') {
  const getText = (entity: { ne: string; en: string }) => {
    return HeaderService.getLocalizedText(entity, locale);
  };

  return { getText };
}

/**
 * Hook for social media links
 */
export function useHeaderSocialMedia(locale: 'ne' | 'en') {
  const { data, isLoading, error } = useHeader(locale);
  
  return {
    socialMedia: data?.socialMedia || [],
    isLoading,
    error,
  };
}

/**
 * Hook for contact information
 */
export function useHeaderContact(locale: 'ne' | 'en') {
  const { data, isLoading, error } = useHeader(locale);
  
  return {
    contactInfo: data?.contactInfo || null,
    isLoading,
    error,
  };
}

/**
 * Hook for header CSS (legacy - use useHeaderCSS from useHeaderQuery instead)
 */
export function useHeaderCSSLegacy(id: string) {
  const [css, setCss] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCSS = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const cssResult = await HeaderService.getHeaderCSS(id);
      setCss(cssResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch header CSS';
      console.error('Header CSS error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCSS();
  }, [id]);

  return {
    css,
    isLoading,
    error,
    refetch: fetchCSS,
  };
}

/**
 * Hook for header configs list (legacy - use useHeaderConfigs from useHeaderQuery instead)
 */
export function useHeaderConfigsLegacy(query?: any) {
  const [configs, setConfigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfigs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const configsList = await HeaderService.getHeaderConfigs(query);
      setConfigs(Array.isArray(configsList) ? configsList : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch header configs';
      console.error('Header configs error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, [query]);

  return {
    configs,
    isLoading,
    error,
    refetch: fetchConfigs,
  };
}

/**
 * Hook for header config by ID
 */
export function useHeaderConfigById(id: string) {
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const headerConfig = await HeaderService.getHeaderConfigById(id);
      setConfig(headerConfig);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch header config';
      console.error('Header config error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [id]);

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };
}
/**
 * Hook for office information (directorate, office name, introduction)
 */
export function useHeaderOfficeInfo(locale: 'ne' | 'en') {
  const { data, isLoading, error } = useHeader(locale);
  
  return {
    officeInfo: data?.officeInfo || null,
    directorate: data?.officeInfo?.directorate || null,
    officeName: data?.officeInfo?.officeName || null,
    introduction: data?.officeInfo?.introduction || null,
    isLoading,
    error,
  };
}
