import { publicApiClient } from './http/PublicApiClient'
import { 
  SearchIndexQuery,
  SearchIndexListResponse,
  SearchIndexResponse,
  ContentType
} from '@/models'

/**
 * Public Search Repository - Handles search-related API calls for public website
 * Maps to backend endpoints: /search-index
 * Updated to match exact backend API structure
 */
export class PublicSearchRepository {
  // Search Index endpoints (/search-index) - matches backend implementation
  async searchContent(query: SearchIndexQuery): Promise<SearchIndexListResponse> {
    const response = await publicApiClient.get('/search-index', query)
    return response as SearchIndexListResponse
  }

  async getSearchIndexById(id: string): Promise<SearchIndexResponse | null> {
    try {
      const response = await publicApiClient.get(`/search-index/${id}`)
      if (response.success) {
        return response.data as SearchIndexResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  async searchByContentType(contentType: ContentType, query: Omit<SearchIndexQuery, 'contentType'>): Promise<SearchIndexListResponse> {
    const response = await publicApiClient.get('/search-index/type', { contentType, ...query })
    return response as SearchIndexListResponse
  }

  async getPopularSearches(limit = 10): Promise<SearchIndexResponse[]> {
    try {
      const response = await publicApiClient.get('/search-index/popular', { limit })
      if (response.success) {
        return response.data as SearchIndexResponse[]
      }
      return []
    } catch (error) {
      console.warn('Failed to fetch popular searches:', error)
      return []
    }
  }

  async getRecentSearches(limit = 10): Promise<SearchIndexResponse[]> {
    try {
      const response = await publicApiClient.get('/search-index/recent', { limit })
      if (response.success) {
        return response.data as SearchIndexResponse[]
      }
      return []
    } catch (error) {
      console.warn('Failed to fetch recent searches:', error)
      return []
    }
  }

  // Convenience methods for different content types using backend enums
  async searchContentByType(contentType: ContentType, searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchByContentType(contentType, {
      search: searchTerm,
      page,
      limit,
      sortBy: 'relevance',
      sortOrder: 'desc'
    })
  }

  async searchNews(searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchContentByType('NEWS', searchTerm, page, limit)
  }

  async searchNotices(searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchContentByType('NOTICE', searchTerm, page, limit)
  }

  async searchDocuments(searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchContentByType('DOCUMENT', searchTerm, page, limit)
  }

  async searchPages(searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchContentByType('PAGE', searchTerm, page, limit)
  }

  async searchForms(searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchContentByType('FORM', searchTerm, page, limit)
  }

  async searchServices(searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchContentByType('SERVICE', searchTerm, page, limit)
  }

  // Global search across all content types
  async searchAll(searchTerm: string, page = 1, limit = 20): Promise<SearchIndexListResponse> {
    return this.searchContent({
      search: searchTerm,
      page,
      limit,
      sortBy: 'relevance',
      sortOrder: 'desc'
    })
  }

  // Quick search for autocomplete/suggestions
  async quickSearch(searchTerm: string, limit = 5): Promise<SearchIndexListResponse> {
    return this.searchContent({
      search: searchTerm,
      page: 1,
      limit,
      sortBy: 'relevance',
      sortOrder: 'desc'
    })
  }
}

// Export singleton instance
export const publicSearchRepository = new PublicSearchRepository()