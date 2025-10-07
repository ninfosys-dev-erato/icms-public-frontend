import { publicApiClient } from './http/PublicApiClient'
import { 
  SliderResponse,
  HeaderConfigResponse,
  ImportantLinkResponse,
  SliderListResponse,
  HeaderConfigSingleResponse,
  ImportantLinkListResponse,
  SliderQuery,
  ImportantLinkQuery,
  SliderInteraction
} from '@/models'

/**
 * Media Repository - Handles media and display-related API calls
 * Maps to backend endpoints: /sliders, /header-configs, /important-links
 * Updated to match exact backend API structure
 */
export class MediaRepository {
  // Slider endpoints (/sliders)
  async getAllSliders(query?: SliderQuery): Promise<SliderListResponse> {
    const response = await publicApiClient.get('/sliders', query)
    return response as SliderListResponse
  }

  async getSliderById(id: string): Promise<SliderResponse | null> {
    try {
      const response = await publicApiClient.get(`/sliders/${id}`)
      if (response.success) {
        return response.data as SliderResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async getActiveSliders(): Promise<SliderResponse[]> {
    const response = await publicApiClient.get('/sliders/active')
    if (response.success) {
      return response.data as SliderResponse[]
    }
    throw new Error(response.error || 'Failed to fetch active sliders')
  }

  async getSlidersByPosition(position: 'homepage' | 'header' | 'sidebar'): Promise<SliderResponse[]> {
    const response = await publicApiClient.get(`/sliders/position/${position}`)
    if (response.success) {
      return response.data as SliderResponse[]
    }
    throw new Error(response.error || 'Failed to fetch sliders by position')
  }

  async recordSliderClick(id: string): Promise<void> {
    try {
      await publicApiClient.post(`/sliders/${id}/click`)
    } catch (error) {
      // Silently fail for analytics tracking
      console.warn(`Failed to record slider click for ${id}:`, error)
    }
  }

  async recordSliderView(id: string): Promise<void> {
    try {
      await publicApiClient.post(`/sliders/${id}/view`)
    } catch (error) {
      // Silently fail for analytics tracking
      console.warn(`Failed to record slider view for ${id}:`, error)
    }
  }

  // Header Config endpoints (/header-configs)
  async getAllHeaderConfigs(): Promise<HeaderConfigResponse[]> {
    const response = await publicApiClient.get('/header-configs')
    if (response.success) {
      return response.data as HeaderConfigResponse[]
    }
    throw new Error(response.error || 'Failed to fetch header configs')
  }

  async getHeaderConfigById(id: string): Promise<HeaderConfigResponse | null> {
    try {
      const response = await publicApiClient.get(`/header-configs/${id}`)
      if (response.success) {
        return response.data as HeaderConfigResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async getActiveHeaderConfig(): Promise<HeaderConfigResponse | null> {
    try {
      const response = await publicApiClient.get('/header-configs/active')
      const apiResponse = response as HeaderConfigSingleResponse
      if (apiResponse.success) {
        return apiResponse.data
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Important Links endpoints (/important-links)
  async getAllImportantLinks(query?: ImportantLinkQuery): Promise<ImportantLinkListResponse> {
    const response = await publicApiClient.get('/important-links', query)
    return response as ImportantLinkListResponse
  }

  async getImportantLinksPaginated(page = 1, pageSize = 20): Promise<ImportantLinkListResponse> {
    const response = await publicApiClient.get('/important-links/paginated', { page, pageSize })
    return response as ImportantLinkListResponse
  }

  async getFooterLinks(): Promise<ImportantLinkResponse[]> {
    const response = await publicApiClient.get('/important-links/footer')
    if (response.success) {
      return response.data as ImportantLinkResponse[]
    }
    throw new Error(response.error || 'Failed to fetch footer links')
  }

  async getActiveImportantLinks(): Promise<ImportantLinkResponse[]> {
    const response = await publicApiClient.get('/important-links/active')
    if (response.success) {
      return response.data as ImportantLinkResponse[]
    }
    throw new Error(response.error || 'Failed to fetch active important links')
  }

  async getImportantLinkById(id: string): Promise<ImportantLinkResponse | null> {
    try {
      const response = await publicApiClient.get(`/important-links/${id}`)
      if (response.success) {
        return response.data as ImportantLinkResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Convenience methods for homepage display
  async getHomepageSliders(): Promise<SliderResponse[]> {
    return this.getSlidersByPosition('homepage')
  }

  async getHeaderSliders(): Promise<SliderResponse[]> {
    return this.getSlidersByPosition('header')
  }

  async getSidebarSliders(): Promise<SliderResponse[]> {
    return this.getSlidersByPosition('sidebar')
  }

  // Get complete homepage media data for static generation
  async getHomepageMediaData(): Promise<{
    sliders: SliderResponse[]
    headerConfig: HeaderConfigResponse | null
    importantLinks: ImportantLinkResponse[]
  }> {
    const [sliders, headerConfig, importantLinks] = await Promise.all([
      this.getHomepageSliders(),
      this.getActiveHeaderConfig(),
      this.getActiveImportantLinks()
    ])

    return { sliders, headerConfig, importantLinks }
  }

  // Get footer data for static generation
  async getFooterData(): Promise<{
    links: ImportantLinkResponse[]
    headerConfig: HeaderConfigResponse | null
  }> {
    const [links, headerConfig] = await Promise.all([
      this.getFooterLinks(),
      this.getActiveHeaderConfig()
    ])

    return { links, headerConfig }
  }

  // Track slider interactions (for analytics)
  async trackSliderInteraction(interaction: SliderInteraction): Promise<void> {
    try {
      if (interaction.type === 'view') {
        await this.recordSliderView(interaction.sliderId)
      } else if (interaction.type === 'click') {
        await this.recordSliderClick(interaction.sliderId)
      }
    } catch (error) {
      // Silently fail for analytics tracking
      console.warn('Failed to track slider interaction:', error)
    }
  }
}

// Export singleton instance
export const mediaRepository = new MediaRepository()