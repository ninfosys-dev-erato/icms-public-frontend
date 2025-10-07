import { headerRepository } from '../repositories/HeaderRepository';
import { officeDescriptionRepository } from '../../office-description/repositories/OfficeDescriptionRepository';
import { officeSettingsRepository } from '../../office-settings/repositories/OfficeSettingsRepository';
import { NavigationService } from '../../navigation/services/NavigationService';
import { 
  HeaderData, 
  HeaderConfigResponse, 
  HeaderConfigQuery, 
  NavigationItem,
  TranslatableEntity,
  ContactInfo,
  SocialMediaLink,
  OfficeDescriptionType,
  OfficeDescriptionResponse
} from '../types/header';
import { OfficeSettingsResponse } from '../../office-settings/repositories/OfficeSettingsRepository';

export class HeaderService {

  // ========================================
  // MAIN DATA OPERATIONS
  // ========================================

  static async getHeaderData(locale: 'ne' | 'en' = 'en'): Promise<HeaderData> {
    try {
      // Fetch data with graceful error handling
      const [headerResponse, officeSettingsResponse, navigationResponse] = await Promise.allSettled([
        headerRepository.getActiveHeaderConfig(),
        officeSettingsRepository.getOfficeSettings(),
        NavigationService.getHeaderNavigation(locale)
      ]);
      
      // Extract header config
      const headerConfig = headerResponse.status === 'fulfilled' 
        ? this.extractDataFromResponse(headerResponse.value) 
        : undefined;
      
      // Extract office settings
      const officeSettings = officeSettingsResponse.status === 'fulfilled' 
        ? this.extractDataFromResponse(officeSettingsResponse.value) 
        : undefined;
      
      // For now, skip introduction until the endpoint is properly configured
      const introduction = null;
      
      // Extract navigation
      const navigation = navigationResponse.status === 'fulfilled' 
        ? navigationResponse.value 
        : [];
      
      console.log('HeaderService: Navigation data from NavigationService:', navigation);
      console.log('HeaderService: Navigation items with submenus from HeaderService:', 
        navigation.filter((item: any) => item.submenu && item.submenu.length > 0));
      
      // Combine the data
      const combinedData = this.combineHeaderData({
        headerConfig,
        officeSettings,
        introduction,
        locale,
        navigation
      });
      
      console.log('HeaderService: Combined header data:', combinedData);
      console.log('HeaderService: Navigation in combined data:', combinedData.navigation);
      
      return combinedData;
    } catch (error) {
      console.error('HeaderService: API failed', error);
      throw error;
    }
  }

  static async getActiveHeaderConfig(): Promise<HeaderConfigResponse> {
    try {
      const response = await headerRepository.getActiveHeaderConfig();
      return this.extractHeaderFromResponse(response) ?? response;
    } catch (error) {
      this.handleError(error, 'Failed to get active header config');
      throw error;
    }
  }

  static async getHeaderConfigs(query?: HeaderConfigQuery): Promise<HeaderConfigResponse[]> {
    try {
      const response = await headerRepository.getHeaderConfigs(query);
      const data = this.extractHeaderFromResponse(response);
      return Array.isArray(data) ? data : [data].filter(Boolean);
    } catch (error) {
      this.handleError(error, 'Failed to get header configs');
      throw error;
    }
  }

  static async getHeaderConfigById(id: string): Promise<HeaderConfigResponse> {
    try {
      const response = await headerRepository.getHeaderConfigById(id);
      return this.extractHeaderFromResponse(response) ?? response;
    } catch (error) {
      this.handleError(error, 'Failed to get header config by ID');
      throw error;
    }
  }

  static async getHeaderCSS(id: string): Promise<string> {
    try {
      const response = await headerRepository.getHeaderCSS(id);
      const data = this.extractHeaderFromResponse(response);
      return data?.css || '';
    } catch (error) {
      this.handleError(error, 'Failed to get header CSS');
      throw error;
    }
  }

  static async previewHeaderConfig(data: any): Promise<any> {
    try {
      const response = await headerRepository.previewHeaderConfig(data);
      return this.extractHeaderFromResponse(response) ?? response;
    } catch (error) {
      this.handleError(error, 'Failed to preview header config');
      throw error;
    }
  }

