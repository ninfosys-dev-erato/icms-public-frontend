import { noticeRepository } from '../repositories/NoticeRepository'
import { 
  NoticeResponse,
  NoticeQuery,
  Notice
} from '../types'

/**
 * Notice Service - Handles notice business logic
 */
export class NoticeService {
  // Get homepage notices
  async getHomepageNotices(limit: number = 6): Promise<Notice[]> {
    try {
      const response = await noticeRepository.getHomepageNotices(limit)
      if (response.success) {
        return response.data
      }
      throw new Error(response.error || 'Failed to fetch homepage notices')
    } catch (error) {
      console.error('Error fetching homepage notices:', error)
      throw error
    }
  }

  // Get paginated notices
  async getNotices(query: NoticeQuery): Promise<NoticeResponse> {
    try {
      const response = await noticeRepository.getNotices(query)
      if (response.success) {
        return response
      }
      throw new Error(response.error || 'Failed to fetch notices')
    } catch (error) {
      console.error('Error fetching notices:', error)
      throw error
    }
  }

  // Get all notices for full notices page
  async getAllNotices(page: number = 1, limit: number = 20): Promise<NoticeResponse> {
    try {
      console.log('🔍 NoticeService: Fetching notices with page:', page, 'limit:', limit);
      const response = await noticeRepository.getAllNotices(page, limit)
      console.log('🔍 NoticeService: Raw API response:', response);
      
      if (response.success) {
        console.log('🔍 NoticeService: API response successful, data count:', response.data?.length);
        console.log('🔍 NoticeService: First notice data:', response.data?.[0]);
        return response
      }
      console.error('🔍 NoticeService: API response not successful:', response.error);
      throw new Error(response.error || 'Failed to fetch all notices')
    } catch (error) {
      console.error('❌ NoticeService: Error fetching all notices:', error)
      throw error
    }
  }

  // Format notice data for display
  formatNoticeForDisplay(notice: Notice) {
    return {
      id: notice.id,
      title: notice.title_en || notice.title,
      titleNe: notice.title,
      summary: notice.summary_en || notice.summary,
      summaryNe: notice.summary,
      content: notice.content_en || notice.content,
      contentNe: notice.content,
      referenceNo: notice.referenceNo,
      type: notice.type,
      priority: notice.priority,
      publishedAt: notice.publishedAt,
      bsDate: notice.bsDate,
      permalink: notice.permalink,
      viewCount: notice.viewCount,
      downloadCount: notice.downloadCount,
      tags: notice.tags,
      categories: notice.categories,
      attachments: notice.attachments
    }
  }

  // Filter notices by type
  filterNoticesByType(notices: Notice[], type: string): Notice[] {
    if (!type) return notices
    return notices.filter(notice => notice.type === type)
  }

  // Filter notices by priority
  filterNoticesByPriority(notices: Notice[], priority: string): Notice[] {
    if (!priority) return notices
    return notices.filter(notice => notice.priority === priority)
  }

  // Search notices by title or content
  searchNotices(notices: Notice[], searchTerm: string): Notice[] {
    if (!searchTerm) return notices
    const term = searchTerm.toLowerCase()
    return notices.filter(notice => 
      (notice.title?.toLowerCase().includes(term)) ||
      (notice.title_en?.toLowerCase().includes(term)) ||
      (notice.summary?.toLowerCase().includes(term)) ||
      (notice.summary_en?.toLowerCase().includes(term)) ||
      (notice.content?.toLowerCase().includes(term)) ||
      (notice.content_en?.toLowerCase().includes(term)) ||
      (notice.referenceNo?.toLowerCase().includes(term))
    )
  }

  // Get notice priority color
  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'urgent':
        return '#da1e28' // Red
      case 'high':
        return '#f1c21b' // Yellow
      default:
        return '#0f62fe' // Blue
    }
  }

  // Get notice type label
  getTypeLabel(type: string): string {
    switch (type) {
      case 'notice':
        return 'Notice'
      case 'circular':
        return 'Circular'
      case 'tender':
        return 'Tender'
      case 'vacancy':
        return 'Vacancy'
      case 'result':
        return 'Result'
      default:
        return 'Notice'
    }
  }
}

// Export singleton instance
export const noticeService = new NoticeService()
