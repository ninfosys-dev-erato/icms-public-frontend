import { useQuery } from '@tanstack/react-query'
import { galleryService } from '../services/GalleryService'
import { GalleryQuery } from '../types'

// Query keys for gallery
export const galleryKeys = {
  all: ['gallery'] as const,
  homepage: () => [...galleryKeys.all, 'homepage'] as const,
  photos: (query: GalleryQuery) => [...galleryKeys.all, 'photos', query] as const,
  allPhotos: (page: number, limit: number) => [...galleryKeys.all, 'allPhotos', page, limit] as const,
}

// Hook for homepage gallery photos
export const useHomepageGallery = (limit: number = 6) => {
  return useQuery({
    queryKey: galleryKeys.homepage(),
    queryFn: () => galleryService.getHomepageGalleryPhotos(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for paginated gallery photos
export const useGalleryPhotos = (query: GalleryQuery) => {
  return useQuery({
    queryKey: galleryKeys.photos(query),
    queryFn: () => galleryService.getGalleryPhotos(query),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for all gallery photos (full gallery page)
export const useAllGalleryPhotos = (page: number = 1, limit: number = 20) => {
  console.log('🔍 useAllGalleryPhotos: Hook called with page:', page, 'limit:', limit);
  
  return useQuery({
    queryKey: galleryKeys.allPhotos(page, limit),
    queryFn: async () => {
      console.log('🔍 useAllGalleryPhotos: Executing query function');
      const result = await galleryService.getAllGalleryPhotos(page, limit);
      console.log('🔍 useAllGalleryPhotos: Query result:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}
