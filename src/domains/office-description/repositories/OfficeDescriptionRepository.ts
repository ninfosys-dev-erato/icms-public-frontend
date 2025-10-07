import { 
  OfficeDescriptionResponse,
  OfficeDescriptionQuery,
  OfficeDescriptionType 
} from '../types/office-description';
import { PublicApiClient } from '@/repositories/http/PublicApiClient';

/**
 * Repository responsible for direct API interactions for Office Descriptions.
 * This layer should be the ONLY place that talks to the HTTP client.
 */
export interface OfficeDescriptionRepository {
  // Basic CRUD operations
  getAllOfficeDescriptions(params?: Partial<OfficeDescriptionQuery>): Promise<any>;
  getOfficeDescriptionById(id: string, lang?: string): Promise<any>;
  getOfficeDescriptionByType(type: OfficeDescriptionType, lang?: string): Promise<any>;
  
  // Specific type getters
  getOfficeIntroduction(lang?: string): Promise<any>;
  getOfficeObjective(lang?: string): Promise<any>;
  getOfficeWorkDetails(lang?: string): Promise<any>;
  getOrganizationalStructure(lang?: string): Promise<any>;
  getDigitalCharter(lang?: string): Promise<any>;
  getEmployeeSanctions(lang?: string): Promise<any>;
  
  // Utility
  getOfficeDescriptionTypes(): Promise<any>;
}

class OfficeDescriptionRepositoryImpl implements OfficeDescriptionRepository {
  private readonly BASE_URL = '/office-descriptions';
  private apiClient: PublicApiClient;

  constructor() {
    this.apiClient = new PublicApiClient();
  }

  // Basic operations
  async getAllOfficeDescriptions(params: Partial<OfficeDescriptionQuery> = {}): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (params.type) queryParams.append('type', params.type);
    if (params.lang) queryParams.append('lang', params.lang);

    const url = queryParams.toString() ? `${this.BASE_URL}?${queryParams.toString()}` : this.BASE_URL;
    return this.apiClient.get<any>(url);
  }

  async getOfficeDescriptionById(id: string, lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/${id}?lang=${lang}` : `${this.BASE_URL}/${id}`;
    return this.apiClient.get<any>(url);
  }

  async getOfficeDescriptionByType(type: OfficeDescriptionType, lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/type/${type}?lang=${lang}` : `${this.BASE_URL}/type/${type}`;
    return this.apiClient.get<any>(url);
  }

  // Specific type getters
  async getOfficeIntroduction(lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/introduction?lang=${lang}` : `${this.BASE_URL}/introduction`;
    return this.apiClient.get<any>(url);
  }

  async getOfficeObjective(lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/objective?lang=${lang}` : `${this.BASE_URL}/objective`;
    return this.apiClient.get<any>(url);
  }

  async getOfficeWorkDetails(lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/work-details?lang=${lang}` : `${this.BASE_URL}/work-details`;
    return this.apiClient.get<any>(url);
  }

  async getOrganizationalStructure(lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/organizational-structure?lang=${lang}` : `${this.BASE_URL}/organizational-structure`;
    return this.apiClient.get<any>(url);
  }

  async getDigitalCharter(lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/digital-charter?lang=${lang}` : `${this.BASE_URL}/digital-charter`;
    return this.apiClient.get<any>(url);
  }

  async getEmployeeSanctions(lang?: string): Promise<any> {
    const url = lang ? `${this.BASE_URL}/employee-sanctions?lang=${lang}` : `${this.BASE_URL}/employee-sanctions`;
    return this.apiClient.get<any>(url);
  }

  // Utility
  async getOfficeDescriptionTypes(): Promise<any> {
    return this.apiClient.get<any>(`${this.BASE_URL}/types`);
  }
}

export const officeDescriptionRepository: OfficeDescriptionRepository = new OfficeDescriptionRepositoryImpl();