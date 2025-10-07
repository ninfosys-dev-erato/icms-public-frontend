import { publicApiClient } from './http/PublicApiClient'
import { 
  ContentResponse,
  ContentQuery,
  ContentListResponse,
  ContentSingleResponse,
  Category,
  CategoryTreeResponse,
  FAQResponse,
  FAQQuery,
  FAQListResponse
} from '@/models'

/**
 * Content Repository - Handles content-related API calls
 * Maps to backend endpoints: /content, /categories, /faq
 * Updated to match exact backend DTOs and API structure
 */
export class ContentRepository {
  // Content endpoints (/content)
  async getAllContent(query?: ContentQuery): Promise<ContentListResponse> {
    const response = await publicApiClient.get('/content', query)
    return response as ContentListResponse
  }

  async getFeaturedContent(): Promise<ContentResponse[]> {
    const response = await publicApiClient.get('/content/featured')
    if (response.success) {
      return response.data as ContentResponse[]
    }
    throw new Error(response.error || 'Failed to fetch featured content')
  }

  async searchContent(searchTerm: string, query?: Omit<ContentQuery, 'search'>): Promise<ContentListResponse> {
    const response = await publicApiClient.get('/content/search', { search: searchTerm, ...query })
    return response as ContentListResponse
  }

  async getContentBySlug(slug: string): Promise<ContentResponse | null> {
    try {
      const response = await publicApiClient.get(`/content/${slug}`)
      if (response.success) {
        return response.data as ContentResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async getContentByCategory(categorySlug: string, query?: Omit<ContentQuery, 'category'>): Promise<ContentListResponse> {
    const response = await publicApiClient.get(`/content/category/${categorySlug}`, query)
    return response as ContentListResponse
  }

  async getContentAttachments(contentId: string): Promise<any[]> {
    try {
      const response = await publicApiClient.get(`/content/${contentId}/attachments`)
      if (response.success) {
        return response.data as any[]
      }
      return []
    } catch (error) {
      console.warn(`Failed to fetch attachments for content ${contentId}:`, error)
      return []
    }
  }

  // Note: Backend doesn't seem to have separate /categories endpoints
  // Categories are included in content responses
  async getCategoriesFromContent(): Promise<Category[]> {
    try {
      // Get all content and extract unique categories
      const contentResponse = await this.getAllContent({ page: 1, limit: 100 })
      const categories: Category[] = []
      const categoryMap = new Map<string, Category>()

      if (contentResponse.success && contentResponse.data) {
        contentResponse.data.forEach(content => {
          if (content.category && !categoryMap.has(content.category.id)) {
            categoryMap.set(content.category.id, content.category)
            categories.push(content.category)
          }
        })
      }

      return categories
    } catch (error) {
      console.warn('Failed to extract categories from content:', error)
      return []
    }
  }

  // FAQ endpoints (/faq)
  async getAllFAQs(): Promise<FAQResponse[]> {
    const response = await publicApiClient.get('/faq')
    if (response.success) {
      return response.data as FAQResponse[]
    }
    throw new Error(response.error || 'Failed to fetch FAQs')
  }

  async getFAQsPaginated(query: FAQQuery): Promise<FAQListResponse> {
    const response = await publicApiClient.get('/faq/paginated', query)
    return response as FAQListResponse
  }

  async searchFAQs(searchTerm: string, query?: Omit<FAQQuery, 'search'>): Promise<FAQListResponse> {
    const response = await publicApiClient.get('/faq/search', { search: searchTerm, ...query })
    return response as FAQListResponse
  }

  async getRandomFAQs(limit = 5): Promise<FAQResponse[]> {
    try {
      const response = await publicApiClient.get('/faq/random', { limit })
      if (response.success) {
        return response.data as FAQResponse[]
      }
      return []
    } catch (error) {
      console.warn('Failed to fetch random FAQs:', error)
      return []
    }
  }

  async getPopularFAQs(limit = 10): Promise<FAQResponse[]> {
    try {
      const response = await publicApiClient.get('/faq/popular', { limit })
      if (response.success) {
        return response.data as FAQResponse[]
      }
      return []
    } catch (error) {
      console.warn('Failed to fetch popular FAQs:', error)
      return []
    }
  }

  async getActiveFAQs(): Promise<FAQResponse[]> {
    const response = await publicApiClient.get('/faq/active')
    if (response.success) {
      return response.data as FAQResponse[]
    }
    throw new Error(response.error || 'Failed to fetch active FAQs')
  }

  async getFAQById(id: string): Promise<FAQResponse | null> {
    try {
      const response = await publicApiClient.get(`/faq/${id}`)
      if (response.success) {
        return response.data as FAQResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }
}

// Export singleton instance
export const contentRepository = new ContentRepository()