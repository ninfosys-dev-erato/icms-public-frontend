import { footerRepository } from '../repositories/FooterRepository';
import { 
  FooterData, 
  FooterLinks, 
  OfficeSettings, 
  OfficeDescription, 
  HeaderConfig,
  TranslatableEntity 
} from '../types/footer';

/**
 * Service responsible for footer business logic and data orchestration.
 * This layer coordinates data from multiple repositories and transforms it for the UI.
 */
export class FooterService {
  /**
   * Get complete footer data by orchestrating multiple API calls
   */
  static async getFooterData(locale: 'en' | 'ne'): Promise<FooterData> {
    try {
      // Fetch all required data in parallel
      const [footerLinksRes, officeSettingsRes, headerConfigRes] = await Promise.allSettled([
        footerRepository.getFooterLinks(locale),
        footerRepository.getOfficeSettings(locale),
        footerRepository.getActiveHeaderConfig()
      ]);

      // Extract data from responses
      const footerLinks = footerLinksRes.status === 'fulfilled' && footerLinksRes.value.success 
        ? footerLinksRes.value.data 
        : this.getDefaultFooterLinks();

      const officeSettings = officeSettingsRes.status === 'fulfilled' && officeSettingsRes.value.success 
        ? officeSettingsRes.value.data 
        : null;

      const headerConfig = headerConfigRes.status === 'fulfilled' && headerConfigRes.value.success 
        ? headerConfigRes.value.data 
        : null;

      // Transform and combine data
      return this.transformFooterData(footerLinks, officeSettings, headerConfig, locale);
    } catch (error) {
      console.error('Error fetching footer data:', error);
      return this.getDefaultFooterData(locale);
    }
  }

  /**
   * Transform raw API data into FooterData structure
   */
  private static transformFooterData(
    footerLinks: FooterLinks,
    officeSettings: OfficeSettings | null,
    headerConfig: HeaderConfig | null,
    locale: 'en' | 'ne'
  ): FooterData {
    // Get logo URLs
    const leftLogo = headerConfig?.logo?.leftLogo?.media?.presignedUrl || 
                    headerConfig?.logo?.leftLogo?.media?.url || 
                    '/icons/nepal-emblem.svg';
    
    const rightLogo = headerConfig?.logo?.rightLogo?.media?.presignedUrl || 
                     headerConfig?.logo?.rightLogo?.media?.url || 
                     '/icons/nepal-emblem.svg';

    return {
      officeInfo: {
        directorate: officeSettings?.directorate,
        officeName: officeSettings?.officeName,
        address: officeSettings?.officeAddress,
        leftLogo,
        rightLogo
      },
      officeHours: this.getOfficeHours(locale),
      importantLinks: footerLinks,
      contactInfo: {
        address: officeSettings?.officeAddress || { en: 'Postal Complex, Babarmahal, Kathmandu', ne: 'हुलाक परिसर, बबरमहल, काठमाडौं' },
        emails: officeSettings?.email ? [officeSettings.email] : ['info@doit.gov.np', 'mailsupport@doit.gov.np'],
        phones: officeSettings?.phoneNumber ? [this.getLocalizedText(officeSettings.phoneNumber, locale)] : ['1-4112334', '1-4117940'],
        socialMedia: {
          facebook: officeSettings?.website,
          twitter: officeSettings?.xLink
        }
      }
    };
  }

  /**
   * Get localized office hours
   */
  private static getOfficeHours(locale: 'en' | 'ne') {
    if (locale === 'ne') {
      return {
        winter: {
          sundayToThursday: 'आइतबार - बिहीबार (१०:०० - ४:००) बजे',
          friday: 'शुक्रबार (१०:०० - ३:००) बजे'
        },
        summer: {
          sundayToThursday: 'आइतबार - बिहीबार (१०:०० - ५:००) बजे',
          friday: 'शुक्रबार (१०:०० - ३:००) बजे'
        }
      };
    }

    return {
      winter: {
        sundayToThursday: 'Sunday - Thursday (10:00 - 4:00)',
        friday: 'Friday (10:00 - 3:00)'
      },
      summer: {
        sundayToThursday: 'Sunday - Thursday (10:00 - 5:00)',
        friday: 'Friday (10:00 - 3:00)'
      }
    };
  }

  /**
   * Get localized text from translatable entity
   */
  static getLocalizedText(entity: TranslatableEntity, locale: 'en' | 'ne'): string {
    return entity[locale] || entity.en || '';
  }

  /**
   * Validate footer data structure
   */
  static isFooterDataValid(data: FooterData): boolean {
    return !!(
      data &&
      data.officeInfo &&
      data.importantLinks &&
      data.contactInfo &&
      data.officeHours
    );
  }

  /**
   * Get default footer links when API fails
   */
  private static getDefaultFooterLinks(): FooterLinks {
    return {
      quickLinks: [
        {
          id: 'home',
          linkTitle: { en: 'Home', ne: 'गृह' },
          linkUrl: '/',
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      governmentLinks: [
        {
          id: 'home-ministry',
          linkTitle: { en: 'Home Ministry', ne: 'गृह मन्त्रालय' },
          linkUrl: 'https://moha.gov.np',
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'finance-ministry',
          linkTitle: { en: 'Ministry of Finance', ne: 'अर्थ मन्त्रालय' },
          linkUrl: 'https://mof.gov.np',
          order: 2,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      socialMediaLinks: [
        {
          id: 'facebook',
          linkTitle: { en: 'Facebook', ne: 'फेसबुक' },
          linkUrl: 'https://facebook.com',
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      contactLinks: [
        {
          id: 'contact',
          linkTitle: { en: 'Contact Us', ne: 'सम्पर्क' },
          linkUrl: '/contact',
          order: 1,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    };
  }

  /**
   * Get default footer data when API fails
   */
  private static getDefaultFooterData(locale: 'en' | 'ne'): FooterData {
    return {
      officeInfo: {
        directorate: { en: 'Department of Information Technology', ne: 'सूचना प्रविधि विभाग' },
        officeName: { en: 'Office Name', ne: 'कार्यालयको नाम' },
        address: { en: 'Postal Complex, Babarmahal, Kathmandu', ne: 'हुलाक परिसर, बबरमहल, काठमाडौं' },
        leftLogo: '/icons/nepal-emblem.svg',
        rightLogo: '/icons/nepal-emblem.svg'
      },
      officeHours: this.getOfficeHours(locale),
      importantLinks: this.getDefaultFooterLinks(),
      contactInfo: {
        address: { en: 'Postal Complex, Babarmahal, Kathmandu', ne: 'हुलाक परिसर, बबरमहल, काठमाडौं' },
        emails: ['info@doit.gov.np', 'mailsupport@doit.gov.np'],
        phones: ['1-4112334', '1-4117940'],
        socialMedia: {
          facebook: 'https://facebook.com',
          twitter: 'https://twitter.com'
        }
      }
    };
  }
}
