"use client";

import { useKeyOfficersQuery, useEmployeeSearchQuery } from './useEmployeesQuery'
import { useEmployeesLegacy, useEmployeeSearchLegacy } from './useEmployees'
import { useState, useEffect, useCallback } from 'react'
import type { Employee, EmployeeFilter } from '../types/employee'

/**
 * Interface that both employee implementations must follow
 * This ensures backward compatibility
 */
export interface EmployeesHookResult {
  employees: Employee[]
  isLoading: boolean
  error: string | null
  hasFetched: boolean
  refetch: () => void | Promise<void>
  clearError: () => void
}

/**
 * Interface for employee search hook
 */
export interface EmployeeSearchHookResult {
  searchResults: Employee[]
  isSearching: boolean
  searchError: string | null
  searchEmployees: (query: string, params?: any) => Promise<void>
  clearSearch: () => void
}

/**
 * TanStack Query implementation for key officers
 */
function useEmployeesTanStackQuery(locale: 'ne' | 'en'): EmployeesHookResult {
  const query = useKeyOfficersQuery(locale)
  
  return {
    employees: query.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    hasFetched: !query.isLoading && (!!query.data || !!query.error),
    refetch: () => query.refetch(),
    clearError: () => {
      // TanStack Query handles error clearing automatically
      // when refetch succeeds or query is invalidated
    },
  }
}

/**
 * TanStack Query implementation for employee search
 */
function useEmployeeSearchTanStackQuery(): EmployeeSearchHookResult {
  const [currentQuery, setCurrentQuery] = useState<string>('')
  const [searchParams, setSearchParams] = useState<any>()
  
  const query = useEmployeeSearchQuery(currentQuery, searchParams)
  
  const searchEmployees = useCallback(async (searchQuery: string, params?: any) => {
    setCurrentQuery(searchQuery)
    setSearchParams(params)
  }, [])
  
  const clearSearch = useCallback(() => {
    setCurrentQuery('')
    setSearchParams(undefined)
  }, [])
  
  return {
    searchResults: query.data?.employees || [],
    isSearching: query.isLoading,
    searchError: query.error?.message || null,
    searchEmployees,
    clearSearch,
  }
}

/**
 * Legacy implementation (unchanged)
 */
function useEmployeesZustand(locale: 'ne' | 'en'): EmployeesHookResult {
  const result = useEmployeesLegacy(locale)
  
  return {
    employees: result.employees,
    isLoading: result.isLoading,
    error: result.error,
    hasFetched: result.hasFetched,
    refetch: result.refetch,
    clearError: result.clearError,
  }
}

/**
 * Legacy search implementation (unchanged)
 */
function useEmployeeSearchZustand(): EmployeeSearchHookResult {
  const result = useEmployeeSearchLegacy()
  
  return {
    searchResults: result.searchResults,
    isSearching: result.isSearching,
    searchError: result.searchError,
    searchEmployees: result.searchEmployees,
    clearSearch: result.clearSearch,
  }
}

/**
 * Hybrid hook that can switch between implementations for employees
 * Maintains complete backward compatibility
 */
export const useEmployeesHybrid = (
  locale: 'ne' | 'en', 
  useTanStackQuery = false
): EmployeesHookResult => {
  
  // Feature flag check with fallback mechanism
  if (useTanStackQuery) {
    try {
      console.log('🔄 useEmployeesHybrid: Using TanStack Query implementation');
      return useEmployeesTanStackQuery(locale);
    } catch (error) {
      console.warn('⚠️ useEmployeesHybrid: TanStack Query failed, falling back to legacy:', error);
      // Fall through to legacy implementation
    }
  }

  console.log('🔄 useEmployeesHybrid: Using legacy implementation');
  return useEmployeesZustand(locale);
}

/**
 * Hybrid hook that can switch between implementations for employee search
 * Maintains complete backward compatibility
 */
export const useEmployeeSearchHybrid = (
  useTanStackQuery = false
): EmployeeSearchHookResult => {
  
  // Feature flag check with fallback mechanism
  if (useTanStackQuery) {
    try {
      console.log('🔄 useEmployeeSearchHybrid: Using TanStack Query implementation');
      return useEmployeeSearchTanStackQuery();
    } catch (error) {
      console.warn('⚠️ useEmployeeSearchHybrid: TanStack Query failed, falling back to legacy:', error);
      // Fall through to legacy implementation
    }
  }

  console.log('🔄 useEmployeeSearchHybrid: Using legacy implementation');
  return useEmployeeSearchZustand();
}

/**
 * Migration utilities for testing and debugging employees
 */
