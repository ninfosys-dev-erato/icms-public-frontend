import React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { employeeService } from '../services/EmployeeService'
import type { Employee, EmployeeFilter, EmployeePhotosResponse, EmployeeSearchResponse, EmployeeStatistics } from '../types/employee'

// Query keys for consistent cache management - FIXED CIRCULAR REFERENCE
const EMPLOYEE_QUERY_ROOT = ['employee'] as const;

export const employeeQueryKeys = {
  all: EMPLOYEE_QUERY_ROOT,
  keyOfficers: (locale: 'ne' | 'en') => [...EMPLOYEE_QUERY_ROOT, 'keyOfficers', locale] as const,
  photos: (params?: EmployeeFilter) => [...EMPLOYEE_QUERY_ROOT, 'photos', params] as const,
  search: (query: string, params?: Omit<EmployeeFilter, 'search'>) => [...EMPLOYEE_QUERY_ROOT, 'search', query, params] as const,
  statistics: () => [...EMPLOYEE_QUERY_ROOT, 'statistics'] as const,
  byDepartment: (departmentId: string) => [...EMPLOYEE_QUERY_ROOT, 'department', departmentId] as const,
  byPosition: (position: string) => [...EMPLOYEE_QUERY_ROOT, 'position', position] as const,
  byId: (id: string) => [...EMPLOYEE_QUERY_ROOT, 'byId', id] as const,
}

/**
 * TanStack Query hook to fetch key officers (for slider sidebar)
 */
