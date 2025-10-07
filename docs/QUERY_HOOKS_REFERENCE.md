# TanStack Query Hooks Reference

## Quick Reference Guide for all implemented query hooks

### Notice Domain Hooks

#### `useRecentNotices(limit)`
```typescript
const { data, isLoading, error } = useRecentNotices(5)
```
- **Purpose**: Fetch recent notices  
- **Cache**: 3 minutes
- **Retries**: 3 with exponential backoff
- **Fallback**: Returns mock data on API failure

#### `useNoticeDetail(slug, enabled)`
```typescript
const { data, isLoading, error } = useNoticeDetail('notice-slug', true)
```
- **Purpose**: Get notice details by slug
- **Cache**: 10 minutes  
- **Auto-increment**: View count in background
- **Conditional**: Use `enabled` to control when to fetch

#### `useNoticeSearch(query, filters, enabled)`
```typescript
const { data } = useNoticeSearch('search term', { category: 'news' })
```
- **Purpose**: Search notices with filters
- **Cache**: 5 minutes
- **Debounced**: Automatically debounced search

#### `usePopularNotices(limit)`
```typescript
const { data } = usePopularNotices(10)
```
- **Purpose**: Fetch popular notices by view count
- **Cache**: 10 minutes

#### Other Notice Hooks
- `useNoticeArchive(yearBS, monthBS)` - Archive by Nepali date
- `useNoticeStats()` - Notice statistics  
- `useRelatedNotices(id, limit)` - Related notices
- `useNoticesByCategory(category, params)` - Category filtering
- `useUpcomingDeadlines(days)` - Notices with upcoming deadlines

### Homepage Domain Hooks

#### `useHomepageData(query)`
```typescript
const { data } = useHomepageData({ lang: 'ne' })
```
- **Purpose**: Complete homepage data structure
- **Cache**: 5 minutes
- **Fallback**: Always returns fallback data on error
- **i18n**: Supports 'ne' and 'en' locales

#### `useNavigationData(lang)`
```typescript
const { data } = useNavigationData('en')
```
- **Purpose**: Navigation menu structure
- **Cache**: 10 minutes
- **Localized**: Returns menu in specified language

#### `useNews(lang)` / `useServices(lang)` / `useHighlights(lang)`
```typescript
const { data } = useNews('ne')
const { data } = useServices('en')  
const { data } = useHighlights('ne')
```
- **Purpose**: Section-specific homepage data
- **Cache**: 5-15 minutes depending on update frequency
- **Localized**: Full i18n support

#### Compound Hooks
```typescript
// Get multiple homepage sections at once
const { homepageData, navigation, officeSettings, isLoading } = useHomepageComplete('en')

// Get specific section only  
const { data } = useHomepageSection('hero', 'ne')
```

### Header Domain Hooks

#### `useHeaderData(locale)`
```typescript
const { data } = useHeaderData('ne')
```
- **Purpose**: Complete header configuration
- **Cache**: 10 minutes
- **Includes**: Config, office settings, navigation, social media

#### `useActiveHeaderConfig()`
```typescript
const { data } = useActiveHeaderConfig()
```
- **Purpose**: Active header configuration only
- **Cache**: 15 minutes
- **Admin**: Useful for admin interfaces

#### `useHeaderNavigation(locale)`
```typescript
const { navigation, isLoading } = useHeaderNavigation('en')
```
- **Purpose**: Navigation-specific data
- **Cache**: 10 minutes
- **Optimized**: Lightweight for nav-only components

#### Utility Hooks
```typescript
// Office information
const { officeInfo, contactInfo } = useOfficeInfo('ne')

// Social media links
const { socialMedia } = useSocialMedia('en')

// Navigation utilities  
const activeItem = useNavigationItemByHref('/about', 'en')
const isActive = useNavigationActive(item, currentPath)
const breadcrumbs = useBreadcrumbTrail('/news/article', 'ne')
```

### Content Domain Hooks

#### `useContentList(query)`
```typescript
const { data } = useContentList({ 
  page: 1, 
  pageSize: 20, 
  category: 'news' 
})
```
- **Purpose**: Paginated content listing
- **Cache**: 5 minutes
- **Filtering**: Supports category, status, search filters

