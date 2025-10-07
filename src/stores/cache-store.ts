import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
  tags?: string[]
}

interface CacheState {
  // Cache storage
  cache: Map<string, CacheEntry>
  
  // Cache statistics
  hits: number
  misses: number
  size: number
  maxSize: number
  
  // Cache settings
  defaultTTL: number
  cleanupInterval: number
  
  // Actions
  set: <T>(key: string, data: T, ttl?: number, tags?: string[]) => void
  get: <T>(key: string) => T | null
  has: (key: string) => boolean
  delete: (key: string) => void
  clear: () => void
  invalidateTag: (tag: string) => void
  invalidateTags: (tags: string[]) => void
  
  // Utilities
  isExpired: (key: string) => boolean
  getStats: () => {
    hits: number
    misses: number
    hitRate: number
    size: number
    maxSize: number
  }
  cleanup: () => void
  prune: () => void
  
  // Preload methods
  preload: <T>(key: string, dataLoader: () => Promise<T>, ttl?: number, tags?: string[]) => Promise<T>
  prefetch: <T>(keys: Array<{ key: string; loader: () => Promise<T>; ttl?: number; tags?: string[] }>) => Promise<void>
}

export const useCacheStore = create<CacheState>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      cache: new Map(),
      
      hits: 0,
      misses: 0,
      size: 0,
      maxSize: 1000, // Maximum number of cache entries
      
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      
      // Cache operations
      set: <T>(key: string, data: T, ttl?: number, tags?: string[]) => set((state) => {
        const now = Date.now()
        const entry: CacheEntry<T> = {
          data,
          timestamp: now,
          ttl: ttl || state.defaultTTL,
          tags
        }
        
        // If cache is at max size, remove oldest entry
        if (state.cache.size >= state.maxSize) {
          let oldestKey = ''
          let oldestTime = now
          
          state.cache.forEach((entry, key) => {
            if (entry.timestamp < oldestTime) {
              oldestTime = entry.timestamp
              oldestKey = key
            }
          })
          
          if (oldestKey) {
            state.cache.delete(oldestKey)
            state.size = state.cache.size
          }
        }
        
        state.cache.set(key, entry)
        state.size = state.cache.size
      }),
      
      get: <T>(key: string): T | null => {
        const state = get()
        const entry = state.cache.get(key)
        
        if (!entry) {
          set((state) => { state.misses++ })
          return null
        }
        
        const now = Date.now()
        
        // Check if expired
        if (now - entry.timestamp > entry.ttl) {
          set((state) => {
            state.cache.delete(key)
            state.size = state.cache.size
            state.misses++
          })
          return null
        }
        
        set((state) => { state.hits++ })
        return entry.data as T
      },
      
      has: (key: string): boolean => {
        const state = get()
        const entry = state.cache.get(key)
        
        if (!entry) return false
        
        const now = Date.now()
        if (now - entry.timestamp > entry.ttl) {
          set((state) => {
            state.cache.delete(key)
            state.size = state.cache.size
          })
          return false
        }
        
        return true
      },
      
      delete: (key: string) => set((state) => {
        const deleted = state.cache.delete(key)
        if (deleted) {
          state.size = state.cache.size
        }
      }),
      
      clear: () => set((state) => {
        state.cache.clear()
        state.size = 0
        state.hits = 0
        state.misses = 0
      }),
      
      invalidateTag: (tag: string) => set((state) => {
        const keysToDelete: string[] = []
        
        state.cache.forEach((entry, key) => {
          if (entry.tags?.includes(tag)) {
            keysToDelete.push(key)
          }
        })
        
        keysToDelete.forEach(key => {
          state.cache.delete(key)
        })
        
        state.size = state.cache.size
      }),
      
      invalidateTags: (tags: string[]) => set((state) => {
        const keysToDelete: string[] = []
        
        state.cache.forEach((entry, key) => {
          if (entry.tags?.some(tag => tags.includes(tag))) {
            keysToDelete.push(key)
          }
        })
        
        keysToDelete.forEach(key => {
          state.cache.delete(key)
        })
        
        state.size = state.cache.size
      }),
      
      // Utility methods
      isExpired: (key: string): boolean => {
        const state = get()
        const entry = state.cache.get(key)
        
        if (!entry) return true
        
        const now = Date.now()
        return now - entry.timestamp > entry.ttl
      },
      
      getStats: () => {
        const state = get()
        const total = state.hits + state.misses
        return {
          hits: state.hits,
          misses: state.misses,
          hitRate: total > 0 ? (state.hits / total) * 100 : 0,
          size: state.size,
          maxSize: state.maxSize
        }
      },
      
      cleanup: () => set((state) => {
        const now = Date.now()
        const keysToDelete: string[] = []
        
        state.cache.forEach((entry, key) => {
          if (now - entry.timestamp > entry.ttl) {
            keysToDelete.push(key)
          }
        })
        
        keysToDelete.forEach(key => {
          state.cache.delete(key)
        })
        
        state.size = state.cache.size
      }),
      
      prune: () => set((state) => {
        // Remove half of the cache entries, starting with oldest
        const entries = Array.from(state.cache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)
        
        const removeCount = Math.floor(entries.length / 2)
        
        for (let i = 0; i < removeCount; i++) {
          state.cache.delete(entries[i][0])
        }
        
        state.size = state.cache.size
      }),
      
      // Preload methods
      preload: async <T>(key: string, dataLoader: () => Promise<T>, ttl?: number, tags?: string[]): Promise<T> => {
        const state = get()
        
        // Check if already cached and valid
        const cached = state.get<T>(key)
        if (cached !== null) {
          return cached
        }
        
        try {
          const data = await dataLoader()
          state.set(key, data, ttl, tags)
          return data
        } catch (error) {
          console.error(`Failed to preload data for key: ${key}`, error)
          throw error
        }
      },
      
      prefetch: async (keys: Array<{ key: string; loader: () => Promise<any>; ttl?: number; tags?: string[] }>) => {
        const promises = keys.map(({ key, loader, ttl, tags }) => {
          return get().preload(key, loader, ttl, tags).catch(error => {
            console.warn(`Failed to prefetch data for key: ${key}`, error)
          })
        })
        
        await Promise.allSettled(promises)
      },
    })),
    {
      name: 'cache-store',
    }
  )
)

