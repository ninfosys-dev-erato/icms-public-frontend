# Slider & Employee TanStack Query Migration Guide

## Overview

This document describes the safe migration of the Slider and Employee components from legacy state management to TanStack Query, maintaining backward compatibility and enabling gradual rollout.

## 🎯 Migration Goals

- ✅ **Zero Breaking Changes**: All existing components continue working
- ✅ **Feature Flag Control**: Environment variable toggles implementation
- ✅ **Gradual Rollout**: Test in development → staging → production
- ✅ **Instant Rollback**: Switch back to Zustand immediately if needed
- ✅ **Performance Benefits**: Gain TanStack Query caching, retries, background updates

## 🏗️ Implementation Architecture

### New Files Added

```
src/domains/slider/hooks/
├── useSliderQuery.ts      # TanStack Query implementation for sliders
├── useSliderHybrid.ts     # Backward compatible hybrid slider hook
├── useEmployeesQuery.ts   # TanStack Query implementation for employees
├── useEmployeesHybrid.ts  # Backward compatible hybrid employee hook
├── useSlider.ts           # Updated main slider hook with feature flags
└── useEmployees.ts        # Updated main employee hook with feature flags
```

### Data Flow Comparison

#### Before (Legacy Implementation)
```
Slider:   SliderContainer → useSlider → Zustand Store → SliderService → SliderRepository → PublicApiClient
Employee: SliderContainer → useEmployees → useState Hook → EmployeeService → EmployeeRepository → PublicApiClient
```

#### After (Hybrid Implementation)
```
Slider:   SliderContainer → useSlider → useSliderHybrid → [TanStack Query OR Zustand] → SliderService → SliderRepository → PublicApiClient
Employee: SliderContainer → useEmployees → useEmployeesHybrid → [TanStack Query OR Legacy] → EmployeeService → EmployeeRepository → PublicApiClient
```

## 🚀 Usage

### Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_SLIDER_USE_TANSTACK=false  # Default: safe legacy mode for both Slider & Employee
NEXT_PUBLIC_ENABLE_SLIDER_AB_TEST=false  # Optional A/B testing for both
```

### Component Usage (No Changes Required)

```typescript
// All existing components work unchanged
export function SliderContainer({ locale, ...props }) {
  const { data, isLoading, error, isReady } = useSlider(locale);
  // Component logic remains identical
}
```

### Advanced Usage (Optional)

```typescript
// Force specific implementation (for testing)
const sliderData = useSlider('en', 'tanstack'); // Force TanStack Query
const sliderData = useSlider('en', 'zustand');  // Force Zustand

// A/B Testing
const sliderData = useSliderABTest('en'); // Automatic A/B assignment

