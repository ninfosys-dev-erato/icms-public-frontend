import { 
  contentRepository,
  type Content,
  type ContentFilter,
  type ContentListResponse,
  type Category,
  type FAQ,
  type FAQListResponse
} from '@/repositories'

/**
 * Public Content Service - Business logic for content management
 * Handles caching, orchestration, and business rules for public content
 */
export class PublicContentService {
  // Content methods
  async getAllContent(filters?: ContentFilter): Promise<ContentListResponse> {
    return contentRepository.getAllContent(filters)
  }

  async getFeaturedContent(): Promise<Content[]> {
    return contentRepository.getFeaturedContent()
  }

  async getLatestContent(limit = 10): Promise<Content[]> {
    const response = await contentRepository.getAllContent({
      page: 1,
      limit: limit,
      sort: 'publishedAt',
      order: 'desc'
    })
    return response.success ? response.data : []
  }

  async getContentBySlug(slug: string): Promise<Content | null> {
    return contentRepository.getContentBySlug(slug)
  }

  async searchContent(query: string, filters?: Omit<ContentFilter, 'q'>): Promise<ContentListResponse> {
    return contentRepository.searchContent(query, filters)
  }

  async getContentByType(type: 'article' | 'news' | 'announcement' | 'event', filters?: Omit<ContentFilter, 'type'>): Promise<ContentListResponse> {
    return contentRepository.getAllContent({ ...filters })
  }

  async getContentByCategory(categorySlug: string, filters?: Omit<ContentFilter, 'category'>): Promise<ContentListResponse> {
    return contentRepository.getAllContent({ ...filters, category: categorySlug })
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return contentRepository.getAllCategories()
  }

  async getCategoryTree(): Promise<Category[]> {
    return contentRepository.getCategoryTree()
  }

  async getActiveCategories(): Promise<Category[]> {
    return contentRepository.getActiveCategories()
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return contentRepository.getCategoryBySlug(slug)
  }

  // FAQ methods
  async getAllFAQs(): Promise<FAQ[]> {
    return contentRepository.getAllFAQs()
  }

  async getFAQsPaginated(page = 1, pageSize = 20): Promise<FAQListResponse> {
    return contentRepository.getFAQsPaginated(page, pageSize)
  }

  async searchFAQs(query: string, page = 1, pageSize = 20): Promise<FAQListResponse> {
    return contentRepository.searchFAQs(query, page, pageSize)
  }

  async getFAQById(id: string): Promise<FAQ | null> {
    return contentRepository.getFAQById(id)
  }

  // Convenience methods for different content types
  async getNews(filters?: Omit<ContentFilter, 'category'>): Promise<ContentListResponse> {
    return this.getAllContent({ ...filters })
  }

  async getArticles(filters?: Omit<ContentFilter, 'category'>): Promise<ContentListResponse> {
    return this.getAllContent({ ...filters })
  }

  async getAnnouncements(filters?: Omit<ContentFilter, 'category'>): Promise<ContentListResponse> {
    return this.getAllContent({ ...filters })
  }

  async getEvents(filters?: Omit<ContentFilter, 'category'>): Promise<ContentListResponse> {
    return this.getAllContent({ ...filters })
  }

  // Homepage data aggregation
  async getHomepageContent(): Promise<{
    featured: Content[]
    latest: Content[]
    news: Content[]
    announcements: Content[]
    faqs: FAQ[]
  }> {
    const [featured, latest, newsResponse, announcementsResponse, faqs] = await Promise.all([
      this.getFeaturedContent(),
      this.getLatestContent(6),
      this.getNews({ page: 1, limit: 4 }),
      this.getAnnouncements({ page: 1, limit: 4 }),
      this.getAllFAQs()
    ])

    return {
      featured,
      latest,
      news: newsResponse.success ? newsResponse.data : [],
      announcements: announcementsResponse.success ? announcementsResponse.data : [],
      faqs: faqs.slice(0, 5) // Take first 5 FAQs for homepage
    }
  }
}

// Export singleton instance
export const publicContentService = new PublicContentService()

