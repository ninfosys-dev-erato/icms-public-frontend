import { navigationRepository } from '../repositories/NavigationRepository';
import {
  MenuLocation,
  MenuResponse,
  MenuItemResponse,
  MenuQueryDto,
  MenuItemQueryDto
} from '../repositories/NavigationRepository';
import { 
  NavigationItem,
  TranslatableEntity 
} from '../../header/types/header';

/**
 * NavigationService handles the transformation between backend navigation data
 * and frontend navigation format
 */
export class NavigationService {

  // ========================================
  // MAIN NAVIGATION OPERATIONS
  // ========================================

  /**
   * Get header navigation items
   */
  static async getHeaderNavigation(locale: 'ne' | 'en' = 'en'): Promise<NavigationItem[]> {
    try {
      // Use the direct endpoint to get header menu with menu items included
      console.log('NavigationService: Fetching header navigation from /menus/location/HEADER');
      const response = await navigationRepository.getMenuByLocation(MenuLocation.HEADER);
      console.log('NavigationService: Raw API response:', response);
      
      const extractedData = this.extractDataFromResponse(response);
      console.log('NavigationService: Extracted data:', extractedData);

      // Handle the nested data structure: { data: { data: [...] } }
      let menusData = extractedData;
      if (extractedData && extractedData.data && Array.isArray(extractedData.data)) {
        menusData = extractedData.data;
      } else if (!Array.isArray(extractedData)) {
        console.log('NavigationService: Unexpected data structure, using fallback navigation');
        return this.createFallbackNavigation(locale);
      }

      console.log('NavigationService: Processed menus data:', menusData);

      if (!menusData || !Array.isArray(menusData) || menusData.length === 0) {
        console.log('NavigationService: No header menus found, using fallback navigation');
        return this.createFallbackNavigation(locale);
      }

      // Convert each menu to a top-level navigation item
      // Each menu becomes a main navigation item, and its menuItems become submenu
      const navigationItems: NavigationItem[] = menusData
        .filter(menu => menu.isActive && menu.isPublished)
        .map((menu, index) => {
          const menuItems = menu.menuItems || [];
          console.log(`NavigationService: Processing menu "${menu.name.en}" with ${menuItems.length} items:`, menuItems);
          
          const navigationItem: NavigationItem = {
            id: menu.id,
            title: menu.name,
            href: menu.resolvedUrl || '/', // Use resolvedUrl from API, fallback to /
            order: menu.order ?? index, // Use backend order field, fallback to index
            isActive: menu.isActive && menu.isPublished,
            external: false,
            description: menu.description
          };

          // If this menu has menu items, they become the submenu
          if (menuItems.length > 0) {
            const transformedSubmenu = this.transformMenuItemsToNavigationItems(menuItems, locale);
            console.log(`NavigationService: Transformed submenu for "${menu.name.en}":`, transformedSubmenu);
            navigationItem.submenu = transformedSubmenu;
          }

          console.log(`NavigationService: Created navigation item:`, navigationItem);
          return navigationItem;
        })
        .sort((a, b) => a.order - b.order); // Sort by backend order field

      console.log('NavigationService: Final navigation items:', navigationItems);
      console.log('NavigationService: Navigation items with submenus:', 
        navigationItems.filter(item => item.submenu && item.submenu.length > 0));

      if (navigationItems.length === 0) {
        console.log('NavigationService: No valid navigation items found, using fallback navigation');
        return this.createFallbackNavigation(locale);
      }

      return navigationItems;
    } catch (error) {
      console.error('NavigationService: Failed to fetch header navigation', error);
      return this.createFallbackNavigation(locale);
    }
  }

  /**
   * Get menu by location
   */
  static async getMenuByLocation(location: MenuLocation): Promise<MenuResponse | null> {
    try {
      const response = await navigationRepository.getMenuByLocation(location);
      return this.extractDataFromResponse(response);
    } catch (error) {
      console.error('NavigationService: Failed to get menu by location', error);
      throw error;
    }
  }

  /**
   * Get menu tree structure
   */
  static async getMenuTree(menuId: string): Promise<{ menu: MenuResponse; items: NavigationItem[] }> {
    try {
      const response = await navigationRepository.getMenuTree(menuId);
      const data = this.extractDataFromResponse(response);
      
      if (!data) {
        throw new Error('Menu tree not found');
      }
      
      return {
        menu: data.menu,
        items: this.transformMenuItemsToNavigationItems(data.items)
      };
    } catch (error) {
      console.error('NavigationService: Failed to get menu tree', error);
      throw error;
    }
  }

  /**
   * Search navigation items
   */
  static async searchNavigation(searchTerm: string, query?: MenuItemQueryDto): Promise<NavigationItem[]> {
    try {
      const response = await navigationRepository.searchMenuItems(searchTerm, query);
      const data = this.extractDataFromResponse(response);
      
      if (!data || !data.data) {
        return [];
      }
      
      return this.transformMenuItemsToNavigationItems(data.data);
    } catch (error) {
      console.error('NavigationService: Failed to search navigation', error);
      throw error;
    }
  }

