import { 
  SliderResponse, 
  SliderQuery, 
  SliderApiResponse,
  ApiResponse,
  SliderAnalytics 
} from '../types/slider';
import { PublicApiClient } from '@/repositories/http/PublicApiClient';

export class SliderRepository {
  private apiClient: PublicApiClient;

  constructor() {
    this.apiClient = new PublicApiClient();
  }

  /**
   * Get active sliders for display
   */
  async getActiveSliders(): Promise<SliderResponse[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<SliderApiResponse[]>>('/sliders/display/active');
      
      console.log('SliderRepository: Raw API response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch active sliders');
      }

      // Convert API response to SliderResponse format
      const sliders = response.data.map(slider => ({
        ...slider,
        createdAt: new Date(slider.createdAt),
        updatedAt: new Date(slider.updatedAt)
      })) as unknown as SliderResponse[];
      
      console.log('SliderRepository: Processed sliders:', sliders);
      console.log('SliderRepository: Slider count:', sliders.length);
      
      return sliders;
    } catch (error) {
      console.error('SliderRepository: Failed to fetch active sliders:', error);
      throw new Error('Failed to load active sliders');
    }
  }

  /**
   * Get all published sliders
   */
  async getSliders(query?: SliderQuery): Promise<SliderResponse[]> {
    try {
      const params: any = {};
      
      if (query?.page) params.page = query.page;
      if (query?.limit) params.limit = query.limit;
      if (query?.search) params.search = query.search;
      if (query?.position) params.position = query.position;
      if (query?.isActive !== undefined) params.isActive = query.isActive;

      const response = await this.apiClient.get<ApiResponse<SliderApiResponse[]>>('/sliders', params);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch sliders');
      }

      // Convert API response to SliderResponse format
      return response.data.map(slider => ({
        ...slider,
        createdAt: new Date(slider.createdAt),
        updatedAt: new Date(slider.updatedAt)
      })) as unknown as SliderResponse[];
    } catch (error) {
      console.error('SliderRepository: Failed to fetch sliders:', error);
      throw new Error('Failed to load sliders');
    }
  }

  /**
   * Get specific slider by ID
   */
  async getSliderById(id: string): Promise<SliderResponse> {
    try {
      const response = await this.apiClient.get<ApiResponse<SliderApiResponse>>(`/sliders/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch slider');
      }

      // Convert API response to SliderResponse format
      return {
        ...response.data,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      } as unknown as SliderResponse;
    } catch (error) {
      console.error('SliderRepository: Failed to fetch slider by ID:', error);
      throw new Error('Failed to load slider');
    }
  }

  /**
   * Get sliders by position
   */
  async getSlidersByPosition(position: number): Promise<SliderResponse[]> {
    try {
      const response = await this.apiClient.get<ApiResponse<SliderApiResponse[]>>(`/sliders/position/${position}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch sliders by position');
      }

      // Convert API response to SliderResponse format
      return response.data.map(slider => ({
        ...slider,
        createdAt: new Date(slider.createdAt),
        updatedAt: new Date(slider.updatedAt)
      })) as unknown as SliderResponse[];
    } catch (error) {
      console.error('SliderRepository: Failed to fetch sliders by position:', error);
      throw new Error('Failed to load sliders by position');
    }
  }

  /**
   * Track slider click
   */
  async trackSliderClick(sliderId: string): Promise<void> {
    try {
      await this.apiClient.post(`/sliders/${sliderId}/click`, {});
    } catch (error) {
      console.warn('SliderRepository: Failed to track slider click:', error);
      // Don't throw error for analytics tracking
    }
  }

  /**
   * Track slider view
   */
  async trackSliderView(sliderId: string): Promise<void> {
    try {
      await this.apiClient.post(`/sliders/${sliderId}/view`, {});
    } catch (error) {
      console.warn('SliderRepository: Failed to track slider view:', error);
      // Don't throw error for analytics tracking
    }
  }
}