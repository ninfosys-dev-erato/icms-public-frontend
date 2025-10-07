import { officeDescriptionRepository } from '../repositories/OfficeDescriptionRepository';
import { 
  OfficeDescriptionResponse,
  OfficeDescriptionQuery,
  OfficeDescriptionType,
  TranslatableEntity
} from '../types/office-description';

export class OfficeDescriptionService {

  // ========================================
  // MAIN DATA OPERATIONS
  // ========================================

  static async getAllOfficeDescriptions(query?: OfficeDescriptionQuery): Promise<OfficeDescriptionResponse[]> {
    try {
      const response = await officeDescriptionRepository.getAllOfficeDescriptions(query);
      const data = this.extractDataFromResponse(response);
      return Array.isArray(data) ? data.map(this.transformBackendOfficeDescription) : [];
    } catch (error) {
      this.handleError(error, 'Failed to fetch office descriptions');
      throw error;
    }
  }

  static async getOfficeDescriptionById(id: string, lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getOfficeDescriptionById(id, lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, 'Failed to fetch office description by ID');
      throw error;
    }
  }

  static async getOfficeDescriptionByType(type: OfficeDescriptionType, lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getOfficeDescriptionByType(type, lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, `Failed to fetch office description of type ${type}`);
      throw error;
    }
  }

  // ========================================
  // SPECIFIC TYPE OPERATIONS
  // ========================================

  static async getOfficeIntroduction(lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getOfficeIntroduction(lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, 'Failed to fetch office introduction');
      throw error;
    }
  }

  static async getOfficeObjective(lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getOfficeObjective(lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, 'Failed to fetch office objective');
      throw error;
    }
  }

  static async getOfficeWorkDetails(lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getOfficeWorkDetails(lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, 'Failed to fetch office work details');
      throw error;
    }
  }

  static async getOrganizationalStructure(lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getOrganizationalStructure(lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, 'Failed to fetch organizational structure');
      throw error;
    }
  }

  static async getDigitalCharter(lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getDigitalCharter(lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, 'Failed to fetch digital charter');
      throw error;
    }
  }

  static async getEmployeeSanctions(lang?: string): Promise<OfficeDescriptionResponse> {
    try {
      const response = await officeDescriptionRepository.getEmployeeSanctions(lang);
      const data = this.extractDataFromResponse(response);
      return this.transformBackendOfficeDescription(data);
    } catch (error) {
      this.handleError(error, 'Failed to fetch employee sanctions');
      throw error;
    }
  }

  static async getOfficeDescriptionTypes(): Promise<OfficeDescriptionType[]> {
    try {
      const response = await officeDescriptionRepository.getOfficeDescriptionTypes();
      const data = this.extractDataFromResponse(response);
      return Array.isArray(data) ? data : Object.values(OfficeDescriptionType);
    } catch (error) {
      this.handleError(error, 'Failed to fetch office description types');
      // Return default types as fallback
      return Object.values(OfficeDescriptionType);
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Get localized text from translatable entity
   */
  static getLocalizedText(entity: TranslatableEntity, locale: 'ne' | 'en'): string {
    return entity[locale] || entity.en || entity.ne || '';
  }

  /**
   * Get display title for office description
   */
  static getDisplayTitle(officeDescription: OfficeDescriptionResponse, locale: 'ne' | 'en'): string {
    if (!officeDescription?.content) return 'Untitled';
    return this.getLocalizedText(officeDescription.content, locale) || 'Untitled';
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Extract data from API response
   */
  private static extractDataFromResponse(response: any): any | null {
    if (!response) return null;
    // Common patterns: { data: description }, description directly
    const candidate = response.data ?? response;
    return candidate ?? null;
  }

  /**
   * Transform backend office description to frontend format
   */
  private static transformBackendOfficeDescription(backendData: any): OfficeDescriptionResponse {
    if (!backendData) {
      throw new Error('Invalid office description data received from backend');
    }

    return {
      id: backendData.id || backendData._id || '',
      officeDescriptionType: backendData.officeDescriptionType || OfficeDescriptionType.INTRODUCTION,
      content: backendData.content || { ne: '', en: '' },
      createdAt: backendData.createdAt || new Date().toISOString(),
      updatedAt: backendData.updatedAt || new Date().toISOString(),
    };
  }

  private static handleError(error: unknown, defaultMessage: string): void {
    console.error(`OfficeDescriptionService Error: ${defaultMessage}`, error);
    
    if (error instanceof Error) {
      throw new Error(`${defaultMessage}: ${error.message}`);
    }
    
    throw new Error(defaultMessage);
  }
}