  // ========================================
  // PRIVATE HELPER METHODS
  // ========================================

  /**
   * Extract data from API response with proper error handling
   */
  private static extractDataFromResponse(response: any): any | null {
    if (!response) return null;
    
    // Handle standardized API response format
    if (response.data !== undefined) {
      return response.data;
    }
    
    // Handle direct data
    return response;
  }
  
  /**
   * Extract header data from API response (legacy method for backward compatibility)
   */
  private static extractHeaderFromResponse(response: any): any | null {
    return this.extractDataFromResponse(response);
  }

  /**
   * Check if response contains header-like data
   */
  private static isHeaderLike(value: any): boolean {
    if (!value || typeof value !== 'object') return false;
    // Accept if it has id or known header fields
    if (value.id || value._id) return true;
    if ('config' in value || 'navigation' in value || 'title' in value) return true;
    return false;
  }

  /**
   * Combine data from multiple sources into HeaderData
   */
  private static combineHeaderData({
    headerConfig,
    officeSettings,
    introduction,
    locale,
    navigation
  }: {
    headerConfig: any | null | undefined;
    officeSettings: OfficeSettingsResponse | null;
    introduction: OfficeDescriptionResponse | null;
    locale: 'ne' | 'en';
    navigation: NavigationItem[];
  }): HeaderData {
    // Transform header config
    const config = headerConfig ? this.transformHeaderConfig(headerConfig) : null;
    
    // Build office info from settings and introduction
    const officeInfo = this.buildOfficeInfo(officeSettings, introduction);
    
    // Build contact info from office settings
    const contactInfo = this.buildContactInfoFromSettings(officeSettings);
    
    // Build social media links from office settings
    const socialMedia = this.buildSocialMediaFromSettings(officeSettings);
    
    return {
      config,
      officeInfo,
      navigation: navigation || [],
      socialMedia,
      contactInfo
    };
  }
  
  /**
   * Build office info from settings and introduction
   */
  private static buildOfficeInfo(
    settings: OfficeSettingsResponse | null,
    introduction: OfficeDescriptionResponse | null
  ) {
    if (!settings) return undefined;
    
    return {
      directorate: settings.directorate,
      officeName: settings.officeName,
      introduction: introduction || undefined
    };
  }
  
  /**
   * Build contact info from office settings
   */
  private static buildContactInfoFromSettings(settings: OfficeSettingsResponse | null): ContactInfo | undefined {
    if (!settings) {
      return undefined;
    }
    
    return {
      address: settings.officeAddress,
      phone: this.getLocalizedText(settings.phoneNumber, 'en'),
      email: settings.email,
      website: settings.website,
      // Removed hardcoded district and province values
      leftLogo: settings.leftLogo,
      rightLogo: settings.rightLogo
    };
  }
  
  /**
   * Build social media links from office settings
   */
  private static buildSocialMediaFromSettings(settings: OfficeSettingsResponse | null): SocialMediaLink[] {
    const socialMedia: SocialMediaLink[] = [];
    
    if (!settings) {
      return [];
    }
    
    let order = 1;
    
    if (settings.xLink) {
      socialMedia.push({
        id: 'social-twitter',
        platform: 'twitter',
        url: settings.xLink,
        title: { ne: 'ट्विटर', en: 'Twitter' },
        order: order++,
        isActive: true
      });
    }
    
    if (settings.youtube) {
      socialMedia.push({
        id: 'social-youtube',
        platform: 'youtube',
        url: settings.youtube,
        title: { ne: 'युट्यूब', en: 'YouTube' },
        order: order++,
        isActive: true
      });
    }
    
    if (settings.email) {
      socialMedia.push({
        id: 'social-email',
        platform: 'email',
        url: `mailto:${settings.email}`,
        title: { ne: 'इमेल', en: 'Email' },
        order: order++,
        isActive: true
      });
    }
    
    return socialMedia;
  }