#### `useFeaturedContent()`
```typescript
const { data } = useFeaturedContent()
```
- **Purpose**: Featured/highlighted content
- **Cache**: 10 minutes

#### `useContentSearch(searchTerm, query, enabled)`
```typescript
const { data } = useContentSearch('government services', { limit: 10 })
```
- **Purpose**: Full-text content search
- **Cache**: 5 minutes
- **Conditional**: Only searches when `searchTerm` is provided

#### Category Hooks
```typescript
const { data } = useCategories()              // All categories
const { data } = useCategoryTree()            // Hierarchical categories  
const { data } = useActiveCategories()        // Active categories only
const { data } = useCategoryDetail('news')    // Single category
```

#### FAQ Hooks
```typescript
const { data } = useAllFAQs()                 // All FAQs
const { data } = useFAQList({ page: 1 })      // Paginated FAQs
const { data } = useFAQSearch('how to')       // Search FAQs
const { data } = usePopularFAQs(5)            // Popular FAQs
```

## Advanced Usage Patterns

### Prefetching
```typescript
const { prefetchDetail, prefetchRecent } = usePrefetchNotice()

// Prefetch on hover for better UX
<Link 
  onMouseEnter={() => prefetchDetail(slug)}
  href={`/notices/${slug}`}
>
```

### Cache Invalidation
```typescript
const { invalidateAll, invalidateRecent } = useInvalidateNoticeCache()

// Invalidate after mutations
const { mutate } = useCreateNotice({
  onSuccess: () => {
    invalidateRecent()
    invalidateAll()
  }
})
```

### Conditional Fetching
```typescript
// Only fetch when user is authenticated
const { data } = useNoticeDetail(slug, !!user?.isAuthenticated)

// Only fetch when search term exists
const { data } = useNoticeSearch(searchTerm, filters, searchTerm.length > 0)
```

### Error Handling
```typescript
const { data, error, isError } = useRecentNotices(5)

if (isError) {
  return <ErrorBoundary error={error} />
}
```

### Loading States
```typescript
const { data, isLoading, isFetching } = useNoticeDetail(slug)

// isLoading: First time loading
// isFetching: Background refetching
```

## Cache Configuration

### Cache Times by Domain
```typescript
// Notices (frequent updates)
staleTime: 3 * 60 * 1000,    // 3 minutes
gcTime: 15 * 60 * 1000,      // 15 minutes

// Homepage (moderate updates)  
staleTime: 5 * 60 * 1000,    // 5 minutes
gcTime: 30 * 60 * 1000,      // 30 minutes

// Settings (infrequent updates)
staleTime: 15 * 60 * 1000,   // 15 minutes  
gcTime: 60 * 60 * 1000,      // 1 hour
```

### Query Keys Structure
```typescript
// Hierarchical keys for efficient invalidation
['notices']                           // All notice queries
['notices', 'list']                   // All notice lists
['notices', 'list', filters]          // Specific filtered list
['notices', 'detail']                 // All notice details
['notices', 'detail', slug]           // Specific notice detail
['notices', 'recent', limit]          // Recent notices with limit
```

## Best Practices

### 1. Import Pattern
```typescript
// Import specific hooks to avoid bundle bloat
import { useRecentNotices, useNoticeDetail } from '@/domains/content-management/hooks'
```

### 2. Error Boundaries
```typescript
// Always handle errors gracefully
const { data, isError, error } = useRecentNotices(5)

if (isError) {
  return <ErrorFallback error={error} />
}
```

### 3. Loading States
```typescript
// Provide meaningful loading states
if (isLoading) {
  return <NoticesSkeleton count={5} />
}
```

### 4. Conditional Fetching
```typescript
// Only fetch when needed to avoid unnecessary requests
const { data } = useNoticeDetail(slug, Boolean(slug && isVisible))
```

### 5. Prefetching Strategy
```typescript
// Prefetch related data for better UX
useEffect(() => {
  if (notices) {
    notices.slice(0, 3).forEach(notice => 
      prefetchDetail(notice.slug)
    )
  }
}, [notices])
```

This reference covers all implemented hooks and common usage patterns for your Nepal Government Portal.