"use client";

import { useState, useEffect, useCallback } from 'react';
import { EmployeeService } from '../services/EmployeeService';
import { useEmployeesHybrid, useEmployeeSearchHybrid } from './useEmployeesHybrid';
import type { Employee } from '../types/employee';

// Feature flag configuration
const getEmployeeFeatureFlags = () => {
  // Environment variable control (same flag as slider for consistency)
  const envFlag = process.env.NEXT_PUBLIC_SLIDER_USE_TANSTACK === 'true';
  
  // Development mode preference
  const devMode = process.env.NODE_ENV === 'development';
  
  // You can add more sophisticated logic here:
  // - User-based flags
  // - Component-specific flags
  // - A/B testing logic
  
  return {
    useTanStackQuery: envFlag,
    enableInDev: devMode && envFlag,
    enableABTesting: process.env.NEXT_PUBLIC_ENABLE_SLIDER_AB_TEST === 'true'
  };
};

/**
 * Main hook for employee functionality with migration support
 * Maintains backward compatibility while adding TanStack Query support
 */
export function useEmployees(locale: 'ne' | 'en' = 'en', forceMode?: 'tanstack' | 'legacy') {
  const flags = getEmployeeFeatureFlags();
  
  // Determine which implementation to use
  const useTanStackQuery = forceMode === 'tanstack' || 
    (forceMode !== 'legacy' && flags.useTanStackQuery);

  // Use hybrid implementation with feature flag
  const result = useEmployeesHybrid(locale, useTanStackQuery);
  
  // Add migration logging for monitoring
  useEffect(() => {
    if (flags.enableInDev) {
      console.log(`🔄 useEmployees: Using ${useTanStackQuery ? 'TanStack Query' : 'Legacy'} for locale: ${locale}`);
    }
  }, [locale, useTanStackQuery, flags.enableInDev]);

  return result;
}

/**
 * Main hook for employee search functionality with migration support
 * Maintains backward compatibility while adding TanStack Query support
 */
export function useEmployeeSearch(forceMode?: 'tanstack' | 'legacy') {
  const flags = getEmployeeFeatureFlags();
  
  // Determine which implementation to use
  const useTanStackQuery = forceMode === 'tanstack' || 
    (forceMode !== 'legacy' && flags.useTanStackQuery);

  // Use hybrid implementation with feature flag
  const result = useEmployeeSearchHybrid(useTanStackQuery);
  
  // Add migration logging for monitoring
  useEffect(() => {
    if (flags.enableInDev) {
      console.log(`🔄 useEmployeeSearch: Using ${useTanStackQuery ? 'TanStack Query' : 'Legacy'} implementation`);
    }
  }, [useTanStackQuery, flags.enableInDev]);

  return result;
}

/**
 * Legacy hook maintained for backward compatibility
 * @deprecated Use useEmployees instead
 */
export function useEmployeesLegacy(locale: 'ne' | 'en' = 'en') {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const employeeService = new EmployeeService();

  const fetchKeyOfficers = useCallback(async () => {
    if (hasFetched) return;

    console.log('🔄 Starting to fetch key officers...', { locale });
    setIsLoading(true);
    setError(null);

    try {
      console.log('📞 Calling employeeService.getKeyOfficers()...');
      const keyOfficers = await employeeService.getKeyOfficers(locale);
      console.log('✅ Received key officers:', keyOfficers);
      console.log('🔍 Key officers type:', typeof keyOfficers);
      console.log('🔍 Key officers is array:', Array.isArray(keyOfficers));
      console.log('🔍 Key officers length:', Array.isArray(keyOfficers) ? keyOfficers.length : 'Not an array');
      
      setEmployees(keyOfficers);
      setHasFetched(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employees';
      console.error('❌ Error fetching key officers:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('🏁 Finished fetching key officers');
    }
  }, [hasFetched, locale]);

  const refetch = useCallback(async () => {
    setHasFetched(false);
    await fetchKeyOfficers();
  }, [fetchKeyOfficers]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset hasFetched when locale changes to trigger re-fetch
  useEffect(() => {
    setHasFetched(false);
  }, [locale]);

  // Fetch employees on mount or when locale changes
  useEffect(() => {
    fetchKeyOfficers();
  }, [fetchKeyOfficers]);

  return {
    employees,
    isLoading,
    error,
    hasFetched,
    refetch,
    clearError,
  };
}

/**
 * Legacy employee search hook maintained for backward compatibility
 * @deprecated Use useEmployeeSearch instead
 */
export function useEmployeeSearchLegacy() {
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const employeeService = new EmployeeService();

  const searchEmployees = useCallback(async (query: string, params?: any) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await employeeService.searchEmployeePhotos(query, params);
      setSearchResults(results.employees);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setSearchError(errorMessage);
      console.error('Error searching employees:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchEmployees,
    clearSearch,
  };
}
