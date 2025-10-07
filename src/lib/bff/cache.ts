/**
 * Backend for Frontend (BFF) Cache utilities
 * Simple caching implementation for server-side operations
 */

// Simple in-memory cache for development
const cache = new Map<string, any>();
const cacheTags = new Map<string, Set<string>>();

export function generateCacheKey(prefix: string, params?: Record<string, any>): string {
  const paramString = params ? JSON.stringify(params) : '';
  return `${prefix}:${paramString}`;
}

export function getJSON<T>(key: string): T | null {
  try {
    return cache.get(key) || null;
  } catch (error) {
    console.warn('Cache get error:', error);
    return null;
  }
}

export function setJSON<T>(key: string, value: T, ttl?: number): void {
  try {
    cache.set(key, value);
    
    // Simple TTL implementation (optional)
    if (ttl && ttl > 0) {
      setTimeout(() => {
        cache.delete(key);
      }, ttl * 1000);
    }
  } catch (error) {
    console.warn('Cache set error:', error);
  }
}

export function setWithTags<T>(key: string, value: T, tags: string[], ttl?: number): void {
  try {
    setJSON(key, value, ttl);
    
    // Associate cache key with tags
    tags.forEach(tag => {
      if (!cacheTags.has(tag)) {
        cacheTags.set(tag, new Set());
      }
      cacheTags.get(tag)!.add(key);
    });
  } catch (error) {
    console.warn('Cache setWithTags error:', error);
  }
}

export function invalidateByTags(tags: string[]): void {
  try {
    tags.forEach(tag => {
      const keys = cacheTags.get(tag);
      if (keys) {
        keys.forEach(key => cache.delete(key));
        cacheTags.delete(tag);
      }
    });
  } catch (error) {
    console.warn('Cache invalidateByTags error:', error);
  }
}

export function clearCache(): void {
  cache.clear();
  cacheTags.clear();
}

export function getCacheSize(): number {
  return cache.size;
}

export function getCacheKeys(): string[] {
  return Array.from(cache.keys());
}