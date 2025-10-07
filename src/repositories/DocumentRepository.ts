import { publicApiClient } from './http/PublicApiClient'
import { 
  DocumentResponse,
  DocumentQuery,
  DocumentListResponse,
  DocumentSingleResponse,
  DocumentUrlResponse,
  DocumentType,
  DocumentCategory
} from '@/models'

/**
 * Document Repository - Handles document-related API calls  
 * Maps to backend endpoints: /documents
 * Updated to match exact backend API structure
 */
export class DocumentRepository {
  // Document endpoints (/documents)
  async getAllDocuments(query?: DocumentQuery): Promise<DocumentListResponse> {
    const response = await publicApiClient.get('/documents', query)
    return response as DocumentListResponse
  }

  async getDocumentsByType(type: DocumentType, query?: Omit<DocumentQuery, 'documentType'>): Promise<DocumentListResponse> {
    const response = await publicApiClient.get(`/documents/type/${type}`, query)
    return response as DocumentListResponse
  }

  async getDocumentsByCategory(category: DocumentCategory, query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    const response = await publicApiClient.get(`/documents/category/${category}`, query)
    return response as DocumentListResponse
  }

  async searchDocuments(searchTerm: string, query?: Omit<DocumentQuery, 'search'>): Promise<DocumentListResponse> {
    const response = await publicApiClient.get('/documents/search', { q: searchTerm, ...query })
    return response as DocumentListResponse
  }

  async getDocumentById(id: string): Promise<DocumentResponse | null> {
    try {
      const response = await publicApiClient.get(`/documents/${id}`)
      if (response.success) {
        return response.data as DocumentResponse
      }
      return null
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  // Document-specific endpoints from backend
  async getPDFDocuments(query?: Omit<DocumentQuery, 'documentType'>): Promise<DocumentListResponse> {
    const response = await publicApiClient.get('/documents/pdfs', query)
    return response as DocumentListResponse
  }

  async getFormDocuments(query?: Omit<DocumentQuery, 'documentType'>): Promise<DocumentListResponse> {
    const response = await publicApiClient.get('/documents/forms', query)
    return response as DocumentListResponse
  }

  async getPolicyDocuments(query?: Omit<DocumentQuery, 'documentType'>): Promise<DocumentListResponse> {
    const response = await publicApiClient.get('/documents/policies', query)
    return response as DocumentListResponse
  }

  async getReportDocuments(query?: Omit<DocumentQuery, 'documentType'>): Promise<DocumentListResponse> {
    const response = await publicApiClient.get('/documents/reports', query)
    return response as DocumentListResponse
  }

  // Document download/URL endpoints
  async downloadDocument(id: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/${id}/download`, {
      method: 'GET'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`)
    }
    
    return response.blob()
  }

  async getDocumentUrl(id: string): Promise<string> {
    try {
      const response = await publicApiClient.get(`/documents/${id}/url`)
      if (response.success) {
        return response.data.downloadUrl || response.data.presignedUrl
      }
      throw new Error('Failed to get document URL')
    } catch (error) {
      console.error(`Failed to get URL for document ${id}:`, error)
      throw error
    }
  }

  async getDocumentDownloadUrl(id: string): Promise<DocumentUrlResponse> {
    const response = await publicApiClient.get(`/documents/${id}/download-url`)
    return response as DocumentUrlResponse
  }

  async getDocumentPreviewUrl(id: string): Promise<string> {
    try {
      const response = await publicApiClient.get(`/documents/${id}/preview-url`)
      if (response.success) {
        return response.data.previewUrl
      }
      throw new Error('Failed to get document preview URL')
    } catch (error) {
      console.error(`Failed to get preview URL for document ${id}:`, error)
      throw error
    }
  }

  // Convenience methods for document categories (using enum values)
  async getOfficialDocuments(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('OFFICIAL', query)
  }

  async getReports(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('REPORT', query)
  }

  async getForms(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('FORM', query)
  }

  async getPolicies(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('POLICY', query)
  }

  async getProcedures(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('PROCEDURE', query)
  }

  async getGuidelines(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('GUIDELINE', query)
  }

  async getNotices(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('NOTICE', query)
  }

  async getCirculars(query?: Omit<DocumentQuery, 'category'>): Promise<DocumentListResponse> {
    return this.getDocumentsByCategory('CIRCULAR', query)
  }

  // Get popular/recent documents for homepage
  async getPopularDocuments(limit = 10): Promise<DocumentResponse[]> {
    try {
      const response = await this.getAllDocuments({
        page: 1,
        limit,
        sort: 'downloadCount',
        order: 'desc',
        isPublic: true,
        isActive: true
      })
      
      if (response.success) {
        return response.data
      }
      return []
    } catch (error) {
      console.warn('Failed to fetch popular documents:', error)
      return []
    }
  }

  async getRecentDocuments(limit = 10): Promise<DocumentResponse[]> {
    try {
      const response = await this.getAllDocuments({
        page: 1,
        limit,
        sort: 'publishDate',
        order: 'desc',
        isPublic: true,
        isActive: true
      })
      
      if (response.success) {
        return response.data
      }
      return []
    } catch (error) {
      console.warn('Failed to fetch recent documents:', error)
      return []
    }
  }

  // Get available document types and categories
  getDocumentTypes(): DocumentType[] {
    return ['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT', 'RTF', 'CSV', 'ZIP', 'RAR', 'OTHER']
  }

  getDocumentCategories(): DocumentCategory[] {
    return ['OFFICIAL', 'REPORT', 'FORM', 'POLICY', 'PROCEDURE', 'GUIDELINE', 'NOTICE', 'CIRCULAR', 'OTHER']
  }
}

// Export singleton instance
export const documentRepository = new DocumentRepository()