export const useEmployeeMigrationUtils = () => {
  return {
    // Compare both implementations side by side
    compareImplementations: (locale: 'ne' | 'en') => {
      const tanstack = useEmployeesTanStackQuery(locale);
      const legacy = useEmployeesZustand(locale);
      
      return {
        tanstack: {
          hasData: tanstack.employees.length > 0,
          isLoading: tanstack.isLoading,
          hasError: !!tanstack.error,
          employeeCount: tanstack.employees.length,
          hasFetched: tanstack.hasFetched,
        },
        legacy: {
          hasData: legacy.employees.length > 0,
          isLoading: legacy.isLoading,
          hasError: !!legacy.error,
          employeeCount: legacy.employees.length,
          hasFetched: legacy.hasFetched,
        }
      };
    },

    // Performance metrics
    getPerformanceMetrics: () => {
      const performance = (window as any).performance;
      const entries = performance?.getEntriesByType?.('measure') || [];
      
      return {
        tanstackQueries: entries.filter((e: any) => e.name.includes('tanstack-employee')),
        legacyOperations: entries.filter((e: any) => e.name.includes('legacy-employee')),
      };
    },

    // Force specific implementation (for testing)
    forceImplementation: (locale: 'ne' | 'en', implementation: 'tanstack' | 'legacy') => {
      if (implementation === 'tanstack') {
        return useEmployeesTanStackQuery(locale);
      }
      return useEmployeesZustand(locale);
    }
  }
}

/**
 * Hook for A/B testing employee implementations
 */
export const useEmployeesABTest = (locale: 'ne' | 'en') => {
  // Simple A/B test based on user ID or session
  const getUserVariant = () => {
    if (typeof window === 'undefined') return 'legacy'; // SSR safety
    
    const stored = localStorage.getItem('employees-ab-variant');
    if (stored && ['tanstack', 'legacy'].includes(stored)) {
      return stored;
    }

    // Assign variant based on random (50/50 split)
    const variant = Math.random() > 0.5 ? 'tanstack' : 'legacy';
    localStorage.setItem('employees-ab-variant', variant);
    return variant;
  }

  const variant = getUserVariant();
  const result = useEmployeesHybrid(locale, variant === 'tanstack');

  return {
    ...result,
    variant,
    // Track metrics for A/B testing
    trackEvent: (eventName: string, data?: any) => {
      console.log(`📊 Employee A/B Test [${variant}]:`, eventName, data);
      // Here you could send to analytics service
    }
  }
}

/**
 * Development-only hook for testing employee migrations
 */
export const useEmployeesDevTools = (locale: 'ne' | 'en') => {
  if (process.env.NODE_ENV !== 'development') {
    return { enabled: false };
  }

  const comparison = useEmployeeMigrationUtils().compareImplementations(locale);
  
  return {
    enabled: true,
    comparison,
    switchToTanStack: () => useEmployeesHybrid(locale, true),
    switchToLegacy: () => useEmployeesHybrid(locale, false),
    logComparison: () => {
      console.table(comparison);
    }
  };
}

/**
 * Utility hook for employee data validation and transformation
 */
export const useEmployeeUtils = () => {
  return {
    // Validate employee data structure
    validateEmployee: (employee: Employee): boolean => {
      return !!(
        employee.id &&
        employee.name &&
        employee.position &&
        employee.isActive
      );
    },

    // Get localized text from employee fields
    getLocalizedText: (entity: { ne: string; en: string }, locale: 'ne' | 'en'): string => {
      if (!entity) return 'N/A';
      return entity[locale] || entity.en || entity.ne || 'N/A';
    },

    // Format employee contact information
    formatContactInfo: (employee: Employee) => {
      const contact = {
        primary: '',
        secondary: ''
      };

      if (employee.mobileNumber) {
        contact.primary = employee.mobileNumber;
        if (employee.telephone) {
          contact.secondary = employee.telephone;
        }
      } else if (employee.telephone) {
        contact.primary = employee.telephone;
      }

      if (employee.roomNumber && contact.primary) {
        contact.primary += ` (Room: ${employee.roomNumber})`;
      }

      return contact;
    },

    // Get employee photo URL with fallback
    getEmployeePhotoUrl: (employee: Employee): string | null => {
      if (employee.presignedUrl) {
        return employee.presignedUrl;
      }
      if (employee.photo?.url) {
        return employee.photo.url;
      }
      return null;
    },

    // Sort employees by order and activity
    sortEmployees: (employees: Employee[]): Employee[] => {
      return employees
        .filter(emp => emp.id && emp.name && emp.position && emp.isActive)
        .sort((a, b) => {
          // First sort by active status
          if (a.isActive !== b.isActive) {
            return a.isActive ? -1 : 1;
          }
          // Then by order
          return (b.order || 0) - (a.order || 0);
        });
    }
  };
}