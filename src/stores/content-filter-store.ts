import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { ContentFilter } from '@/models'

interface ContentFilterState {
  // Current filters
  filters: ContentFilter
  
  // Search state
  searchQuery: string
  searchHistory: string[]
  
  // Filter options
  availableCategories: Array<{ id: string; name: string; name_en?: string }>
  availableTypes: Array<{ value: string; label: string; label_en?: string }>
  availableTags: string[]
  
  // UI state
  filtersVisible: boolean
  advancedFiltersVisible: boolean
  
  // Results state
  totalResults: number
  lastSearchTime: Date | null
  
  // Actions
  setFilters: (filters: Partial<ContentFilter>) => void
  resetFilters: () => void
  
  setSearchQuery: (query: string) => void
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
  
  setAvailableCategories: (categories: Array<{ id: string; name: string; name_en?: string }>) => void
  setAvailableTypes: (types: Array<{ value: string; label: string; label_en?: string }>) => void
  setAvailableTags: (tags: string[]) => void
  
  toggleFilters: () => void
  setFiltersVisible: (visible: boolean) => void
  toggleAdvancedFilters: () => void
  setAdvancedFiltersVisible: (visible: boolean) => void
  
  setTotalResults: (total: number) => void
  setLastSearchTime: (time: Date) => void
  
  // Helper methods
  hasActiveFilters: () => boolean
  getActiveFilterCount: () => number
  getSearchQueryWithFilters: () => ContentFilter
  buildFilterLabel: (locale?: 'ne' | 'en') => string
}

const defaultFilters: ContentFilter = {
  page: 1,
  pageSize: 20,
  sortBy: 'publishedAt',
  sortOrder: 'desc'
}

export const useContentFilterStore = create<ContentFilterState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        filters: { ...defaultFilters },
        
        searchQuery: '',
        searchHistory: [],
        
        availableCategories: [],
        availableTypes: [
          { value: 'article', label: 'Article', label_en: 'Article' },
          { value: 'news', label: 'समाचार', label_en: 'News' },
          { value: 'announcement', label: 'घोषणा', label_en: 'Announcement' },
          { value: 'event', label: 'कार्यक्रम', label_en: 'Event' }
        ],
        availableTags: [],
        
        filtersVisible: false,
        advancedFiltersVisible: false,
        
        totalResults: 0,
        lastSearchTime: null,
        
        // Actions
        setFilters: (newFilters) => set((state) => {
          state.filters = { ...state.filters, ...newFilters }
        }),
        
        resetFilters: () => set((state) => {
          state.filters = { ...defaultFilters }
          state.searchQuery = ''
        }),
        
        setSearchQuery: (query) => set((state) => {
          state.searchQuery = query
          if (query) {
            state.filters.q = query
          } else {
            delete state.filters.q
          }
        }),
        
        addToSearchHistory: (query) => set((state) => {
          if (!query.trim()) return
          
          // Remove if already exists
          state.searchHistory = state.searchHistory.filter(item => item !== query)
          
          // Add to beginning
          state.searchHistory.unshift(query)
          
          // Keep only last 20 searches
          if (state.searchHistory.length > 20) {
            state.searchHistory = state.searchHistory.slice(0, 20)
          }
        }),
        
        clearSearchHistory: () => set((state) => {
          state.searchHistory = []
        }),
        
        setAvailableCategories: (categories) => set((state) => {
          state.availableCategories = categories
        }),
        
        setAvailableTypes: (types) => set((state) => {
          state.availableTypes = types
        }),
        
        setAvailableTags: (tags) => set((state) => {
          state.availableTags = tags
        }),
        
        toggleFilters: () => set((state) => {
          state.filtersVisible = !state.filtersVisible
        }),
        
        setFiltersVisible: (visible) => set((state) => {
          state.filtersVisible = visible
        }),
        
        toggleAdvancedFilters: () => set((state) => {
          state.advancedFiltersVisible = !state.advancedFiltersVisible
        }),
        
        setAdvancedFiltersVisible: (visible) => set((state) => {
          state.advancedFiltersVisible = visible
        }),
        
        setTotalResults: (total) => set((state) => {
          state.totalResults = total
        }),
        
        setLastSearchTime: (time) => set((state) => {
          state.lastSearchTime = time
        }),
        
        // Helper methods
        hasActiveFilters: () => {
          const { filters } = get()
          return !!(
            filters.type ||
            filters.category ||
            filters.tag ||
            filters.featured ||
            filters.dateFrom ||
            filters.dateTo ||
            (filters.q && filters.q.length > 0)
          )
        },
        
        getActiveFilterCount: () => {
          const { filters } = get()
          let count = 0
          if (filters.type) count++
          if (filters.category) count++
          if (filters.tag) count++
          if (filters.featured !== undefined) count++
          if (filters.dateFrom) count++
          if (filters.dateTo) count++
          if (filters.q && filters.q.length > 0) count++
          return count
        },
        
        getSearchQueryWithFilters: () => {
          const { filters, searchQuery } = get()
          return {
            ...filters,
            ...(searchQuery && { q: searchQuery })
          }
        },
        
        buildFilterLabel: (locale = 'ne') => {
          const { filters, availableCategories, availableTypes } = get()
          const labels: string[] = []
          
          if (filters.type) {
            const type = availableTypes.find(t => t.value === filters.type)
            labels.push(locale === 'en' ? type?.label_en || type?.label || filters.type : type?.label || filters.type)
          }
          
          if (filters.category) {
            const category = availableCategories.find(c => c.id === filters.category)
            labels.push(locale === 'en' ? category?.name_en || category?.name || filters.category : category?.name || filters.category)
          }
          
          if (filters.tag) {
            labels.push(filters.tag)
          }
          
          if (filters.featured) {
            labels.push(locale === 'en' ? 'Featured' : 'विशेष')
          }
          
          if (filters.dateFrom || filters.dateTo) {
            const dateLabel = locale === 'en' ? 'Date Range' : 'मिति दायरा'
            labels.push(dateLabel)
          }
          
          return labels.join(', ')
        },
      })),
      {
        name: 'content-filter-store',
        partialize: (state) => ({
          searchHistory: state.searchHistory,
          filters: {
            pageSize: state.filters.pageSize,
            sortBy: state.filters.sortBy,
            sortOrder: state.filters.sortOrder,
          }
        }),
      }
    ),
    {
      name: 'content-filter-store',
    }
  )
)

// Selector hooks for optimized re-renders
export const useContentFilters = () => useContentFilterStore((state) => state.filters)
export const useSearchQuery = () => useContentFilterStore((state) => state.searchQuery)
export const useSearchHistory = () => useContentFilterStore((state) => state.searchHistory)
export const useFilterVisibility = () => useContentFilterStore((state) => ({
  filtersVisible: state.filtersVisible,
  advancedFiltersVisible: state.advancedFiltersVisible,
  toggleFilters: state.toggleFilters,
  toggleAdvancedFilters: state.toggleAdvancedFilters,
}))
export const useFilterOptions = () => useContentFilterStore((state) => ({
  categories: state.availableCategories,
  types: state.availableTypes,
  tags: state.availableTags,
}))
export const useFilterHelpers = () => useContentFilterStore((state) => ({
  hasActiveFilters: state.hasActiveFilters,
  getActiveFilterCount: state.getActiveFilterCount,
  buildFilterLabel: state.buildFilterLabel,
}))