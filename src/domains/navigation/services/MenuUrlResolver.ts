import { NavigationItem } from '@/domains/header/types/header';

export interface MenuUrlResolverOptions {
  locale: 'en' | 'ne';
}

export class MenuUrlResolver {
  /**
   * Resolves a menu item to its appropriate URL based on itemType and itemId
   */
  static resolveMenuItemUrl(menuItem: NavigationItem, options: MenuUrlResolverOptions): string {
    const { locale } = options;
    
    // If menu item has explicit URL, use it (for external links, custom URLs)
    if (menuItem.href && menuItem.external) {
      return menuItem.href;
    }
    
    // Handle different menu item types based on backend MenuItemType enum
    switch (menuItem.itemType) {
      case 'CONTENT':
        return this.resolveContentUrl(menuItem, locale);
        
      case 'CATEGORY':
        return this.resolveCategoryUrl(menuItem, locale);
        
      case 'PAGE':
        return this.resolvePageUrl(menuItem, locale);
        
      case 'LINK':
        return menuItem.href || '/';
        
      case 'CUSTOM':
        return this.resolveCustomUrl(menuItem, locale);
        
      default:
        // Fallback to existing href or home
        return menuItem.href || '/';
    }
  }
  
  /**
   * Resolves content-type menu items to /content/[category]/[slug] format
   */
  private static resolveContentUrl(menuItem: NavigationItem, locale: 'en' | 'ne'): string {
    if (!menuItem.itemId) {
      return '/';
    }
    
    // We'll need to fetch content details to build the proper URL
    // For now, we can use a direct content ID approach or build the URL structure
    return `/content/by-id/${menuItem.itemId}`;
  }
  
  /**
   * Resolves category-type menu items to /content/[category-slug] format
   */
  private static resolveCategoryUrl(menuItem: NavigationItem, locale: 'en' | 'ne'): string {
    if (!menuItem.itemId) {
      return '/';
    }
    
    // We'll need category slug information
    // This could be cached or fetched from the menu API response
    return `/content/category/${menuItem.itemId}`;
  }
  
  /**
   * Resolves static page URLs
   */
  private static resolvePageUrl(menuItem: NavigationItem, locale: 'en' | 'ne'): string {
    if (!menuItem.itemId) {
      return menuItem.href || '/';
    }
    
    return `/pages/${menuItem.itemId}`;
  }
  
  /**
   * Resolves custom menu item URLs
   */
  private static resolveCustomUrl(menuItem: NavigationItem, locale: 'en' | 'ne'): string {
    // Handle special cases like contact, about, etc.
    if (menuItem.itemId) {
      switch (menuItem.itemId) {
        case 'contact':
          return `/${locale}/contact`;
        case 'about':
          return `/${locale}/about`;
        case 'search':
          return `/${locale}/search`;
        default:
          return menuItem.href || '/';
      }
    }
    
    return menuItem.href || '/';
  }
}

// Enhanced interface to include backend menu item properties
export interface EnhancedNavigationItem extends NavigationItem {
  itemType?: 'LINK' | 'CONTENT' | 'PAGE' | 'CATEGORY' | 'CUSTOM';
  itemId?: string;
}