// Cache helper functions
export const createCacheKey = (...parts: (string | number | undefined | null)[]): string => {
  return parts
    .filter(part => part != null)
    .map(part => String(part))
    .join(':')
}

export const createCacheKeyWithParams = (base: string, params: Record<string, any>): string => {
  const paramString = Object.entries(params)
    .filter(([_, value]) => value != null)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  
  return paramString ? `${base}?${paramString}` : base
}

// Cache hook for components
export const useCache = () => {
  const cache = useCacheStore()
  
  return {
    // Basic operations
    get: cache.get,
    set: cache.set,
    has: cache.has,
    delete: cache.delete,
    clear: cache.clear,
    
    // Invalidation
    invalidateTag: cache.invalidateTag,
    invalidateTags: cache.invalidateTags,
    
    // Utilities
    stats: cache.getStats(),
    cleanup: cache.cleanup,
    
    // Preloading
    preload: cache.preload,
    prefetch: cache.prefetch,
    
    // Key helpers
    createKey: createCacheKey,
    createKeyWithParams: createCacheKeyWithParams,
  }
}

// Auto cleanup setup
if (typeof window !== 'undefined') {
  const store = useCacheStore.getState()
  
  // Store the interval ID for cleanup
  const cleanupIntervalId = setInterval(() => {
    store.cleanup()
  }, store.cleanupInterval)
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (cleanupIntervalId) {
      clearInterval(cleanupIntervalId)
    }
  })
}