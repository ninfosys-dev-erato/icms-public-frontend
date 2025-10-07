import { 
  navigationRepository,
  type Menu,
  type MenuItem,
  type Breadcrumb,
  type MenuFilter
} from '@/repositories'

/**
 * Navigation Service - Business logic for navigation management
 * Handles caching, orchestration, and business rules for site navigation
 */
export class NavigationService {
  // Menu methods
  async getAllMenus(filters?: MenuFilter): Promise<Menu[]> {
    return navigationRepository.getAllMenus(filters)
  }

  async getMenuById(id: string): Promise<Menu | null> {
    return navigationRepository.getMenuById(id)
  }

  async getMenuByLocation(location: 'header' | 'footer' | 'sidebar'): Promise<Menu | null> {
    return navigationRepository.getMenuByLocation(location)
  }

  async getMenuTree(id: string): Promise<Menu | null> {
    return navigationRepository.getMenuTree(id)
  }

  // Menu item methods
  async getAllMenuItems(): Promise<MenuItem[]> {
    return navigationRepository.getAllMenuItems()
  }

  async getMenuItemsByMenu(menuId: string): Promise<MenuItem[]> {
    return navigationRepository.getMenuItemsByMenu(menuId)
  }

  async getMenuItemBreadcrumb(itemId: string): Promise<Breadcrumb> {
    return navigationRepository.getMenuItemBreadcrumb(itemId)
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    return navigationRepository.getMenuItemById(id)
  }

  // Convenience methods
  async getHeaderMenu(): Promise<Menu | null> {
    return navigationRepository.getHeaderMenu()
  }

  async getFooterMenu(): Promise<Menu | null> {
    return navigationRepository.getFooterMenu()
  }

  async getSidebarMenu(): Promise<Menu | null> {
    return navigationRepository.getSidebarMenu()
  }

  // Get complete navigation structure for layout
  async getCompleteNavigation(): Promise<{
    header: Menu | null
    footer: Menu | null
    sidebar: Menu | null
  }> {
    return navigationRepository.getCompleteNavigation()
  }

  // Generate breadcrumbs from current path
  generateBreadcrumbsFromPath(path: string, locale = 'ne'): Breadcrumb {
    const segments = path.split('/').filter(Boolean)
    const breadcrumbs: Breadcrumb = []

    // Add home
    breadcrumbs.push({
      title: locale === 'ne' ? 'मुख्य पृष्ठ' : 'Home',
      title_en: 'Home',
      url: `/${locale}`,
      isActive: segments.length === 1 && segments[0] === locale
    })

    let currentPath = `/${locale}`
    
    segments.forEach((segment, index) => {
      if (segment === locale) return // Skip locale segment
      
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1

      // Convert segment to readable title
      const title = this.segmentToTitle(segment, locale)
      
      breadcrumbs.push({
        title: title,
        title_en: this.segmentToTitle(segment, 'en'),
        url: currentPath,
        isActive: isLast
      })
    })

    return breadcrumbs
  }

  // Convert URL segment to readable title
  private segmentToTitle(segment: string, locale: string): string {
    const titleMap: Record<string, { ne: string; en: string }> = {
      'content': { ne: 'सामग्री', en: 'Content' },
      'documents': { ne: 'कागजातहरू', en: 'Documents' },
      'search': { ne: 'खोजी', en: 'Search' },
      'office': { ne: 'कार्यालय', en: 'Office' },
      'about': { ne: 'बारेमा', en: 'About' },
      'services': { ne: 'सेवाहरू', en: 'Services' },
      'contact': { ne: 'सम्पर्क', en: 'Contact' },
      'faq': { ne: 'बारम्बार सोधिने प्रश्नहरू', en: 'FAQ' },
      'news': { ne: 'समाचार', en: 'News' },
      'notices': { ne: 'सूचनाहरू', en: 'Notices' },
      'events': { ne: 'कार्यक्रमहरू', en: 'Events' }
    }

    const mapped = titleMap[segment]
    if (mapped) {
      return locale === 'ne' ? mapped.ne : mapped.en
    }

    // Fallback: capitalize and replace hyphens/underscores with spaces
    return segment
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  // Check if menu item is active based on current path
  isMenuItemActive(menuItem: MenuItem, currentPath: string): boolean {
    if (menuItem.url === currentPath) return true
    
    // Check if current path starts with menu item URL (for parent items)
    if (currentPath.startsWith(menuItem.url) && menuItem.url !== '/') {
      return true
    }

    return false
  }

  // Get active menu item from current path
  async getActiveMenuItem(menuId: string, currentPath: string): Promise<MenuItem | null> {
    const menuItems = await this.getMenuItemsByMenu(menuId)
    
    // Find exact match first
    let activeItem = menuItems.find(item => item.url === currentPath) || null
    
    // If no exact match, find parent item
    if (!activeItem) {
      activeItem = menuItems.find(item => 
        currentPath.startsWith(item.url) && item.url !== '/'
      ) || null
    }

    return activeItem
  }
}

// Export singleton instance
export const navigationService = new NavigationService()
