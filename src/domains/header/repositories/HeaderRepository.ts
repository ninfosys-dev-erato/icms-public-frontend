import { 
  HeaderConfigQuery, 
  HeaderConfigResponse, 
  ApiResponse,
  PaginatedResponse
} from '../types/header';
import { PublicApiClient } from '@/repositories/http/PublicApiClient';

/**
 * Repository responsible for direct API interactions for Header configurations.
 * This layer should be the ONLY place that talks to the HTTP client.
 * Services and stores must depend on this repository rather than apiClient directly.
 */
export interface HeaderRepository {
  // Header configs
  getHeaderConfigs(params?: Partial<HeaderConfigQuery>): Promise<ApiResponse<PaginatedResponse<HeaderConfigResponse>>>;
  getHeaderConfigById(id: string): Promise<ApiResponse<HeaderConfigResponse>>;
  getActiveHeaderConfig(): Promise<ApiResponse<HeaderConfigResponse>>;
  getHeaderConfigByOrder(order: number): Promise<ApiResponse<HeaderConfigResponse>>;
  
  // CSS generation
  getHeaderCSS(id: string): Promise<ApiResponse<{ css: string }>>;
  
  // Preview
  previewHeaderConfig(data: any): Promise<ApiResponse<any>>;
}

class HeaderRepositoryImpl implements HeaderRepository {
  private readonly BASE_URL = '/header-configs';
  private apiClient: PublicApiClient;

  constructor() {
    this.apiClient = new PublicApiClient();
  }

  // Header configs
  async getHeaderConfigs(params: Partial<HeaderConfigQuery> = {}): Promise<ApiResponse<PaginatedResponse<HeaderConfigResponse>>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params.isPublished !== undefined) queryParams.append('isPublished', params.isPublished.toString());

    const url = queryParams.toString() ? `${this.BASE_URL}?${queryParams.toString()}` : this.BASE_URL;
    return this.apiClient.get<ApiResponse<PaginatedResponse<HeaderConfigResponse>>>(url);
  }

  async getHeaderConfigById(id: string): Promise<ApiResponse<HeaderConfigResponse>> {
    return this.apiClient.get<ApiResponse<HeaderConfigResponse>>(`${this.BASE_URL}/${id}`);
  }

  async getActiveHeaderConfig(): Promise<ApiResponse<HeaderConfigResponse>> {
    return this.apiClient.get<ApiResponse<HeaderConfigResponse>>(`${this.BASE_URL}/display/active`);
  }

  async getHeaderConfigByOrder(order: number): Promise<ApiResponse<HeaderConfigResponse>> {
    return this.apiClient.get<ApiResponse<HeaderConfigResponse>>(`${this.BASE_URL}/order/${order}`);
  }

  // CSS generation
  async getHeaderCSS(id: string): Promise<ApiResponse<{ css: string }>> {
    return this.apiClient.get<ApiResponse<{ css: string }>>(`${this.BASE_URL}/${id}/css`);
  }

  // Preview
  async previewHeaderConfig(data: any): Promise<ApiResponse<any>> {
    return this.apiClient.post<ApiResponse<any>>(`${this.BASE_URL}/preview`, data);
  }
}

export const headerRepository: HeaderRepository = new HeaderRepositoryImpl();