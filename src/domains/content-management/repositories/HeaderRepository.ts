import { HeaderConfigQuery, HeaderConfigResponse, HeaderData } from '../types/header';
import { PublicApiClient } from '@/repositories/http/PublicApiClient';

export class HeaderRepository {
  private apiClient: PublicApiClient;

  constructor() {
    this.apiClient = new PublicApiClient();
  }

  async getHeaderConfigs(query?: HeaderConfigQuery): Promise<HeaderConfigResponse[]> {
    try {
      const params = new URLSearchParams();
      
      if (query?.page) params.append('page', query.page.toString());
      if (query?.limit) params.append('limit', query.limit.toString());
      if (query?.search) params.append('search', query.search);
      if (query?.isActive !== undefined) params.append('isActive', query.isActive.toString());
      if (query?.isPublished !== undefined) params.append('isPublished', query.isPublished.toString());

      const response = await this.apiClient.get(`/header-configs?${params.toString()}`);
      return (response as any).data;
    } catch (error) {
      console.error('Failed to fetch header configs:', error);
      throw new Error('Failed to fetch header configurations');
    }
  }

  async getHeaderConfigById(id: string): Promise<HeaderConfigResponse> {
    try {
      const response = await this.apiClient.get(`/header-configs/${id}`);
      return (response as any).data;
    } catch (error) {
      console.error(`Failed to fetch header config ${id}:`, error);
      throw new Error('Failed to fetch header configuration');
    }
  }

  async getActiveHeaderConfig(): Promise<HeaderConfigResponse> {
    try {
      const response = await this.apiClient.get('/header-configs/display/active');
      return (response as any).data;
    } catch (error) {
      console.error('Failed to fetch active header config:', error);
      throw new Error('Failed to fetch active header configuration');
    }
  }

  async getHeaderData(locale: string = 'en'): Promise<HeaderData> {
    try {
      // Try to get from backend first
      const config = await this.getActiveHeaderConfig();
      
      // For now, return mock data since backend might not be ready
      // In production, this would fetch from actual backend endpoints
      return this.getMockHeaderData(locale);
    } catch (error) {
      console.warn('Using fallback header data:', error);
      return this.getMockHeaderData(locale);
    }
  }

  private getMockHeaderData(locale: string): HeaderData {
    const isNepali = locale === 'ne';
    
    return {
      config: {
        id: 'header-001',
        title: {
          ne: 'नेपाल सरकार',
          en: 'Government of Nepal'
        },
        description: {
          ne: 'सञ्चार तथा सूचना प्रविधि मन्त्रालय',
          en: 'Ministry of Communication and Information Technology'
        },
        logo: {
          id: 'logo-001',
          url: '/icons/nepal-emblem.svg',
          altText: {
            ne: 'नेपालको राष्ट्रिय चिह्न',
            en: 'National Emblem of Nepal'
          },
          mimeType: 'image/svg+xml',
          fileSize: 1024
        },
        isActive: true,
        isPublished: true,
        settings: {
          showSearch: true,
          showLanguageSwitcher: true,
          showUserMenu: true
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      notices: [
        {
          id: 'notice-001',
          title: {
            ne: 'महत्त्वपूर्ण सूचना',
            en: 'Important Notice'
          },
          content: {
            ne: 'सूचनाको हक कार्यान्वयन सम्बन्धी प्रगति विवरण',
            en: 'Progress Report on the Implementation of the Right to Information'
          },
          priority: 'high',
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      ],
      navigation: [
        {
          id: 'nav-001',
          title: {
            ne: 'हाम्रोबारे',
            en: 'About Us'
          },
          href: '/about',
          order: 1,
          submenu: [
            {
              id: 'nav-001-001',
              title: {
                ne: 'मन्त्रालयको बारेमा',
                en: 'About Ministry'
              },
              href: '/about/ministry',
              order: 1
            },
            {
              id: 'nav-001-002',
              title: {
                ne: 'विभागको बारेमा',
                en: 'About Department'
              },
              href: '/about/department',
              order: 2
            }
          ]
        },
        {
          id: 'nav-002',
          title: {
            ne: 'सेवाहरू',
            en: 'Services'
          },
          href: '/services',
          order: 2,
          submenu: [
            {
              id: 'nav-002-001',
              title: {
                ne: 'सबै सेवाहरू',
                en: 'All Services'
              },
              href: '/services',
              order: 1
            },
            {
              id: 'nav-002-002',
              title: {
                ne: 'अनलाइन सेवाहरू',
                en: 'Online Services'
              },
              href: '/services/online',
              order: 2
            }
          ]
        },
        {
          id: 'nav-003',
          title: {
            ne: 'स्रोतहरू',
            en: 'Resources'
          },
          href: '/resources',
          order: 3
        },
        {
          id: 'nav-004',
          title: {
            ne: 'मिडिया केन्द्र',
            en: 'Media Center'
          },
          href: '/media',
          order: 4
        },
        {
          id: 'nav-005',
          title: {
            ne: 'डाउनलोडहरू',
            en: 'Downloads'
          },
          href: '/downloads',
          order: 5
        },
        {
          id: 'nav-006',
          title: {
            ne: 'अनलाइन सेवाहरू',
            en: 'Online Services'
          },
          href: '/online-services',
          order: 6
        }
      ],
      socialMedia: [
        {
          id: 'social-001',
          platform: 'facebook',
          url: 'https://facebook.com/nepalgov',
          icon: 'facebook',
          title: {
            ne: 'फेसबुक',
            en: 'Facebook'
          }
        },
        {
          id: 'social-002',
          platform: 'twitter',
          url: 'https://twitter.com/nepalgov',
          icon: 'twitter',
          title: {
            ne: 'ट्विटर',
            en: 'Twitter'
          }
        },
        {
          id: 'social-003',
          platform: 'email',
          url: 'mailto:info@nepalgov.np',
          icon: 'email',
          title: {
            ne: 'इमेल',
            en: 'Email'
          }
        }
      ],
      contactInfo: {
        address: {
          ne: 'हुलाक परिसर, बबरमहल, काठमाडौं',
          en: 'Postal Complex, Babarmahal, Kathmandu'
        },
        phone: '+977-1-4211111',
        email: 'info@nepalgov.np',
        website: 'https://nepalgov.np'
      }
    };
  }
}
