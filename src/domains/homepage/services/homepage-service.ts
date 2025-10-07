import { HomepageData, HomepageQuery } from '../types/homepage';

export class HomepageService {
  private static BASE_URL = '/api/homepage';

  /**
   * Fetch homepage data from local API
   */
  static async getHomepageData(query: HomepageQuery = {}): Promise<HomepageData | null> {
    try {
      const queryParams = new URLSearchParams();
      
      if (query.lang) queryParams.append('locale', query.lang);
      if (query.includeInactive !== undefined) queryParams.append('includeInactive', query.includeInactive.toString());
      
      const url = queryParams.toString() ? `${this.BASE_URL}?${queryParams.toString()}` : this.BASE_URL;
      
      // Use local API route instead of external API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.warn('HomepageService: Local API returned error:', response.status);
        // Return fallback data instead of null
        return this.getFallbackData(query.lang || 'en');
      }
      
      const data = await response.json();
      
      if (data?.success && data?.data) {
        return data.data;
      }
      
      console.warn('HomepageService: Local API returned no data, using fallback');
      return this.getFallbackData(query.lang || 'en');
    } catch (error) {
      console.error('HomepageService: Failed to fetch homepage data:', error);
      // Return fallback data instead of null
      return this.getFallbackData(query.lang || 'en');
    }
  }

  /**
   * Get fallback data when API fails
   */
  static getFallbackData(lang: string): HomepageData {
    return {
      header: {
        logo: {
          url: '/icons/nepal-emblem.svg',
          alt: lang === 'ne' ? 'नेपाल सरकार' : 'Nepal Government'
        },
        officeName: {
          en: 'Nepal Government Office',
          ne: 'नेपाल सरकार कार्यालय'
        },
        officeDescription: {
          en: 'Official government portal providing services and information',
          ne: 'सेवाहरू र सूचनाहरू प्रदान गर्ने आधिकारिक सरकारी पोर्टल'
        },
        navigation: [],
        searchEnabled: true,
        languageSwitcherEnabled: true,
        socialMedia: {
          email: 'info@nepal.gov.np'
        }
      },
      hero: {
        title: {
          en: 'Welcome to Nepal Government Portal',
          ne: 'नेपाल सरकार पोर्टलमा स्वागत छ'
        },
        subtitle: {
          en: 'Official Portal of Government of Nepal',
          ne: 'नेपाल सरकारको आधिकारिक पोर्टल'
        },
        statistics: [
          {
            id: '1',
            icon: '🏛️',
            label: { en: 'Services', ne: 'सेवाहरू' },
            value: 50,
            color: '#0066cc'
          }
        ],
        fiscalYearInfo: {
          en: 'Fiscal Year 2024/25',
          ne: 'आर्थिक वर्ष २०८१/८२'
        }
      },
      services: [
        {
          id: '1',
          title: { en: 'Government Services', ne: 'सरकारी सेवाहरू' },
          description: { en: 'Access government services online', ne: 'अनलाइन सरकारी सेवाहरू प्राप्त गर्नुहोस्' },
          icon: '🏛️',
          order: 1,
          isActive: true
        }
      ],
      highlights: [],
      news: [],
      contact: {
        directorGeneral: {
          id: '1',
          name: { en: 'Director General', ne: 'महानिर्देशक' },
          title: { en: 'Director General', ne: 'महानिर्देशक' },
          phone: '+977-1-1234567',
          email: 'dg@nepal.gov.np'
        },
        informationOfficer: {
          id: '2',
          name: { en: 'Information Officer', ne: 'सूचना अधिकारी' },
          title: { en: 'Information Officer', ne: 'सूचना अधिकारी' },
          phone: '+977-1-1234568',
          email: 'io@nepal.gov.np'
        }
      },
      footer: {
        officeInfo: {
          name: { en: 'Nepal Government Office', ne: 'नेपाल सरकार कार्यालय' },
          address: { en: 'Kathmandu, Nepal', ne: 'काठमाडौं, नेपाल' },
          officeHours: {
            winter: {
              sundayToThursday: '10:00 AM - 5:00 PM',
              friday: '10:00 AM - 3:00 PM',
              period: { en: 'Winter (Nov-Mar)', ne: 'जाडो (मंसिर-फाल्गुन)' }
            },
            summer: {
              sundayToThursday: '9:00 AM - 4:00 PM',
              friday: '9:00 AM - 2:00 PM',
              period: { en: 'Summer (Apr-Oct)', ne: 'गर्मी (बैशाख-कार्तिक)' }
            }
          }
        },
        importantLinks: [],
        contactInfo: {
          address: { en: 'Kathmandu, Nepal', ne: 'काठमाडौं, नेपाल' },
          phone: '+977-1-1234567',
          email: 'info@nepal.gov.np'
        }
      }
    };
  }

  /**
   * Fetch navigation data from local API
   */
  static async getNavigationData(lang: string = 'en'): Promise<any[]> {
    try {
      const response = await this.getHomepageData({ lang });
      return response?.header?.navigation || [];
    } catch (error) {
      console.error('HomepageService: Failed to fetch navigation data:', error);
      return [];
    }
  }

  /**
   * Fetch office settings from local API
   */
  static async getOfficeSettings(lang: string = 'en'): Promise<any> {
    try {
      const response = await this.getHomepageData({ lang });
      return response?.header || null;
    } catch (error) {
      console.error('HomepageService: Failed to fetch office settings:', error);
      return null;
    }
  }

  /**
   * Fetch important links from local API
   */
  static async getImportantLinks(lang: string = 'en'): Promise<any[]> {
    try {
      const response = await this.getHomepageData({ lang });
      return response?.footer?.importantLinks || [];
    } catch (error) {
      console.error('HomepageService: Failed to fetch important links:', error);
      return [];
    }
  }

  /**
   * Fetch highlights from local API
   */
  static async getHighlights(lang: string = 'en'): Promise<any[]> {
    try {
      const response = await this.getHomepageData({ lang });
      return response?.highlights || [];
    } catch (error) {
      console.error('HomepageService: Failed to fetch highlights:', error);
      return [];
    }
  }

  /**
   * Fetch news from local API
   */
  static async getNews(lang: string = 'en'): Promise<any[]> {
    try {
      const response = await this.getHomepageData({ lang });
      return response?.news || [];
    } catch (error) {
      console.error('HomepageService: Failed to fetch news:', error);
      return [];
    }
  }

  /**
   * Fetch services from local API
   */
  static async getServices(lang: string = 'en'): Promise<any[]> {
    try {
      const response = await this.getHomepageData({ lang });
      return response?.services || [];
    } catch (error) {
      console.error('HomepageService: Failed to fetch services:', error);
      return [];
    }
  }

  /**
   * Fetch contact info from local API
   */
  static async getContactInfo(lang: string = 'en'): Promise<any> {
    try {
      const response = await this.getHomepageData({ lang });
      return response?.contact || null;
    } catch (error) {
      console.error('HomepageService: Failed to fetch contact info:', error);
      return null;
    }
  }

  /**
   * Get current date and time in Nepali format
   */
  static getCurrentNepaliDateTime(): string {
    const now = new Date();
    const nepaliDate = this.convertToNepaliDate(now);
    const time = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `${nepaliDate}, ${time}`;
  }

  /**
   * Convert Gregorian date to Nepali date (simplified)
   */
  private static convertToNepaliDate(date: Date): string {
    // This is a simplified conversion - in production, use a proper Nepali calendar library
    const year = date.getFullYear() - 57; // Approximate Nepali year
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const nepaliMonths = [
      'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
      'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत'
    ];
    
    const nepaliMonth = nepaliMonths[month - 1] || 'बैशाख';
    
    return `${day} ${nepaliMonth}, ${year}`;
  }
}