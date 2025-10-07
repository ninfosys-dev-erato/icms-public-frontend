import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';

// Cache keys for different types of content
export const cacheKeys = {
  // Static content (rarely changes) - 1 hour cache
  header: ['homepage', 'header'] as const,
  footer: ['homepage', 'footer'] as const,
  officeInfo: ['homepage', 'office-info'] as const,
  
  // Dynamic content (changes frequently) - 5 minute cache  
  news: ['homepage', 'news'] as const,
  notices: ['homepage', 'notices'] as const,
  
  // Media content (changes occasionally) - 15 minute cache
  slider: ['homepage', 'slider'] as const,
  employees: ['homepage', 'employees'] as const,
  gallery: ['homepage', 'gallery'] as const,
  
  // Services (changes rarely) - 30 minute cache
  services: ['homepage', 'services'] as const,
  highlights: ['homepage', 'highlights'] as const,
}

// Mock data generators with realistic content
const mockHomepageData = {
  header: {
    logo: '/icons/nepal-emblem.svg',
    officeName: { en: 'Government Office', ne: 'सरकारी कार्यालय' },
    navigation: [
      { id: '1', title: { en: 'Home', ne: 'गृह' }, href: '/', order: 1, isActive: true },
      { id: '2', title: { en: 'About', ne: 'बारे मा' }, href: '/about', order: 2, isActive: true },
      { id: '3', title: { en: 'Services', ne: 'सेवाहरू' }, href: '/services', order: 3, isActive: true },
      { id: '4', title: { en: 'News', ne: 'समाचार' }, href: '/news', order: 4, isActive: true },
      { id: '5', title: { en: 'Contact', ne: 'सम्पर्क' }, href: '/contact', order: 5, isActive: true },
    ]
  },
  
  slider: [
    {
      id: '1',
      title: { en: 'Welcome to Nepal', ne: 'नेपालमा स्वागत' },
      description: { en: 'Official Government Portal', ne: 'आधिकारिक सरकारी पोर्टल' },
      image: '/images/slider/slide1.jpg',
      order: 1,
      isActive: true
    },
    {
      id: '2', 
      title: { en: 'Digital Nepal', ne: 'डिजिटल नेपाल' },
      description: { en: 'Modern Digital Services', ne: 'आधुनिक डिजिटल सेवाहरू' },
      image: '/images/slider/slide2.jpg',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: { en: 'Prosperous Nepal', ne: 'समृद्ध नेपाल' },
      description: { en: 'Building a Better Future', ne: 'राम्रो भविष्य निर्माण' },
      image: '/images/slider/slide3.jpg', 
      order: 3,
      isActive: true
    }
  ],
  
  employees: [
    {
      id: '1',
      name: { en: 'Hon. Chief Secretary', ne: 'मा. मुख्य सचिव' },
      position: { en: 'Chief Secretary', ne: 'मुख्य सचिव' },
      image: '/images/employees/chief-secretary.jpg',
      bio: { en: 'Leading government operations', ne: 'सरकारी कार्यसंचालन नेतृत्व' },
      order: 1,
      isActive: true
    },
    {
      id: '2',
      name: { en: 'Hon. Joint Secretary', ne: 'मा. सह-सचिव' },
      position: { en: 'Joint Secretary', ne: 'सह-सचिव' },
      image: '/images/employees/joint-secretary.jpg',
      bio: { en: 'Policy implementation', ne: 'नीति कार्यान्वयन' },
      order: 2,
      isActive: true
    }
  ],
  
  services: [
    {
      id: '1',
      title: { en: 'Online Services', ne: 'अनलाइन सेवाहरू' },
      description: { en: 'Digital government services', ne: 'डिजिटल सरकारी सेवाहरू' },
      icon: '🌐',
      link: '/services/online',
      isActive: true
    },
    {
      id: '2', 
      title: { en: 'Document Services', ne: 'कागजात सेवाहरू' },
      description: { en: 'Official document processing', ne: 'आधिकारिक कागजात प्रक्रिया' },
      icon: '📄',
      link: '/services/documents',
      isActive: true
    },
    {
      id: '3',
      title: { en: 'Citizen Services', ne: 'नागरिक सेवाहरू' },
      description: { en: 'Services for citizens', ne: 'नागरिकहरूका लागि सेवाहरू' },
      icon: '👥',
      link: '/services/citizen',
      isActive: true
    }
  ]
}