  /**
   * Get breadcrumb trail
   */
  static async getBreadcrumb(itemId: string): Promise<NavigationItem[]> {
    try {
      const response = await navigationRepository.getBreadcrumb(itemId);
      const breadcrumbItems = this.extractDataFromResponse(response);
      
      if (!breadcrumbItems || !Array.isArray(breadcrumbItems)) {
        return [];
      }
      
      return this.transformMenuItemsToNavigationItems(breadcrumbItems);
    } catch (error) {
      console.error('NavigationService: Failed to get breadcrumb', error);
      return [];
    }
  }

  // ========================================
  // TRANSFORMATION METHODS
  // ========================================

  /**
   * Transform backend MenuItemResponse[] to frontend NavigationItem[]
   * This handles both flat structure and nested parent-child relationships
   */
  private static transformMenuItemsToNavigationItems(
    menuItems: MenuItemResponse[], 
    locale?: 'ne' | 'en'
  ): NavigationItem[] {
    if (!Array.isArray(menuItems)) return [];
    
    // First pass: Create a map of all items
    const itemMap = new Map<string, MenuItemResponse>();
    const rootItems: MenuItemResponse[] = [];
    
    // Separate root items (no parentId) from child items, only including active and published items
    menuItems.forEach(item => {
      if (item.isActive && item.isPublished) {
        itemMap.set(item.id, item);
        if (!item.parentId) {
          rootItems.push(item);
        }
      }
    });
    
    // Second pass: Build the hierarchy by assigning children to their parents
    menuItems.forEach(item => {
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!;
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(item);
      }
    });
    
    // Third pass: Sort children arrays by order
    itemMap.forEach(item => {
      if (item.children) {
        item.children.sort((a, b) => a.order - b.order);
      }
    });
    
