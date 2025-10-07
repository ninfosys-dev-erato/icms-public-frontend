// Existing stores
export * from './ui-store'
export * from './user-store'

// New public website stores
export * from './navigation-store'
export * from './content-filter-store'
export * from './user-preferences-store'
export * from './cache-store'

// Store selectors and hooks for easy importing
export {
  // Navigation
  useHeaderMenu,
  useFooterMenu,
  useSidebarMenu,
  useCurrentPath,
  useBreadcrumbs,
  useActiveMenuItem,
  useMobileMenuState
} from './navigation-store'

export {
  // Content filters
  useContentFilters,
  useSearchQuery,
  useSearchHistory,
  useFilterVisibility,
  useFilterOptions,
  useFilterHelpers
} from './content-filter-store'

export {
  // User preferences
  useLocalePreferences,
  useCalendarPreferences,
  useThemePreferences,
  useContentPreferences,
  useAccessibilityPreferences
} from './user-preferences-store'

export {
  // Cache
  useCache,
  createCacheKey,
  createCacheKeyWithParams
} from './cache-store'