import { TranslatableEntity } from '@/types/common';

// ========================================
// HOMEPAGE TYPES
// ========================================

export interface HomepageData {
  header: HeaderData;
  hero: HeroData;
  services: ServiceData[];
  highlights: HighlightData[];
  news: NewsData[];
  contact: ContactData;
  footer: FooterData;
}

export interface HeaderData {
  logo: {
    url: string;
    alt: string;
  };
  officeName: TranslatableEntity;
  officeDescription: TranslatableEntity;
  navigation: NavigationItem[];
  searchEnabled: boolean;
  languageSwitcherEnabled: boolean;
  socialMedia: SocialMediaData;
}

export interface NavigationItem {
  id: string;
  title: TranslatableEntity;
  url?: string;
  target?: '_self' | '_blank';
  order: number;
  parentId?: string;
  isActive: boolean;
  children?: NavigationItem[];
}

export interface SocialMediaData {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  email?: string;
}

export interface HeroData {
  title: TranslatableEntity;
  subtitle: TranslatableEntity;
  backgroundImage?: string;
  statistics: HeroStatistic[];
  fiscalYearInfo: TranslatableEntity;
  callToAction?: {
    text: TranslatableEntity;
    url: string;
  };
}

export interface HeroStatistic {
  id: string;
  icon: string;
  label: TranslatableEntity;
  value: number;
  color: string;
}

export interface ServiceData {
  id: string;
  title: TranslatableEntity;
  description?: TranslatableEntity;
  icon: string;
  url?: string;
  order: number;
  isActive: boolean;
}

export interface HighlightData {
  id: string;
  title: TranslatableEntity;
  date: string;
  url?: string;
  isActive: boolean;
  order: number;
}

export interface NewsData {
  id: string;
  title: TranslatableEntity;
  excerpt?: TranslatableEntity;
  date: string;
  imageUrl?: string;
  downloadUrl?: string;
  isActive: boolean;
  order: number;
}

export interface ContactData {
  directorGeneral: ContactPerson;
  informationOfficer: ContactPerson;
}

export interface ContactPerson {
  id: string;
  name: TranslatableEntity;
  title: TranslatableEntity;
  phone: string;
  email: string;
  imageUrl?: string;
}

export interface FooterData {
  officeInfo: {
    name: TranslatableEntity;
    address: TranslatableEntity;
    officeHours: OfficeHours;
  };
  importantLinks: ImportantLink[];
  contactInfo: {
    address: TranslatableEntity;
    email: string;
    phone: string;
  };
}

export interface OfficeHours {
  winter: {
    sundayToThursday: string;
    friday: string;
    period: TranslatableEntity;
  };
  summer: {
    sundayToThursday: string;
    friday: string;
    period: TranslatableEntity;
  };
}

export interface ImportantLink {
  id: string;
  title: TranslatableEntity;
  url: string;
  target?: '_self' | '_blank';
  order: number;
  isActive: boolean;
}

// ========================================
// API RESPONSE TYPES
// ========================================

export interface HomepageApiResponse {
  success: boolean;
  data: HomepageData;
  meta?: {
    timestamp: string;
    version: string;
  };
}

// ========================================
// QUERY TYPES
// ========================================

export interface HomepageQuery {
  lang?: string;
  includeInactive?: boolean;
}

// ========================================
// FALLBACK DATA TYPES
// ========================================

export interface FallbackData {
  header: HeaderData;
  hero: HeroData;
  services: ServiceData[];
  highlights: HighlightData[];
  news: NewsData[];
  contact: ContactData;
  footer: FooterData;
}
