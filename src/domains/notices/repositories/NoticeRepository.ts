import { publicApiClient } from '@/repositories/http/PublicApiClient'
import { 
  NoticeResponse,
  NoticeQuery
} from '../types'

/**
 * Notice Repository - Handles notice API calls
 * Maps to backend endpoint: /api/v1/content/category/notice-board
 */
export class NoticeRepository {
  // Get notices with pagination
  async getNotices(query?: NoticeQuery): Promise<NoticeResponse> {
    const response = await publicApiClient.get('/content/category/notice-board', query)
    return response as NoticeResponse
  }

  // Get homepage notices (limited set)
  async getHomepageNotices(limit: number = 6): Promise<NoticeResponse> {
    const response = await publicApiClient.get('/content/category/notice-board', { 
      page: 1, 
      limit 
    })
    return response as NoticeResponse
  }

  // Get all notices for full notices page
  async getAllNotices(page: number = 1, limit: number = 20): Promise<NoticeResponse> {
    try {
      console.log('🔍 NoticeRepository: Making API call to /content/category/notice-board with page:', page, 'limit:', limit);
      const response = await publicApiClient.get('/content/category/notice-board', { 
        page, 
        limit 
      })
      console.log('🔍 NoticeRepository: API response received:', response);
      
      // Validate the response structure
      if (!response || typeof response !== 'object') {
        console.error('❌ NoticeRepository: Invalid response structure:', response);
        throw new Error('Invalid API response structure');
      }
      
      const typedResponse = response as any;
      
      if (!typedResponse.success) {
        console.error('❌ NoticeRepository: API response not successful:', typedResponse.error);
        throw new Error(typedResponse.error || 'API request failed');
      }
      
      if (!Array.isArray(typedResponse.data)) {
        console.error('❌ NoticeRepository: Data is not an array:', typedResponse.data);
        throw new Error('Invalid data structure: expected array');
      }
      
      console.log('🔍 NoticeRepository: Response validation successful, data count:', typedResponse.data.length);
      return response as NoticeResponse
    } catch (error) {
      console.error('❌ NoticeRepository: Error in getAllNotices:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const noticeRepository = new NoticeRepository()
