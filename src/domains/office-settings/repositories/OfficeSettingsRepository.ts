import { PublicApiClient } from '@/repositories/http/PublicApiClient';

export interface OfficeSettingsResponse {
  id: string;
  directorate: {
    ne: string;
    en: string;
  };
  officeName: {
    ne: string;
    en: string;
  };
  officeAddress: {
    ne: string;
    en: string;
  };
  backgroundPhoto?: string;
  email: string;
  phoneNumber: {
    ne: string;
    en: string;
  };
  xLink?: string;
  mapIframe?: string;
  website?: string;
  youtube?: string;
  leftLogo?: {
    presignedUrl?: string;
    url?: string;
    altText?: {
      ne: string;
      en: string;
    };
  };
  rightLogo?: {
    presignedUrl?: string;
    url?: string;
    altText?: {
      ne: string;
      en: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Repository responsible for direct API interactions for Office Settings.
 */
export interface OfficeSettingsRepository {
  getOfficeSettings(): Promise<any>;
  getOfficeSettingsForSEO(): Promise<any>;
}

class OfficeSettingsRepositoryImpl implements OfficeSettingsRepository {
  private readonly BASE_URL = '/office-settings';
  private apiClient: PublicApiClient;

  constructor() {
    this.apiClient = new PublicApiClient();
  }

  async getOfficeSettings(): Promise<any> {
    return this.apiClient.get<any>(this.BASE_URL);
  }

  async getOfficeSettingsForSEO(): Promise<any> {
    return this.apiClient.get<any>(`${this.BASE_URL}/seo`);
  }
}

export const officeSettingsRepository: OfficeSettingsRepository = new OfficeSettingsRepositoryImpl();