  /**
   * Transform backend header config to frontend format
   */
  private static transformHeaderConfig(backendConfig: any): HeaderConfigResponse {
    return {
      id: backendConfig.id || backendConfig._id || '',
      name: backendConfig.name || { ne: '', en: '' },
      description: backendConfig.description,
      isActive: backendConfig.isActive ?? true,
      isPublished: backendConfig.isPublished ?? false,
      order: backendConfig.order || 0,
      logoConfiguration: backendConfig.logo || backendConfig.logoConfiguration,
      typographySettings: backendConfig.typography || backendConfig.typographySettings,
      layoutConfiguration: backendConfig.layout || backendConfig.layoutConfiguration,
      customCSS: backendConfig.customCSS,
      createdAt: backendConfig.createdAt || new Date().toISOString(),
      updatedAt: backendConfig.updatedAt || new Date().toISOString()
    };
  }

  /**
   * Process and validate header data
   */
  private static processHeaderData(data: HeaderData, locale: 'ne' | 'en'): HeaderData {
    return {
      ...data,
      navigation: this.processNavigationItems(data.navigation, locale),
      socialMedia: data.socialMedia
        .filter(item => item.url && item.url.trim() !== '')
        .sort((a, b) => a.order - b.order),
    };
  }

  /**
   * Process and sort navigation items
   */
  private static processNavigationItems(items: NavigationItem[], locale: 'ne' | 'en'): NavigationItem[] {
    return items
      .filter(item => item.title && this.hasValidTitle(item.title))
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        submenu: item.submenu
          ? this.processNavigationItems(item.submenu, locale)
          : undefined
      }));
  }

  /**
   * Check if translatable entity has valid title
   */
  private static hasValidTitle(title: TranslatableEntity): boolean {
    return Boolean(title.ne?.trim() && title.en?.trim());
  }

  // ========================================
  // PUBLIC UTILITY METHODS
  // ========================================

  /**
   * Get localized text from translatable entity
   */
  static getLocalizedText(entity: TranslatableEntity | any, locale: 'ne' | 'en'): string {
    if (!entity || typeof entity !== 'object') return '';
    return entity[locale] || entity.en || entity.ne || '';
  }

  /**
   * Check if header data is valid
   */
  static isHeaderDataValid(data: HeaderData | null): data is HeaderData {
    if (!data) return false;
    
    return Boolean(
      data.config &&
      data.config.id &&
      data.navigation &&
      Array.isArray(data.navigation)
    );
  }

  /**
   * Get navigation item by href
   */
  static findNavigationItemByHref(data: HeaderData, href: string): NavigationItem | null {
    const findInItems = (items: NavigationItem[]): NavigationItem | null => {
      for (const item of items) {
        if (item.href === href) {
          return item;
        }
        if (item.submenu) {
          const found = findInItems(item.submenu);
          if (found) return found;
        }
      }
      return null;
    };

    return findInItems(data.navigation);
  }

  /**
   * Check if navigation item is active based on current path
   */
  static isNavigationItemActive(item: NavigationItem, currentPath: string): boolean {
    // Exact match for home page
    if (item.href === '/' && currentPath === '/') {
      return true;
    }

    // For other pages, check if current path starts with item href
    if (item.href !== '/' && currentPath.startsWith(item.href)) {
      return true;
    }

    // Check submenu items
    if (item.submenu) {
      return item.submenu.some(subItem => this.isNavigationItemActive(subItem, currentPath));
    }

    return false;
  }

  /**
   * Get breadcrumb trail for current navigation
   */
  static getBreadcrumbTrail(data: HeaderData, currentPath: string): NavigationItem[] {
    const trail: NavigationItem[] = [];

    const findTrail = (items: NavigationItem[], path: NavigationItem[] = []): boolean => {
      for (const item of items) {
        const currentTrail = [...path, item];
        
        if (this.isNavigationItemActive(item, currentPath)) {
          trail.push(...currentTrail);
          return true;
        }
        
        if (item.submenu && findTrail(item.submenu, currentTrail)) {
          return true;
        }
      }
      return false;
    };

    findTrail(data.navigation);
    return trail;
  }

  private static handleError(error: unknown, defaultMessage: string): void {
    console.error(`HeaderService Error: ${defaultMessage}`, error);
    
    if (error instanceof Error) {
      throw new Error(`${defaultMessage}: ${error.message}`);
    }
    
    throw new Error(defaultMessage);
  }
}

// Export singleton instance for backward compatibility  
export const headerService = new HeaderService();