interface CachedImage {
  url: string;
  blob: Blob;
  timestamp: number;
  originalUrl: string;
}

class ImageCacheService {
  private cache: Map<string, CachedImage> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours
  private readonly MAX_CACHE_SIZE = 50; // Max 50 images in memory

  async getCachedImage(originalUrl: string): Promise<string> {
    const cached = this.cache.get(originalUrl);
    
    // Check if cached and not expired
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.url;
    }

    // Fetch and cache new image
    try {
      const response = await fetch(originalUrl);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      
      const blob = await response.blob();
      const cachedUrl = URL.createObjectURL(blob);
      
      // Clean up old cached URL if exists
      if (cached) {
        URL.revokeObjectURL(cached.url);
      }
      
      // Store in cache
      this.cache.set(originalUrl, {
        url: cachedUrl,
        blob,
        timestamp: Date.now(),
        originalUrl
      });
      
      // Clean up cache if too large
      this.cleanup();
      
      // Also store in ServiceWorker cache if available
      if ('serviceWorker' in navigator) {
        try {
          const cache = await caches.open('backblaze-images-v1');
          await cache.put(originalUrl, response.clone());
        } catch (error) {
          console.warn('ServiceWorker cache failed:', error);
        }
      }
      
      return cachedUrl;
    } catch (error) {
      console.error('Image caching failed:', error);
      return originalUrl; // Fallback to original URL
    }
  }

  private cleanup() {
    if (this.cache.size <= this.MAX_CACHE_SIZE) return;
    
    // Sort by timestamp and remove oldest entries
    const entries = Array.from(this.cache.entries())
      .sort(([,a], [,b]) => a.timestamp - b.timestamp);
    
    const toRemove = entries.slice(0, entries.length - this.MAX_CACHE_SIZE);
    toRemove.forEach(([key, value]) => {
      URL.revokeObjectURL(value.url);
      this.cache.delete(key);
    });
  }

  clearCache() {
    this.cache.forEach((cached) => {
      URL.revokeObjectURL(cached.url);
    });
    this.cache.clear();
    
    // Clear ServiceWorker cache
    if ('serviceWorker' in navigator) {
      caches.delete('backblaze-images-v1');
    }
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      oldestEntry: Math.min(...Array.from(this.cache.values()).map(v => v.timestamp)),
      newestEntry: Math.max(...Array.from(this.cache.values()).map(v => v.timestamp)),
    };
  }
}

export const imageCacheService = new ImageCacheService();

// Hook for using cached images
export const useCachedImage = (originalUrl: string | null) => {
  const [cachedUrl, setCachedUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!originalUrl) {
      setCachedUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    imageCacheService.getCachedImage(originalUrl)
      .then(url => {
        setCachedUrl(url);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setCachedUrl(originalUrl); // Fallback
        setIsLoading(false);
      });
  }, [originalUrl]);

  return { cachedUrl, isLoading, error };
};

// React import for hook
import React from 'react';