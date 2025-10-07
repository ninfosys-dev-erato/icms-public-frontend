import { HeaderRepository } from '../repositories/HeaderRepository';
import { HeaderData, HeaderConfigResponse } from '../types/header';

export class HeaderService {
  private headerRepository: HeaderRepository;

  constructor() {
    this.headerRepository = new HeaderRepository();
  }

  async getHeaderData(locale: string = 'en'): Promise<HeaderData> {
    try {
      return await this.headerRepository.getHeaderData(locale);
    } catch (error) {
      console.error('HeaderService: Failed to get header data:', error);
      throw new Error('Failed to load header data');
    }
  }

  async getActiveHeaderConfig(): Promise<HeaderConfigResponse> {
    try {
      return await this.headerRepository.getActiveHeaderConfig();
    } catch (error) {
      console.error('HeaderService: Failed to get active header config:', error);
      throw new Error('Failed to load header configuration');
    }
  }

  async getHeaderConfigs(query?: any): Promise<HeaderConfigResponse[]> {
    try {
      return await this.headerRepository.getHeaderConfigs(query);
    } catch (error) {
      console.error('HeaderService: Failed to get header configs:', error);
      throw new Error('Failed to load header configurations');
    }
  }

  async getHeaderConfigById(id: string): Promise<HeaderConfigResponse> {
    try {
      return await this.headerRepository.getHeaderConfigById(id);
    } catch (error) {
      console.error('HeaderService: Failed to get header config by ID:', error);
      throw new Error('Failed to load header configuration');
    }
  }
}
