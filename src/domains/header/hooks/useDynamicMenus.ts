'use client';

import { useState, useEffect } from 'react';
import { publicApiClient } from '@/repositories/http/PublicApiClient';

interface Menu {
  id: string;
  name: { en: string; ne: string };
  description?: { en: string; ne: string };
  resolvedUrl: string;
  categorySlug?: string;
  menuItems: MenuItem[];
}

interface MenuItem {
  id: string;
  title: { en: string; ne: string };
  description?: { en: string; ne: string };
  resolvedUrl: string;
  itemType: string;
  categorySlug?: string;
  contentSlug?: string;
  children: MenuItem[];
  isActive: boolean;
  isPublished: boolean;
  order: number;
}

interface NavigationItem {
  id: string;
  title: { en: string; ne: string };
  href: string;
  order: number;
  submenu?: NavigationItem[];
}

interface ApiResponse {
  success: boolean;
  data: Menu[];
  meta?: any;
}

// Fallback navigation data to ensure navbar is always visible
const getFallbackNavigation = (locale: 'en' | 'ne'): NavigationItem[] => [
  {
    id: 'home',
    title: { en: 'Home', ne: 'गृह' },
    href: '/',
    order: 0
  },
  {
    id: 'notices',
    title: { en: 'Notices', ne: 'सूचनाहरू' },
    href: '/content/notice-board',
    order: 1
  },
  {
    id: 'news',
    title: { en: 'News', ne: 'समाचार' },
    href: '/news',
    order: 2
  },
  {
    id: 'services',
    title: { en: 'Services', ne: 'सेवाहरू' },
    href: '/services',
    order: 3
  },
  {
    id: 'about',
    title: { en: 'About', ne: 'हाम्रोबारे' },
    href: '/about',
    order: 4
  }
];

export function useDynamicMenus(locale: 'en' | 'ne', location: 'HEADER' | 'FOOTER' | 'SIDEBAR' = 'HEADER') {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [navigation, setNavigation] = useState<NavigationItem[]>(getFallbackNavigation(locale));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenus();
  }, [location, locale]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching menus for location:', location);
      
      const response = await publicApiClient.get<ApiResponse>('/menus', {
        location,
        isActive: true,
        isPublished: true
      });
      
      console.log('API response:', response);
      
      if (response && response.success && response.data && Array.isArray(response.data)) {
        const menuData = response.data;
        setMenus(menuData);
        
        console.log('Raw menu data:', menuData);
        console.log('Menu count:', menuData.length);
        
        // Transform menu data to navigation format
        const navigationItems: NavigationItem[] = menuData.map((menu: Menu, index: number) => {
          console.log(`Processing menu: ${menu.name[locale] || menu.name.en}`, {
            id: menu.id,
            resolvedUrl: menu.resolvedUrl,
            menuItemsCount: menu.menuItems?.length || 0
          });
          
          const submenu = menu.menuItems && Array.isArray(menu.menuItems)
            ? menu.menuItems
                .filter(item => {
                  console.log(`Filtering menu item: ${item.title[locale] || item.title.en}`, {
                    isActive: item.isActive,
                    isPublished: item.isPublished,
                    resolvedUrl: item.resolvedUrl
                  });
                  return item.isActive && item.isPublished;
                })
                .sort((a, b) => a.order - b.order)
                .map((item: MenuItem, subIndex: number) => ({
                  id: item.id,
                  title: item.title,
                  href: item.resolvedUrl || '/',
                  order: item.order || subIndex
                }))
            : [];
          
          console.log(`Submenu for ${menu.name[locale] || menu.name.en}:`, submenu);
          
          return {
            id: menu.id,
            title: menu.name,
            href: menu.resolvedUrl || '/',
            order: index,
            submenu
          };
        });
        
        console.log('Final transformed navigation items:', navigationItems);
        
        // Only update navigation if we got valid data
        if (navigationItems.length > 0) {
          setNavigation(navigationItems);
        } else {
          console.warn('No valid navigation items found, using fallback');
          setNavigation(getFallbackNavigation(locale));
        }
      } else {
        console.warn('API response invalid or empty, using fallback navigation');
        setNavigation(getFallbackNavigation(locale));
        setError('Using fallback navigation - API data unavailable');
      }
    } catch (err) {
      console.error('Failed to fetch menus:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch navigation data');
      // Always ensure we have fallback navigation
      setNavigation(getFallbackNavigation(locale));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if an item is active
  const checkItemActive = (item: NavigationItem, currentPath: string): boolean => {
    // Check if current path matches the item href
    if (item.href === currentPath) return true;
    
    // Check if current path starts with item href (for nested routes)
    if (item.href !== '/' && currentPath.startsWith(item.href)) return true;
    
    // Check submenu items
    if (item.submenu) {
      return item.submenu.some(subItem => checkItemActive(subItem, currentPath));
    }
    
    return false;
  };

  const isItemActive = (item: NavigationItem) => {
    if (typeof window === 'undefined') return false;
    const currentPath = window.location.pathname;
    return checkItemActive(item, currentPath);
  };

  return {
    menus,
    navigation,
    loading,
    error,
    isItemActive,
    refetch: fetchMenus
  };
}