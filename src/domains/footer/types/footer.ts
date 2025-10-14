// Footer Types based on backend DTOs and UI requirements

export interface TranslatableEntity {
  en: string;
  ne: string;
}

export interface ImportantLink {
  id: string;
  linkTitle: TranslatableEntity;
  linkUrl: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FooterLinks {
  quickLinks: ImportantLink[];
  governmentLinks: ImportantLink[];
  socialMediaLinks: ImportantLink[];
  contactLinks: ImportantLink[];
}

export interface OfficeSettings {
  id: string;
  directorate: TranslatableEntity;
  officeName: TranslatableEntity;
  officeAddress: TranslatableEntity;
  backgroundPhoto?: string;
  email: string;
  phoneNumber: TranslatableEntity;
  xLink?: string;
  mapIframe?: string;
  website?: string;
  youtube?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OfficeDescription {
  id: string;
  officeDescriptionType: string;
  content: TranslatableEntity;
  createdAt: Date;
  updatedAt: Date;
}

export interface HeaderConfig {
  id: string;
  name: TranslatableEntity;
  logo?: {
    leftLogo?: {
      media?: {
        presignedUrl?: string;
        url?: string;
      };
      altText?: TranslatableEntity;
    };
    rightLogo?: {
      media?: {
        presignedUrl?: string;
        url?: string;
      };
      altText?: TranslatableEntity;
    };
  };
}

export interface FooterData {
  officeInfo: {
    directorate?: TranslatableEntity;
    officeName?: TranslatableEntity;
    address?: TranslatableEntity;
    mapIframe?: string;
    leftLogo?: string;
    rightLogo?: string;
  };
  officeHours: {
    winter: {
      sundayToThursday: string;
      friday: string;
    };
    summer: {
      sundayToThursday: string;
      friday: string;
    };
  };
  importantLinks: FooterLinks;
  contactInfo: {
    address: TranslatableEntity;
    emails: string[];
    phones: string[];
    socialMedia: {
      facebook?: string;
      twitter?: string;
    };
  };
}

export interface FooterProps {
  locale: 'en' | 'ne';
  className?: string;
}

export interface FooterSectionProps {
  locale: 'en' | 'ne';
  data: FooterData;
}

export interface FooterTopProps extends FooterSectionProps {}
export interface FooterMainProps extends FooterSectionProps {}
export interface FooterBottomProps extends FooterSectionProps {}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Query types
export interface FooterQuery {
  lang?: 'en' | 'ne';
  isActive?: boolean;
}
