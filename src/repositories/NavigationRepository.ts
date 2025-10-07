import { publicApiClient } from './http/PublicApiClient'
import { 
  Menu,
  MenuItem,
  NavigationQuery,
  MenuListResponse,
  NavigationResponse,
  StaticNavigation,
  MenuLocation,
  BreadcrumbItem
} from '@/models'

/**
 * Navigation Repository - Handles navigation-related API calls
 * Currently uses frontend-generated navigation since backend doesn't have navigation module
 * This will be updated when backend navigation is implemented
 */
export class NavigationRepository {
  // Static navigation structure (temporary implementation)
  private async getStaticNavigation(): Promise<StaticNavigation> {
    // This will be replaced with actual API calls when backend navigation is ready
    return {
      header: {
        id: 'main-header',
        name: { ne: 'मुख्य मेनु', en: 'Main Menu' },
        location: 'header',
        isActive: true,
        order: 0,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      footer: {
        id: 'main-footer',
        name: { ne: 'फुटर मेनु', en: 'Footer Menu' },
        location: 'footer',
        isActive: true,
        order: 0,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  }

  // Main navigation methods (will use API when backend is ready)
  async getAllMenus(query?: NavigationQuery): Promise<Menu[]> {
    try {
      // Try to get from API first (when backend navigation is implemented)
      const response = await publicApiClient.get('/navigation/menus', query)
      if (response.success) {
        return response.data as Menu[]
      }
      
      // Fallback to static navigation
      const staticNav = await this.getStaticNavigation()
      return Object.values(staticNav).filter(Boolean) as Menu[]
    } catch (error) {
      // Fallback to static navigation
      const staticNav = await this.getStaticNavigation()
      return Object.values(staticNav).filter(Boolean) as Menu[]
    }
  }

  async getMenuByLocation(location: MenuLocation): Promise<Menu | null> {
    try {
      // Try to get from API first
      const response = await publicApiClient.get(`/navigation/menus/location/${location}`)
      if (response.success) {
        return response.data as Menu
      }
      
      // Fallback to static navigation
      const staticNav = await this.getStaticNavigation()
      return staticNav[location] || null
    } catch (error) {
      // Fallback to static navigation
      const staticNav = await this.getStaticNavigation()
      return staticNav[location] || null
    }
  }

  async getMenuById(id: string): Promise<Menu | null> {
    try {
      const response = await publicApiClient.get(`/navigation/menus/${id}`)
      if (response.success) {
        return response.data as Menu
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Navigation structure methods
  async getCompleteNavigation(): Promise<NavigationResponse> {
    try {
      const response = await publicApiClient.get('/navigation')
      if (response.success) {
        return response as NavigationResponse
      }
      
      // Fallback to static navigation
      const staticNav = await this.getStaticNavigation()
      return {
        success: true,
        data: staticNav
      }
    } catch (error) {
      // Fallback to static navigation
      const staticNav = await this.getStaticNavigation()
      return {
        success: true,
        data: staticNav
      }
    }
  }

  // Convenience methods for specific menu locations
  async getHeaderMenu(): Promise<Menu | null> {
    return this.getMenuByLocation('header')
  }

  async getFooterMenu(): Promise<Menu | null> {
    return this.getMenuByLocation('footer')
  }

  async getSidebarMenu(): Promise<Menu | null> {
    return this.getMenuByLocation('sidebar')
  }

  async getMobileMenu(): Promise<Menu | null> {
    return this.getMenuByLocation('mobile')
  }

  // Breadcrumb generation (frontend utility)
  generateBreadcrumbs(currentPath: string, currentTitle: { ne: string; en: string }): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [
      {
        title: { ne: 'गृह पृष्ठ', en: 'Home' },
        url: '/',
        isActive: false,
        isExternal: false
      }
    ]

    // Parse current path and build breadcrumbs
    const pathSegments = currentPath.split('/').filter(segment => segment.length > 0)
    
    let cumulativePath = ''
    pathSegments.forEach((segment, index) => {
      cumulativePath += `/${segment}`
      
      if (index === pathSegments.length - 1) {
        // Current page
        breadcrumbs.push({
          title: currentTitle,
          url: cumulativePath,
          isActive: true,
          isExternal: false
        })
      } else {
        // Parent pages (you might want to fetch actual titles from content/navigation)
        breadcrumbs.push({
          title: { 
            ne: this.formatSegmentTitle(segment, 'ne'),
            en: this.formatSegmentTitle(segment, 'en')
          },
          url: cumulativePath,
          isActive: false,
          isExternal: false
        })
      }
    })

    return breadcrumbs
  }

  private formatSegmentTitle(segment: string, lang: 'ne' | 'en'): string {
    // Convert URL segment to readable title
    const formatted = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
    
    // You could add translation logic here
    return formatted
  }

  // Menu item utilities
  async getMenuItemsByParent(parentId: string): Promise<MenuItem[]> {
    try {
      const response = await publicApiClient.get(`/navigation/menu-items/parent/${parentId}`)
      if (response.success) {
        return response.data as MenuItem[]
      }
      return []
    } catch (error) {
      console.warn(`Failed to fetch menu items for parent ${parentId}:`, error)
      return []
    }
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    try {
      const response = await publicApiClient.get(`/navigation/menu-items/${id}`)
      if (response.success) {
        return response.data as MenuItem
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Dynamic navigation building from content structure
  async buildNavigationFromContent(): Promise<StaticNavigation> {
    try {
      // This would typically fetch content categories and build navigation
      // For now, return static structure
      return await this.getStaticNavigation()
    } catch (error) {
      console.warn('Failed to build navigation from content:', error)
      return await this.getStaticNavigation()
    }
  }
}

// Export singleton instance
export const navigationRepository = new NavigationRepository()