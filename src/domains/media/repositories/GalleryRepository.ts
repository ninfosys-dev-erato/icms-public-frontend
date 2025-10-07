import { publicApiClient } from '@/repositories/http/PublicApiClient'
import { 
  GalleryResponse,
  GalleryQuery
} from '../types'

/**
 * Gallery Repository - Handles gallery photo API calls
 * Maps to backend endpoint: /api/v1/media/public/gallery
 */
export class GalleryRepository {
  // Get gallery photos with pagination
  async getGalleryPhotos(query?: GalleryQuery): Promise<GalleryResponse> {
    const response = await publicApiClient.get('/media/public/gallery', query)
    return response as GalleryResponse
  }

  // Get homepage gallery photos (limited set)
  async getHomepageGalleryPhotos(limit: number = 6): Promise<GalleryResponse> {
    const response = await publicApiClient.get('/media/public/gallery', { 
      page: 1, 
      limit 
    })
    return response as GalleryResponse
  }

  // Get all gallery photos for full gallery page
  async getAllGalleryPhotos(page: number = 1, limit: number = 20): Promise<GalleryResponse> {
    try {
      console.log('🔍 GalleryRepository: Making API call to /media/public/gallery with page:', page, 'limit:', limit);
      const response = await publicApiClient.get('/media/public/gallery', { 
        page, 
        limit 
      })
      console.log('🔍 GalleryRepository: API response received:', response);
      
      // Validate the response structure
      if (!response || typeof response !== 'object') {
        console.error('❌ GalleryRepository: Invalid response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      const typedResponse = response as any;
      
      if (!typedResponse.success) {
        console.error('❌ GalleryRepository: API response not successful:', typedResponse.error);
        throw new Error(typedResponse.error || 'API request failed');
      }
      
      if (!Array.isArray(typedResponse.data)) {
        console.error('❌ GalleryRepository: Data is not an array:', typedResponse.data);
        throw new Error('Invalid data structure: expected array');
      }
      
      console.log('🔍 GalleryRepository: Response validation successful, data count:', typedResponse.data.length);
      return response as GalleryResponse
    } catch (error) {
      console.error('❌ GalleryRepository: Error in getAllGalleryPhotos:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const galleryRepository = new GalleryRepository()
