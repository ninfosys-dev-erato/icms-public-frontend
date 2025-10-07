import { 
  FooterLinks, 
  OfficeSettings, 
  OfficeDescription, 
  HeaderConfig,
  ApiResponse,
  FooterQuery 
} from '../types/footer';
import { PublicApiClient } from '@/repositories/http/PublicApiClient';

/**
 * Repository responsible for direct API interactions for Footer data.
 * This layer should be the ONLY place that talks to the HTTP client.
 * Services and stores must depend on this repository rather than apiClient directly.
 */
export interface FooterRepository {
  // Important Links
  getFooterLinks(lang?: string): Promise<ApiResponse<FooterLinks>>;
  getActiveImportantLinks(lang?: string): Promise<ApiResponse<any[]>>;
  
  // Office Settings
  getOfficeSettings(lang?: string): Promise<ApiResponse<OfficeSettings>>;
  
  // Office Descriptions
  getOfficeDescriptionByType(type: string, lang?: string): Promise<ApiResponse<OfficeDescription>>;
  
  // Header Config (for logos)
  getActiveHeaderConfig(): Promise<ApiResponse<HeaderConfig>>;
}

class FooterRepositoryImpl implements FooterRepository {
  private readonly apiClient: PublicApiClient;

  constructor() {
    this.apiClient = new PublicApiClient();
  }

  // Important Links
  async getFooterLinks(lang?: string): Promise<ApiResponse<FooterLinks>> {
    const queryParams = new URLSearchParams();
    if (lang) queryParams.append('lang', lang);
    
    const url = queryParams.toString() ? `/important-links/footer?${queryParams.toString()}` : '/important-links/footer';
    return this.apiClient.get<ApiResponse<FooterLinks>>(url);
  }

  async getActiveImportantLinks(lang?: string): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (lang) queryParams.append('lang', lang);
    
    const url = queryParams.toString() ? `/important-links/active?${queryParams.toString()}` : '/important-links/active';
    return this.apiClient.get<ApiResponse<any[]>>(url);
  }

  // Office Settings
  async getOfficeSettings(lang?: string): Promise<ApiResponse<OfficeSettings>> {
    const queryParams = new URLSearchParams();
    if (lang) queryParams.append('lang', lang);
    
    const url = queryParams.toString() ? `/office-settings?${queryParams.toString()}` : '/office-settings';
    return this.apiClient.get<ApiResponse<OfficeSettings>>(url);
  }

  // Office Descriptions
  async getOfficeDescriptionByType(type: string, lang?: string): Promise<ApiResponse<OfficeDescription>> {
    const queryParams = new URLSearchParams();
    if (lang) queryParams.append('lang', lang);
    
    const url = queryParams.toString() ? `/office-descriptions/type/${type}?${queryParams.toString()}` : `/office-descriptions/type/${type}`;
    return this.apiClient.get<ApiResponse<OfficeDescription>>(url);
  }

  // Header Config
  async getActiveHeaderConfig(): Promise<ApiResponse<HeaderConfig>> {
    return this.apiClient.get<ApiResponse<HeaderConfig>>('/header-configs/display/active');
  }
}

export const footerRepository: FooterRepository = new FooterRepositoryImpl();
