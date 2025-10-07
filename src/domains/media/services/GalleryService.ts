import { galleryRepository } from '../repositories/GalleryRepository'
import { 
  GalleryResponse,
  GalleryQuery,
  GalleryPhoto
} from '../types'

/**
 * Gallery Service - Handles gallery business logic
 */
export class GalleryService {
  // Get homepage gallery photos
  async getHomepageGalleryPhotos(limit: number = 6): Promise<GalleryPhoto[]> {
    try {
      const response = await galleryRepository.getHomepageGalleryPhotos(limit)
      if (response.success) {
        return response.data
      }
      throw new Error(response.error || 'Failed to fetch homepage gallery photos')
    } catch (error) {
      console.error('Error fetching homepage gallery photos:', error)
      throw error
    }
  }

  // Get paginated gallery photos
  async getGalleryPhotos(query: GalleryQuery): Promise<GalleryResponse> {
    try {
      const response = await galleryRepository.getGalleryPhotos(query)
      if (response.success) {
        return response
      }
      throw new Error(response.error || 'Failed to fetch gallery photos')
    } catch (error) {
      console.error('Error fetching gallery photos:', error)
      throw error
    }
  }

  // Get all gallery photos for full gallery page
  async getAllGalleryPhotos(page: number = 1, limit: number = 20): Promise<GalleryResponse> {
    try {
      console.log('🔍 GalleryService: Fetching gallery photos with page:', page, 'limit:', limit);
      const response = await galleryRepository.getAllGalleryPhotos(page, limit)
      console.log('🔍 GalleryService: Raw API response:', response);
      
      if (response.success) {
        console.log('🔍 GalleryService: API response successful, data count:', response.data?.length);
        console.log('🔍 GalleryService: First photo data:', response.data?.[0]);
        return response
      }
      console.error('🔍 GalleryService: API response not successful:', response.error);
      throw new Error(response.error || 'Failed to fetch all gallery photos')
    } catch (error) {
      console.error('❌ GalleryService: Error fetching all gallery photos:', error)
      throw error
    }
  }

  // Format photo data for display
  formatPhotoForDisplay(photo: GalleryPhoto) {
    return {
      id: photo.id,
      title: photo.title || photo.originalName,
      altText: photo.altText || photo.originalName,
      description: photo.description,
      imageUrl: photo.presignedUrl,
      tags: photo.tags,
      createdAt: photo.createdAt,
      size: photo.size,
      contentType: photo.contentType
    }
  }

  // Filter photos by tags
  filterPhotosByTags(photos: GalleryPhoto[], tags: string[]): GalleryPhoto[] {
    if (!tags.length) return photos
    return photos.filter(photo => 
      tags.some(tag => photo.tags.includes(tag))
    )
  }

  // Search photos by title or description
  searchPhotos(photos: GalleryPhoto[], searchTerm: string): GalleryPhoto[] {
    if (!searchTerm) return photos
    const term = searchTerm.toLowerCase()
    return photos.filter(photo => 
      (photo.title?.toLowerCase().includes(term)) ||
      (photo.description?.toLowerCase().includes(term)) ||
      (photo.originalName.toLowerCase().includes(term))
    )
  }
}

// Export singleton instance
export const galleryService = new GalleryService()