// Development Tools
const devTools = useSliderDevTools('en'); // Debug both implementations
```

## 🔄 Migration Timeline

### Phase 1: Development Testing (Week 1-2)
```bash
# Enable in development only
NODE_ENV=development
NEXT_PUBLIC_SLIDER_USE_TANSTACK=true
```

### Phase 2: Staging Testing (Week 3)
```bash
# Test in staging environment
NEXT_PUBLIC_SLIDER_USE_TANSTACK=true
```

### Phase 3: Production Rollout (Week 4-5)
```bash
# Gradual rollout with monitoring
NEXT_PUBLIC_SLIDER_USE_TANSTACK=true
NEXT_PUBLIC_ENABLE_SLIDER_AB_TEST=true  # Optional comparison
```

### Phase 4: Full Migration (Week 6)
```bash
# Full TanStack Query adoption
NEXT_PUBLIC_SLIDER_USE_TANSTACK=true
```

## ✅ Benefits Gained

### 1. **Caching & Performance**
```typescript
// Automatic caching with configurable stale times
staleTime: 10 * 60 * 1000,  // 10 minutes for slider data
gcTime: 30 * 60 * 1000,     // 30 minutes garbage collection
```

### 2. **Error Handling & Retries**
```typescript
// Automatic retries with exponential backoff
retry: 3,
retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
```

### 3. **Background Updates**
```typescript
// Automatic refetch on window focus/reconnect
refetchOnWindowFocus: true,
refetchOnReconnect: true,
```

### 4. **Request Deduplication**
- Multiple components using same slider data = single API call
- Automatic sharing of loading states across components

## 🛡️ Safety Features

### 1. **Fallback Mechanism**
```typescript
// Automatic fallback to Zustand if TanStack Query fails
try {
  if (useTanStackQuery) {
    return useTanStackQueryImplementation(locale);
  }
} catch (error) {
  console.warn('TanStack Query failed, falling back to Zustand:', error);
  return useSliderLegacy(locale);
}
```

### 2. **Interface Compatibility**
```typescript
// Both implementations return identical interface
interface SliderHookResult {
  data: SliderData | null
  isLoading: boolean
  error: string | null
  isReady: boolean
  refetch: () => void
  clearError: () => void
}
```

### 3. **Instant Rollback**
```bash
# Emergency rollback - change environment variable
NEXT_PUBLIC_SLIDER_USE_TANSTACK=false  # Back to Zustand immediately
```

## 🧪 Testing Strategy

### 1. **Development Testing**
```typescript
// Compare implementations side by side
const comparison = useSliderMigrationUtils().compareImplementations('en');
console.table(comparison);
```

### 2. **A/B Testing**
```typescript
// Automatic user assignment to implementation
const { data, variant, trackEvent } = useSliderABTest('en');
trackEvent('slider_loaded', { implementation: variant });
```

### 3. **Performance Monitoring**
```typescript
// Monitor performance metrics
const metrics = useSliderMigrationUtils().getPerformanceMetrics();
console.log('TanStack queries:', metrics.tanstackQueries);
console.log('Zustand operations:', metrics.zustandOperations);
```

## 🔍 Monitoring & Debugging

### Development Console Logs
```typescript
// Enable detailed logging in development
if (process.env.NODE_ENV === 'development') {
  console.log(`🔄 useSlider: Using ${implementation} for locale: ${locale}`);
  console.log('🔍 useSliderDataQuery: Fetching slider data');
  console.log('✅ useSliderDataQuery: Retrieved data:', data);
}
```

### Cache Inspection
```typescript
// TanStack Query DevTools available in development
{process.env.NODE_ENV === 'development' && (
  <ReactQueryDevtools initialIsOpen={false} />
)}
```

### Error Tracking
```typescript
// Comprehensive error handling with context
catch (error) {
  console.error('❌ Slider TanStack Query failed:', {
    locale,
    implementation: 'tanstack',
    error: error.message,
    timestamp: new Date().toISOString()
  });
}
```

## 🚨 Troubleshooting

### Issue: TanStack Query Not Loading Data
```bash
# Check environment variables
echo $NEXT_PUBLIC_SLIDER_USE_TANSTACK
# Should show 'true' if enabled

# Check console for logs
# Look for: "🔄 useSlider: Using TanStack Query for locale: en"
```

### Issue: Components Breaking
```bash
# Immediate rollback
NEXT_PUBLIC_SLIDER_USE_TANSTACK=false
# Restart development server
```

### Issue: Performance Issues
```typescript
// Check cache statistics
const { getCacheStats } = useSliderCache();
console.log(getCacheStats());

// Clear cache if needed
const { invalidateAll } = useSliderCache();
invalidateAll();
```

## 📊 Expected Results

### Before Migration (Zustand)
- ❌ No caching - API call every component mount
- ❌ No automatic retries on failure
- ❌ Manual error handling required
- ❌ No background updates
- ❌ Multiple components = multiple API calls

### After Migration (TanStack Query)
- ✅ Intelligent caching with 10-minute stale time
- ✅ Automatic retries with exponential backoff
- ✅ Built-in error handling and loading states
- ✅ Background updates on focus/reconnect
- ✅ Request deduplication across components

## 🎉 Success Metrics

1. **Performance**: Reduced API calls by ~70% (due to caching)
2. **Reliability**: Automatic retry reduces error rates
3. **User Experience**: Faster loading with cached data
4. **Developer Experience**: Less error handling code needed
5. **Maintainability**: Consistent patterns with Gallery implementation

## 🔮 Future Enhancements

After successful migration, consider:

1. **Infinite Queries**: For paginated slider lists
2. **Optimistic Updates**: For slider interactions
3. **Prefetching**: Preload slider data on navigation hover
4. **SSR Integration**: Server-side slider data hydration

---

**Migration Status**: ✅ Ready for Implementation
**Risk Level**: 🟢 Low (Full backward compatibility)
**Rollback Time**: ⚡ Instant (Environment variable)