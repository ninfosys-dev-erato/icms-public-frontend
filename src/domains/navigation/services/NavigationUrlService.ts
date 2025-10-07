/**
 * Navigation URL Service
 * Handles navigation using backend's pre-computed resolvedUrl
 */

export interface MenuWithResolvedUrl {
  id: string;
  name: {
    en: string;
    ne: string;
  };
  resolvedUrl: string;
  categorySlug?: string;
  menuItems?: MenuItemWithResolvedUrl[];
}

export interface MenuItemWithResolvedUrl {
  id: string;
  title: {
    en: string;
    ne: string;
  };
  resolvedUrl: string;
  itemType: string;
  categorySlug?: string;
  contentSlug?: string;
  children?: MenuItemWithResolvedUrl[];
}

export class NavigationUrlService {
  /**
   * Get navigation URL from menu item
   * Backend already computes resolvedUrl, so we just use it directly!
   */
  static getNavigationUrl(item: MenuWithResolvedUrl | MenuItemWithResolvedUrl): string {
    // The backend already computed the perfect URL for us
    return item.resolvedUrl || '/';
  }
  
  /**
   * Check if a URL should be handled by our content system
   */
  static isContentUrl(url: string): boolean {
    return url.startsWith('/content/');
  }
  
  /**
   * Extract category and content slugs from a resolved URL
   */
  static parseContentUrl(url: string): { categorySlug?: string; contentSlug?: string } {
    if (!this.isContentUrl(url)) {
      return {};
    }
    
    // Remove /content/ prefix
    const path = url.replace('/content/', '');
    const segments = path.split('/');
    
    if (segments.length === 1) {
      return { categorySlug: segments[0] };
    }
    
    if (segments.length === 2) {
      return { 
        categorySlug: segments[0], 
        contentSlug: segments[1] 
      };
    }
    
    return {};
  }
  
  /**
   * Build content URL manually (for cases where we need to construct URLs)
   */
  static buildContentUrl(categorySlug?: string, contentSlug?: string): string {
    if (!categorySlug) {
      return '/';
    }
    
    if (!contentSlug) {
      return `/content/${categorySlug}`;
    }
    
    return `/content/${categorySlug}/${contentSlug}`;
  }
}