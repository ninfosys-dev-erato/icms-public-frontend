"use client";

import React from 'react';
import { extractFileIdentifier, getProxiedImageUrl } from './backblazeImageCache';

interface CachedFile {
  originalUrl: string;
  proxiedUrl: string;
  fileId: string | null;
  timestamp: number;
  contentType: string;
}

class FileCacheService {
  private cache: Map<string, CachedFile> = new Map();
  private readonly CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

  getCachedFileUrl(originalUrl: string): string {
    if (!originalUrl) return originalUrl;

    // Check if it's from iCMS-bucket
    if (!originalUrl.includes('/file/iCMS-bucket/')) {
      return originalUrl;
    }

    const fileId = extractFileIdentifier(originalUrl);
    const cacheKey = fileId || originalUrl;

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.proxiedUrl;
    }

    // Create proxied URL
    const proxiedUrl = getProxiedImageUrl(originalUrl);
    
    // Cache the mapping
    this.cache.set(cacheKey, {
      originalUrl,
      proxiedUrl,
      fileId,
      timestamp: Date.now(),
      contentType: this.getContentTypeFromUrl(originalUrl),
    });

    return proxiedUrl;
  }

  private getContentTypeFromUrl(url: string): string {
    if (url.includes('.pdf')) return 'application/pdf';
    if (url.match(/\.(jpg|jpeg)$/i)) return 'image/jpeg';
    if (url.match(/\.png$/i)) return 'image/png';
    if (url.match(/\.webp$/i)) return 'image/webp';
    if (url.match(/\.(doc|docx)$/i)) return 'application/msword';
    return 'application/octet-stream';
  }

  preloadFiles(urls: string[]) {
    urls.forEach((url, index) => {
      if (!url || !url.includes('/file/iCMS-bucket/')) return;

      setTimeout(() => {
        const cachedUrl = this.getCachedFileUrl(url);
        
        // Preload in background
        fetch(cachedUrl, { method: 'HEAD' })
          .catch(() => {
            // Silent fail for preloading
          });
      }, index * 200); // Stagger file preloads more than images
    });
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    const entries = Array.from(this.cache.values());
    return {
      totalFiles: entries.length,
      fileTypes: entries.reduce((acc, file) => {
        acc[file.contentType] = (acc[file.contentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      oldestEntry: Math.min(...entries.map(f => f.timestamp)),
      newestEntry: Math.max(...entries.map(f => f.timestamp)),
    };
  }
}

export const fileCacheService = new FileCacheService();

// Hook for caching any file from iCMS-bucket
export function useCachedFile(originalUrl: string | null) {
  const [cachedUrl, setCachedUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [fileId, setFileId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!originalUrl) {
      setCachedUrl(null);
      setFileId(null);
      return;
    }

    // Check if it's from iCMS-bucket
    if (!originalUrl.includes('/file/iCMS-bucket/')) {
      setCachedUrl(originalUrl);
      setFileId(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cached = fileCacheService.getCachedFileUrl(originalUrl);
      const id = extractFileIdentifier(originalUrl);
      
      setCachedUrl(cached);
      setFileId(id);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Caching failed'));
      setCachedUrl(originalUrl);
      setIsLoading(false);
    }
  }, [originalUrl]);

  return { 
    cachedUrl, 
    isLoading, 
    error, 
    fileId,
    isFromiCMS: Boolean(originalUrl?.includes('/file/iCMS-bucket/'))
  };
}

// Hook for preloading multiple files
export function useFilePreloader() {
  const preload = React.useCallback((urls: string[]) => {
    fileCacheService.preloadFiles(urls);
  }, []);

  const getCacheStats = React.useCallback(() => {
    return fileCacheService.getCacheStats();
  }, []);

  return { preload, getCacheStats };
}