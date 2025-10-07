import { 
  publicSearchRepository,
  type SearchQuery,
  type SearchResponse,
  type AdvancedSearchQuery
} from '@/repositories'

/**
 * Public Search Service - Business logic for search functionality
 * Handles caching, orchestration, and business rules for public search
 */
export class PublicSearchService {
  // Basic search methods
  async search(params: SearchQuery): Promise<SearchResponse> {
    return publicSearchRepository.search(params)
  }

  async advancedSearch(params: AdvancedSearchQuery): Promise<SearchResponse> {
    return publicSearchRepository.advancedSearch(params)
  }

  async getSuggestions(query: string, limit = 10): Promise<string[]> {
    if (!query || query.length < 2) return []
    
    try {
      const suggestions = await publicSearchRepository.getSuggestions(query, limit)
      return suggestions.map(s => s.text)
    } catch (error) {
      console.warn('Failed to fetch search suggestions:', error)
      return []
    }
  }

  async getPopularSearches(limit = 10): Promise<Array<{ query: string; count: number }>> {
    try {
      const searches = await publicSearchRepository.getPopularSearches(limit)
      return searches.map(s => ({ query: s.query, count: s.count }))
    } catch (error) {
      console.warn('Failed to fetch popular searches:', error)
      return []
    }
  }

  // Convenience methods for different search types
  async searchContent(query: string, page = 1, pageSize = 20): Promise<SearchResponse> {
    return publicSearchRepository.searchContent(query, page, pageSize)
  }

  async searchDocuments(query: string, page = 1, pageSize = 20): Promise<SearchResponse> {
    return publicSearchRepository.searchDocuments(query, page, pageSize)
  }

  async searchNotices(query: string, page = 1, pageSize = 20): Promise<SearchResponse> {
    return publicSearchRepository.searchNotices(query, page, pageSize)
  }

  async searchFAQs(query: string, page = 1, pageSize = 20): Promise<SearchResponse> {
    return publicSearchRepository.searchFAQs(query, page, pageSize)
  }

  async searchAll(query: string, page = 1, pageSize = 20): Promise<SearchResponse> {
    return publicSearchRepository.searchAll(query, page, pageSize)
  }

  // Quick search for autocomplete
  async quickSearch(query: string, limit = 5): Promise<SearchResponse> {
    return publicSearchRepository.quickSearch(query, limit)
  }

  // Search with filters and facets
  async searchWithFilters(
    query: string,
    filters: {
      type?: string[]
      category?: string[]
      dateFrom?: string
      dateTo?: string
      hasAttachment?: boolean
    },
    page = 1,
    pageSize = 20
  ): Promise<SearchResponse> {
    const searchParams: SearchQuery = {
      q: query,
      page,
      pageSize,
      sortBy: 'relevance',
      sortOrder: 'desc'
    }

    if (filters.type && filters.type.length > 0) {
      searchParams.type = filters.type[0] as any // Take first type for basic search
    }

    if (filters.category) {
      searchParams.category = filters.category[0] // Take first category
    }

    if (filters.dateFrom) {
      searchParams.dateFrom = filters.dateFrom
    }

    if (filters.dateTo) {
      searchParams.dateTo = filters.dateTo
    }

    return this.search(searchParams)
  }

  // Build search query from user input
  buildSearchQuery(
    query: string,
    options: {
      type?: string
      category?: string
      sortBy?: 'relevance' | 'date' | 'title'
      sortOrder?: 'asc' | 'desc'
      page?: number
      pageSize?: number
    } = {}
  ): SearchQuery {
    return {
      q: query,
      type: options.type as any || 'all',
      category: options.category,
      page: options.page || 1,
      pageSize: options.pageSize || 20,
      sortBy: options.sortBy || 'relevance',
      sortOrder: options.sortOrder || 'desc'
    }
  }

  // Format search results for display
  formatSearchResults(response: SearchResponse): {
    results: Array<{
      id: string
      title: string
      excerpt?: string
      url: string
      type: string
      category?: string
      publishedAt?: string
      highlightedText?: string
    }>
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
    meta: {
      query: string
      processingTime?: number
    }
  } {
    return {
      results: response.results,
      pagination: {
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrev: response.hasPrev
      },
      meta: {
        query: response.query,
        processingTime: response.processingTime
      }
    }
  }

  // Search result analytics
  async trackSearchResult(query: string, resultId: string, action: 'click' | 'view'): Promise<void> {
    try {
      // This would typically send analytics data to a tracking service
      console.log(`Search ${action}: query="${query}", result="${resultId}"`)
      // Implementation would depend on analytics service (Plausible, Matomo, etc.)
    } catch (error) {
      console.warn('Failed to track search result:', error)
    }
  }
}

// Export singleton instance
export const publicSearchService = new PublicSearchService()