/**
 * Hook for caching header information with long cache time
 */
export const useHeaderCache = () => {
  return useQuery({
    queryKey: cacheKeys.header,
    queryFn: () => Promise.resolve(mockHomepageData.header),
    staleTime: 1000 * 60 * 60, // 1 hour - header rarely changes
    gcTime: 1000 * 60 * 60 * 4, // 4 hours
    retry: 1,
    // Provide initial data for consistent SSR/client rendering
    initialData: mockHomepageData.header,
    initialDataUpdatedAt: 0,
  });
}

/**
 * Hook for caching slider/hero images
 */
export const useSliderCache = () => {
  return useQuery({
    queryKey: cacheKeys.slider,
    queryFn: () => Promise.resolve(mockHomepageData.slider),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  });
}

/**
 * Hook for caching employee photos and info
 */
export const useEmployeesCache = () => {
  return useQuery({
    queryKey: cacheKeys.employees,
    queryFn: () => Promise.resolve(mockHomepageData.employees),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 2,
  });
}

/**
 * Hook for caching services with medium cache time
 */
export const useServicesCache = () => {
  return useQuery({
    queryKey: cacheKeys.services,
    queryFn: () => Promise.resolve(mockHomepageData.services),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
    retry: 1,
    // CRITICAL: Provide initial data to prevent SSR/client mismatch
    initialData: mockHomepageData.services,
    initialDataUpdatedAt: 0, // Consider initial data stale immediately
  });
}

/**
 * Combined hook that fetches all homepage data efficiently
 */
export const useHomepageDataCache = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: cacheKeys.header,
        queryFn: () => Promise.resolve(mockHomepageData.header),
        staleTime: 1000 * 60 * 60, // 1 hour
      },
      {
        queryKey: cacheKeys.slider,
        queryFn: () => Promise.resolve(mockHomepageData.slider),
        staleTime: 1000 * 60 * 15, // 15 minutes
      },
      {
        queryKey: cacheKeys.employees,
        queryFn: () => Promise.resolve(mockHomepageData.employees),
        staleTime: 1000 * 60 * 30, // 30 minutes
      },
      {
        queryKey: cacheKeys.services,
        queryFn: () => Promise.resolve(mockHomepageData.services),
        staleTime: 1000 * 60 * 30, // 30 minutes
      }
    ]
  });

  return {
    header: queries[0],
    slider: queries[1], 
    employees: queries[2],
    services: queries[3],
    isLoading: queries.some(q => q.isLoading),
    isError: queries.some(q => q.isError),
    refetchAll: () => queries.forEach(q => q.refetch()),
  };
}

/**
 * Hook for intelligent cache invalidation
 */
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();
  
  return {
    // Invalidate all homepage cache
    invalidateHomepage: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage'] });
    },
    
    // Invalidate only dynamic content (news, notices)
    invalidateDynamic: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.news });
      queryClient.invalidateQueries({ queryKey: cacheKeys.notices });
    },
    
    // Invalidate only static content (header, services)
    invalidateStatic: () => {
      queryClient.invalidateQueries({ queryKey: cacheKeys.header });
      queryClient.invalidateQueries({ queryKey: cacheKeys.services });
    },
    
    // Clear all cache
    clearAll: () => {
      queryClient.clear();
    },
    
    // Get cache statistics
    getCacheStats: () => {
      const cache = queryClient.getQueryCache();
      return {
        totalQueries: cache.getAll().length,
        cachedQueries: cache.getAll().filter(q => q.state.data).length,
        stalQueries: cache.getAll().filter(q => q.isStale()).length,
      };
    }
  };
}