    // Transform root items (children will be transformed recursively)
    return rootItems
      .sort((a, b) => a.order - b.order)
      .map(item => this.transformMenuItemToNavigationItem(item, locale));
  }

  /**
   * Transform single MenuItemResponse to NavigationItem
   */
  private static transformMenuItemToNavigationItem(
    menuItem: MenuItemResponse, 
    locale?: 'ne' | 'en'
  ): NavigationItem {
    // Process the URL to ensure it's valid - use resolvedUrl from API
    let href = '/';
    if (menuItem.resolvedUrl && menuItem.resolvedUrl.trim()) {
      href = menuItem.resolvedUrl.trim();
    } else if (menuItem.url && menuItem.url.trim()) {
      let url = menuItem.url.trim();
      // Add protocol if missing for external URLs
      if (!url.startsWith('http') && !url.startsWith('/') && !url.startsWith('#')) {
        url = `https://${url}`;
      }
      href = url;
    }

    const navigationItem: NavigationItem = {
      id: menuItem.id,
      title: menuItem.title,
      href: href,
      order: menuItem.order,
      isActive: menuItem.isActive && menuItem.isPublished,
      external: menuItem.target === '_blank',
      description: menuItem.description
    };

    console.log(`NavigationService: Transformed menu item "${menuItem.title.en}" - resolvedUrl: "${menuItem.resolvedUrl}" -> href: "${href}"`);

    // Transform children if they exist (recursive transformation)
    if (menuItem.children && menuItem.children.length > 0) {
      navigationItem.submenu = menuItem.children
        .filter(child => child.isActive && child.isPublished) // Only include active and published items
        .sort((a, b) => a.order - b.order)
        .map(child => this.transformMenuItemToNavigationItem(child, locale));
    }

    return navigationItem;
  }

  /**
   * Extract data from API response
   */
  private static extractDataFromResponse(response: any): any | null {
    if (!response) return null;
    
    // Handle standardized API response format
    if (response.data !== undefined) {
      return response.data;
    }
    
    // Handle case where response is already an array (direct menus array)
    if (Array.isArray(response)) {
      return { data: response };
    }
    
    // Handle direct data
    return response;
  }

  /**
   * Create fallback navigation based on common office structure
   */
  private static createFallbackNavigation(locale: 'ne' | 'en'): NavigationItem[] {
    const isNepali = locale === 'ne';
    
    return [
      {
        id: 'home',
        title: { en: 'Home', ne: 'गृह' },
        href: '/',
        order: 1,
        isActive: true,
        external: false
      },
      {
        id: 'downloads',
        title: { en: 'Downloads', ne: 'डाउनलोड' },
        href: '/downloads',
        order: 2,
        isActive: true,
        external: false,
        submenu: [
          {
            id: 'downloads-forms',
            title: { en: 'Forms', ne: 'फारामहरू' },
            href: '/downloads/forms',
            order: 1,
            isActive: true,
            external: false
          },
          {
            id: 'downloads-reports',
            title: { en: 'Reports', ne: 'प्रतिवेदनहरू' },
            href: '/downloads/reports',
            order: 2,
            isActive: true,
            external: false
          },
          {
            id: 'downloads-publications',
            title: { en: 'Publications', ne: 'प्रकाशनहरू' },
            href: '/downloads/publications',
            order: 3,
            isActive: true,
            external: false
          }
        ]
      },
      {
        id: 'gallery',
        title: { en: 'Gallery', ne: 'ग्यालेरी' },
        href: '/gallery',
        order: 3,
        isActive: true,
        external: false,
        submenu: [
          {
            id: 'gallery-photos',
            title: { en: 'Photos', ne: 'फोटोहरू' },
            href: '/gallery/photos',
            order: 1,
            isActive: true,
            external: false
          },
          {
            id: 'gallery-videos',
            title: { en: 'Videos', ne: 'भिडियोहरू' },
            href: '/gallery/videos',
            order: 2,
            isActive: true,
            external: false
          }
        ]
      },
      {
        id: 'acts-policies',
        title: { en: 'Acts & Policies', ne: 'ऐन, नीति तथा निर्देशन' },
        href: '/acts-policies',
        order: 4,
        isActive: true,
        external: false,
        submenu: [
          {
            id: 'acts-policies-acts',
            title: { en: 'Acts', ne: 'ऐनहरू' },
            href: '/acts-policies/acts',
            order: 1,
            isActive: true,
            external: false
          },
          {
            id: 'acts-policies-policies',
            title: { en: 'Policies', ne: 'नीतिहरू' },
            href: '/acts-policies/policies',
            order: 2,
            isActive: true,
            external: false
          },
          {
            id: 'acts-policies-guidelines',
            title: { en: 'Guidelines', ne: 'निर्देशनहरू' },
            href: '/acts-policies/guidelines',
            order: 3,
            isActive: true,
            external: false
          }
        ]
      },
      {
        id: 'plans-programs',
        title: { en: 'Plans & Programs', ne: 'योजना तथा कार्यक्रम' },
        href: '/plans-programs',
        order: 5,
        isActive: true,
        external: false,
        submenu: [
          {
            id: 'plans-programs-annual',
            title: { en: 'Annual Plans', ne: 'वार्षिक योजनाहरू' },
            href: '/plans-programs/annual',
            order: 1,
            isActive: true,
            external: false
          },
          {
            id: 'plans-programs-projects',
            title: { en: 'Projects', ne: 'परियोजनाहरू' },
            href: '/plans-programs/projects',
            order: 2,
            isActive: true,
            external: false
          },
          {
            id: 'plans-programs-development',
            title: { en: 'Development Plans', ne: 'विकास योजनाहरू' },
            href: '/plans-programs/development',
            order: 3,
            isActive: true,
            external: false
          }
        ]
      },
      {
        id: 'news',
        title: { en: 'News', ne: 'समाचार' },
        href: '/news',
        order: 6,
        isActive: true,
        external: false
      },
      {
        id: 'contact',
        title: { en: 'Contact', ne: 'सम्पर्क' },
        href: '/contact',
        order: 7,
        isActive: true,
        external: false
      }
    ];
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Get localized text from translatable entity
   */
  static getLocalizedText(entity: TranslatableEntity | any, locale: 'ne' | 'en'): string {
    if (!entity || typeof entity !== 'object') return '';
    return entity[locale] || entity.en || entity.ne || '';
  }

  /**
   * Find navigation item by href
   */
  static findNavigationItemByHref(items: NavigationItem[], href: string): NavigationItem | null {
    const findInItems = (navItems: NavigationItem[]): NavigationItem | null => {
      for (const item of navItems) {
        if (item.href === href) {
          return item;
        }
        if (item.submenu) {
          const found = findInItems(item.submenu);
          if (found) return found;
        }
      }
      return null;
    };

    return findInItems(items);
  }

  /**
   * Check if navigation item is active based on current path
   */
  static isNavigationItemActive(item: NavigationItem, currentPath: string): boolean {
    // Exact match for home page
    if (item.href === '/' && currentPath === '/') {
      return true;
    }

    // For other pages, check if current path starts with item href
    if (item.href !== '/' && currentPath.startsWith(item.href)) {
      return true;
    }

    // Check submenu items
    if (item.submenu) {
      return item.submenu.some(subItem => this.isNavigationItemActive(subItem, currentPath));
    }

    return false;
  }

  /**
   * Get breadcrumb trail for current navigation
   */
  static getBreadcrumbTrail(items: NavigationItem[], currentPath: string): NavigationItem[] {
    const trail: NavigationItem[] = [];

    const findTrail = (navItems: NavigationItem[], path: NavigationItem[] = []): boolean => {
      for (const item of navItems) {
        const currentTrail = [...path, item];
        
        if (this.isNavigationItemActive(item, currentPath)) {
          trail.push(...currentTrail);
          return true;
        }
        
        if (item.submenu && findTrail(item.submenu, currentTrail)) {
          return true;
        }
      }
      return false;
    };

    findTrail(items);
    return trail;
  }
}