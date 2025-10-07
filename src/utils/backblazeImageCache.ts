/**
 * Utility for caching Backblaze presigned URL images
 */

// Extract file identifier from Backblaze URL for consistent caching
export function extractFileIdentifier(backblazeUrl: string): string | null {
  if (!backblazeUrl) return null;
  
  try {
    // Extract the file path from iCMS-bucket URLs
    // Example: /file/iCMS-bucket/content-attachments/cmes4nlno003ii0j8kdr6j6f4/1756200402511-ibpr7hpf2a-1.pdf
    const match = backblazeUrl.match(/\/file\/iCMS-bucket\/(.+?)\?/);
    if (match && match[1]) {
      // Use the file path as identifier (without query params)
      return match[1];
    }
    
    // Fallback: try to extract filename
    const urlObj = new URL(backblazeUrl);
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    
    if (filename && filename.includes('-')) {
      // For files like "1756200402511-ibpr7hpf2a-1.pdf"
      // Extract the content ID part
      const parts = filename.split('-');
      if (parts.length >= 2) {
        return parts.slice(1, -1).join('-'); // Get middle parts
      }
    }
    
    return pathname.replace(/^\/file\/[^\/]+\//, ''); // Remove bucket prefix
  } catch (error) {
    console.warn('Failed to extract file identifier:', error);
    return null;
  }
}

// Transform Backblaze URL to use our proxy endpoint with file-based caching
export function getProxiedImageUrl(originalUrl: string): string {
  if (!originalUrl) return originalUrl;
  
  // Check if it's a Backblaze URL
  const isBackblazeUrl = originalUrl.includes('backblazeb2.com') || 
                        originalUrl.includes('b2-api.backblazeb2.com');
  
  if (!isBackblazeUrl) return originalUrl;
  
  // Get file identifier for consistent caching
  const fileId = extractFileIdentifier(originalUrl);
  
  // Return proxied URL that will be cached by Next.js and CDN
  const encodedUrl = encodeURIComponent(originalUrl);
  const proxiedUrl = `/api/file-proxy?url=${encodedUrl}`;
  
  // Add file ID for better cache identification
  if (fileId) {
    return `${proxiedUrl}&fileId=${encodeURIComponent(fileId)}`;
  }
  
  return proxiedUrl;
}

// Hook for getting proxied Backblaze images with caching
export function useBackblazeImage(originalUrl: string | null) {
  const [cachedUrl, setCachedUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (!originalUrl) {
      setCachedUrl(null);
      setIsLoading(false);
      return;
    }

    // Check if URL is from Backblaze
    const isBackblazeUrl = originalUrl.includes('backblazeb2.com') || 
                          originalUrl.includes('b2-api.backblazeb2.com');
    
    if (!isBackblazeUrl) {
      setCachedUrl(originalUrl);
      setIsLoading(false);
      return;
    }

    try {
      const proxiedUrl = getProxiedImageUrl(originalUrl);
      
      // Preload the image to trigger caching
      const img = new Image();
      img.onload = () => {
        setCachedUrl(proxiedUrl);
        setIsLoading(false);
      };
      img.onerror = () => {
        setError(new Error('Failed to load image'));
        setCachedUrl(originalUrl); // Fallback to original
        setIsLoading(false);
      };
      img.src = proxiedUrl;
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setCachedUrl(originalUrl);
      setIsLoading(false);
    }
  }, [originalUrl]);

  return { cachedUrl, isLoading, error };
}

// Batch preload multiple Backblaze images
export function preloadBackblazeImages(urls: string[]) {
  urls.forEach((url, index) => {
    if (!url) return;
    
    setTimeout(() => {
      const proxiedUrl = getProxiedImageUrl(url);
      const img = new Image();
      img.src = proxiedUrl;
      
      // Add to ServiceWorker cache
      if ('serviceWorker' in navigator) {
        fetch(proxiedUrl).then(response => {
          if (response.ok) {
            caches.open('backblaze-proxy-v1').then(cache => {
              cache.put(proxiedUrl, response.clone()).catch(() => {
                // Silent fail for cache storage
              });
            });
          }
        }).catch(() => {
          // Silent fail for fetch
        });
      }
    }, index * 100); // Stagger requests
  });
}

import React from 'react';