export const useKeyOfficersQuery = (locale: 'ne' | 'en' = 'en') => {
  return useQuery({
    queryKey: employeeQueryKeys.keyOfficers(locale),
    queryFn: async () => {
      console.log('🔍 useKeyOfficersQuery: Fetching key officers for locale:', locale);
      const officers = await employeeService.getKeyOfficers(locale);
      console.log('🔍 useKeyOfficersQuery: Retrieved officers:', officers);
      return officers;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - employee data doesn't change frequently
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false, // Key officers don't need frequent updates
    refetchOnReconnect: true,
    // Transform and validate data
    select: (data: Employee[]) => {
      console.log('🔍 useKeyOfficersQuery: Processing officers data:', data);
      return employeeService.sortEmployees(data);
    }
  })
}

/**
 * TanStack Query hook to fetch all employee photos with pagination
 */
export const useEmployeePhotosQuery = (params?: EmployeeFilter) => {
  return useQuery({
    queryKey: employeeQueryKeys.photos(params),
    queryFn: async () => {
      console.log('🔍 useEmployeePhotosQuery: Fetching photos with params:', params);
      const response = await employeeService.getEmployeePhotos(params);
      console.log('🔍 useEmployeePhotosQuery: Retrieved response:', response);
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 15000),
    refetchOnWindowFocus: true,
  })
}

/**
 * TanStack Query hook for employee search
 */
export const useEmployeeSearchQuery = (query: string, params?: Omit<EmployeeFilter, 'search'>) => {
  return useQuery({
    queryKey: employeeQueryKeys.search(query, params),
    queryFn: async () => {
      console.log('🔍 useEmployeeSearchQuery: Searching with query:', query, 'params:', params);
      const response = await employeeService.searchEmployeePhotos(query, params);
      console.log('🔍 useEmployeeSearchQuery: Search results:', response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    enabled: !!query && query.trim().length > 0, // Only run if query is provided
  })
}

/**
 * TanStack Query hook for employee statistics
 */
export const useEmployeeStatisticsQuery = () => {
  return useQuery({
    queryKey: employeeQueryKeys.statistics(),
    queryFn: async () => {
      console.log('🔍 useEmployeeStatisticsQuery: Fetching statistics');
      const stats = await employeeService.getEmployeeStatistics();
      console.log('🔍 useEmployeeStatisticsQuery: Retrieved stats:', stats);
      return stats;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - stats change slowly
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  })
}

/**
 * TanStack Query hook for employees by department
 */
export const useEmployeesByDepartmentQuery = (departmentId: string) => {
  return useQuery({
    queryKey: employeeQueryKeys.byDepartment(departmentId),
    queryFn: async () => {
      console.log('🔍 useEmployeesByDepartmentQuery: Fetching for department:', departmentId);
      const employees = await employeeService.getPhotosByDepartment(departmentId);
      console.log('🔍 useEmployeesByDepartmentQuery: Retrieved employees:', employees);
      return employees;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: !!departmentId, // Only run if departmentId is provided
    select: (data: Employee[]) => employeeService.sortEmployees(data),
  })
}

/**
 * TanStack Query hook for employees by position
 */
export const useEmployeesByPositionQuery = (position: string) => {
  return useQuery({
    queryKey: employeeQueryKeys.byPosition(position),
    queryFn: async () => {
      console.log('🔍 useEmployeesByPositionQuery: Fetching for position:', position);
      const employees = await employeeService.getPhotosByPosition(position);
      console.log('🔍 useEmployeesByPositionQuery: Retrieved employees:', employees);
      return employees;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
    enabled: !!position, // Only run if position is provided
    select: (data: Employee[]) => employeeService.sortEmployees(data),
  })
}

/**
 * TanStack Query hook for specific employee
 */
export const useEmployeeByIdQuery = (employeeId: string) => {
  return useQuery({
    queryKey: employeeQueryKeys.byId(employeeId),
    queryFn: async () => {
      console.log('🔍 useEmployeeByIdQuery: Fetching employee:', employeeId);
      const employee = await employeeService.getEmployeePhoto(employeeId);
      console.log('🔍 useEmployeeByIdQuery: Retrieved employee:', employee);
      return employee;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - individual employee data stable
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
    enabled: !!employeeId, // Only run if employeeId is provided
  })
}

/**
 * Hook for employee cache management
 */
export const useEmployeeCache = () => {
  const queryClient = useQueryClient()

  return {
    // Invalidate all employee cache
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all });
    },

    // Invalidate key officers for specific locale
    invalidateKeyOfficers: (locale: 'ne' | 'en') => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.keyOfficers(locale) });
    },

    // Invalidate employee photos
    invalidatePhotos: (params?: EmployeeFilter) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.photos(params) });
    },

    // Invalidate employee search results
    invalidateSearch: () => {
      queryClient.invalidateQueries({ 
        queryKey: [...EMPLOYEE_QUERY_ROOT, 'search'] 
      });
    },

    // Invalidate employees by department
    invalidateDepartment: (departmentId: string) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.byDepartment(departmentId) });
    },

    // Invalidate employees by position
    invalidatePosition: (position: string) => {
      queryClient.invalidateQueries({ queryKey: employeeQueryKeys.byPosition(position) });
    },

    // Prefetch key officers for both locales
    prefetchKeyOfficers: async () => {
      await Promise.allSettled([
        queryClient.prefetchQuery({
          queryKey: employeeQueryKeys.keyOfficers('en'),
          queryFn: () => employeeService.getKeyOfficers('en'),
          staleTime: 15 * 60 * 1000,
        }),
        queryClient.prefetchQuery({
          queryKey: employeeQueryKeys.keyOfficers('ne'),
          queryFn: () => employeeService.getKeyOfficers('ne'),
          staleTime: 15 * 60 * 1000,
        })
      ]);
    },

    // Prefetch employee photos
    prefetchPhotos: async (params?: EmployeeFilter) => {
      await queryClient.prefetchQuery({
        queryKey: employeeQueryKeys.photos(params),
        queryFn: () => employeeService.getEmployeePhotos(params),
        staleTime: 10 * 60 * 1000,
      });
    },

    // Remove specific employee from cache
    removeEmployee: (employeeId: string) => {
      queryClient.removeQueries({ queryKey: employeeQueryKeys.byId(employeeId) });
    },

    // Get cache stats
    getCacheStats: () => {
      const cache = queryClient.getQueryCache();
      const employeeQueries = cache.getAll().filter(query => 
        Array.isArray(query.queryKey) && query.queryKey[0] === 'employee'
      );
      
      return {
        totalEmployeeQueries: employeeQueries.length,
        cachedEmployeeQueries: employeeQueries.filter(q => q.state.data).length,
        staleEmployeeQueries: employeeQueries.filter(q => q.isStale()).length,
      };
    },
  }
}

/**
 * Hook for employee prefetching strategies
 */
export const useEmployeePrefetch = () => {
  const { prefetchKeyOfficers, prefetchPhotos } = useEmployeeCache()

  return {
    // Prefetch on component mount
    prefetchOnMount: (locale: 'ne' | 'en') => {
      React.useEffect(() => {
        prefetchKeyOfficers();
      }, [locale]);
    },

    // Prefetch on hover (for navigation)
    prefetchOnHover: () => ({
      onMouseEnter: () => prefetchKeyOfficers(),
      onFocus: () => prefetchKeyOfficers(),
    }),

    // Prefetch related data
    prefetchRelatedData: async (departmentId?: string) => {
      if (departmentId) {
        await prefetchPhotos({ departmentId });
      }
    }
  }
}