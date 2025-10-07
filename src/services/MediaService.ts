import { 
  mediaRepository,
  documentRepository,
  type Slider,
  type HeaderConfig,
  type ImportantLink,
  type SliderFilter,
  type ImportantLinkFilter,
  type Document
} from '@/repositories'

/**
 * Media Service - Business logic for media and display content
 * Handles caching, orchestration, and business rules for sliders, headers, links
 */
export class MediaService {
  // Slider methods
  async getAllSliders(filters?: SliderFilter): Promise<Slider[]> {
    return mediaRepository.getAllSliders(filters)
  }

  async getSliderById(id: string): Promise<Slider | null> {
    return mediaRepository.getSliderById(id)
  }

  async getActiveSliders(): Promise<Slider[]> {
    return mediaRepository.getActiveSliders()
  }

  async getSlidersByPosition(position: 'homepage' | 'header' | 'sidebar'): Promise<Slider[]> {
    return mediaRepository.getSlidersByPosition(position)
  }

  // Header config methods
  async getActiveHeaderConfig(): Promise<HeaderConfig | null> {
    return mediaRepository.getActiveHeaderConfig()
  }

  // Important links methods
  async getAllImportantLinks(filters?: ImportantLinkFilter): Promise<{
    items: ImportantLink[]
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }> {
    return mediaRepository.getAllImportantLinks(filters)
  }

  async getFooterLinks(): Promise<ImportantLink[]> {
    return mediaRepository.getFooterLinks()
  }

  async getActiveImportantLinks(): Promise<ImportantLink[]> {
    return mediaRepository.getActiveImportantLinks()
  }

  // Document methods (for downloads/media)
  async getPopularDocuments(limit = 10): Promise<Document[]> {
    return documentRepository.getPopularDocuments(limit)
  }

  async getRecentDocuments(limit = 10): Promise<Document[]> {
    return documentRepository.getRecentDocuments(limit)
  }

  // Analytics methods
  async trackSliderClick(id: string): Promise<void> {
    try {
      await mediaRepository.recordSliderClick(id)
    } catch (error) {
      console.warn('Failed to track slider click:', error)
    }
  }

  async trackSliderView(id: string): Promise<void> {
    try {
      await mediaRepository.recordSliderView(id)
    } catch (error) {
      console.warn('Failed to track slider view:', error)
    }
  }

  // Homepage aggregation methods
  async getHomepageMediaData(): Promise<{
    sliders: Slider[]
    headerConfig: HeaderConfig | null
    importantLinks: ImportantLink[]
    popularDocuments: Document[]
  }> {
    const [slidersResponse, headerConfig, importantLinks, popularDocuments] = await Promise.all([
      this.getSlidersByPosition('homepage'),
      this.getActiveHeaderConfig(),
      this.getActiveImportantLinks(),
      this.getPopularDocuments(6)
    ])

    return {
      sliders: slidersResponse,
      headerConfig,
      importantLinks,
      popularDocuments
    }
  }

  async getLayoutMediaData(): Promise<{
    headerConfig: HeaderConfig | null
    footerLinks: ImportantLink[]
    headerSliders: Slider[]
    sidebarSliders: Slider[]
  }> {
    const [headerConfig, footerLinks, headerSliders, sidebarSliders] = await Promise.all([
      this.getActiveHeaderConfig(),
      this.getFooterLinks(),
      this.getSlidersByPosition('header'),
      this.getSlidersByPosition('sidebar')
    ])

    return {
      headerConfig,
      footerLinks,
      headerSliders,
      sidebarSliders
    }
  }

  // Filter and sort methods
  filterSlidersByDateRange(sliders: Slider[], startDate?: string, endDate?: string): Slider[] {
    return sliders.filter(slider => {
      const now = new Date()
      
      if (slider.startDate && new Date(slider.startDate) > now) {
        return false
      }
      
      if (slider.endDate && new Date(slider.endDate) < now) {
        return false
      }
      
      if (startDate && slider.startDate && new Date(slider.startDate) < new Date(startDate)) {
        return false
      }
      
      if (endDate && slider.endDate && new Date(slider.endDate) > new Date(endDate)) {
        return false
      }
      
      return true
    })
  }

  sortSlidersByOrder(sliders: Slider[]): Slider[] {
    return sliders.sort((a, b) => a.order - b.order)
  }

  groupImportantLinksByCategory(links: ImportantLink[]): Record<string, ImportantLink[]> {
    return links.reduce((groups, link) => {
      const category = link.category || 'other'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(link)
      return groups
    }, {} as Record<string, ImportantLink[]>)
  }

  // SEO and metadata methods
  async getSEOData(): Promise<{
    headerConfig: HeaderConfig | null
    featuredSliders: Slider[]
  }> {
    const [headerConfig, allSliders] = await Promise.all([
      this.getActiveHeaderConfig(),
      this.getActiveSliders()
    ])

    // Get featured/homepage sliders for SEO
    const featuredSliders = allSliders.filter(slider => 
      slider.position === 'homepage' && slider.isActive
    ).slice(0, 3)

    return {
      headerConfig,
      featuredSliders
    }
  }
}

// Export singleton instance
export const mediaService = new MediaService()

