export interface TranslatableEntity {
  ne: string;
  en: string;
}

export interface MediaResponse {
  id: string;
  url: string;
  altText: TranslatableEntity;
  mimeType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface HeaderConfigQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isPublished?: boolean;
}

export interface HeaderConfigResponse {
  id: string;
  title: TranslatableEntity;
  description?: TranslatableEntity;
  logo?: MediaResponse;
  isActive: boolean;
  isPublished: boolean;
  settings: {
    showSearch: boolean;
    showLanguageSwitcher: boolean;
    showUserMenu: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Extended interface for our specific header implementation
export interface HeaderData {
  config: HeaderConfigResponse;
  notices: HeaderNotice[];
  navigation: NavigationItem[];
  socialMedia: SocialMediaLink[];
  contactInfo: ContactInfo;
}

export interface HeaderNotice {
  id: string;
  title: TranslatableEntity;
  content: TranslatableEntity;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
}

export interface NavigationItem {
  id: string;
  title: TranslatableEntity;
  href: string;
  submenu?: NavigationItem[];
  isActive?: boolean;
  order: number;
}

export interface SocialMediaLink {
  id: string;
  platform: 'facebook' | 'twitter' | 'email' | 'youtube' | 'linkedin';
  url: string;
  icon: string;
  title: TranslatableEntity;
}

export interface ContactInfo {
  address: TranslatableEntity;
  phone?: string;
  email?: string;
  website?: string;
}
