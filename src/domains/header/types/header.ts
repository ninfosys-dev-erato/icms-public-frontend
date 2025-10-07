// ========================================
// COMMON TYPES
// ========================================

export interface TranslatableEntity {
  ne: string;
  en: string;
}

// ========================================
// BACKEND RESPONSE TYPES
// ========================================

export interface MediaResponse {
  id: string;
  url: string;
  presignedUrl?: string;
  fileName: string;
  originalName?: string;
  mimeType: string;
  size: number;
  altText?: TranslatableEntity;
  createdAt: string;
  updatedAt: string;
}

export interface LogoConfiguration {
  leftLogo?: {
    mediaId: string;
    media?: MediaResponse;
    altText?: TranslatableEntity;
  };
  rightLogo?: {
    mediaId: string;
    media?: MediaResponse;
    altText?: TranslatableEntity;
  };
}

export interface TypographySettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing: number;
  lineHeight: number;
}

export interface LayoutConfiguration {
  headerHeight: number;
  backgroundColor: string;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface HeaderConfigResponse {
  id: string;
  name: TranslatableEntity;
  description?: TranslatableEntity;
  isActive: boolean;
  isPublished: boolean;
  order: number;
  logoConfiguration?: LogoConfiguration;
  typographySettings?: TypographySettings;
  layoutConfiguration?: LayoutConfiguration;
  customCSS?: string;
  createdAt: string;
  updatedAt: string;
  css?: string; // Generated CSS
}

// ========================================
// OFFICE DESCRIPTION TYPES
// ========================================

export enum OfficeDescriptionType {
  INTRODUCTION = 'INTRODUCTION',
  OBJECTIVE = 'OBJECTIVE',
  WORK_DETAILS = 'WORK_DETAILS',
  ORGANIZATIONAL_STRUCTURE = 'ORGANIZATIONAL_STRUCTURE',
  DIGITAL_CHARTER = 'DIGITAL_CHARTER',
  EMPLOYEE_SANCTIONS = 'EMPLOYEE_SANCTIONS',
}

export interface OfficeDescriptionResponse {
  id: string;
  officeDescriptionType: OfficeDescriptionType;
  content: TranslatableEntity;
  createdAt: string;
  updatedAt: string;
}

// ========================================
// COMBINED HEADER DATA (Frontend)
// ========================================

export interface HeaderData {
  config?: HeaderConfigResponse;
  officeInfo?: {
    directorate: TranslatableEntity;
    officeName: TranslatableEntity;
    introduction?: OfficeDescriptionResponse;
  };
  navigation: NavigationItem[];
  socialMedia: SocialMediaLink[];
  contactInfo?: ContactInfo;
}

export interface NavigationItem {
  id: string;
  title: TranslatableEntity;
  href: string;
  submenu?: NavigationItem[];
  isActive?: boolean;
  order: number;
  external?: boolean;
  description?: TranslatableEntity;
}

export interface SocialMediaLink {
  id: string;
  platform: 'facebook' | 'twitter' | 'email' | 'youtube' | 'linkedin' | 'instagram';
  url: string;
  title: TranslatableEntity;
  order: number;
  isActive: boolean;
}

export interface ContactInfo {
  address: TranslatableEntity;
  phone?: string;
  email?: string;
  website?: string;
  district?: TranslatableEntity;
  province?: TranslatableEntity;
  postalCode?: string;
  fax?: string;
  leftLogo?: {
    url?: string;
    presignedUrl?: string;
    altText?: TranslatableEntity;
  };
  rightLogo?: {
    url?: string;
    presignedUrl?: string;
    altText?: TranslatableEntity;
  };
}

// ========================================
// QUERY TYPES
// ========================================

export interface HeaderConfigQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isPublished?: boolean;
}

export interface OfficeDescriptionQuery {
  type?: OfficeDescriptionType;
  lang?: string;
}

// ========================================
// UI STATE TYPES
// ========================================

export interface HeaderState {
  data: HeaderData | null;
  isLoading: boolean;
  error: string | null;
}

// ========================================
// COMPONENT PROP TYPES
// ========================================

export interface HeaderProps {
  locale: 'ne' | 'en';
  className?: string;
}

export interface HeaderTopProps {
  data: HeaderData;
  locale: 'ne' | 'en';
}

export interface HeaderMainProps {
  data: HeaderData;
  locale: 'ne' | 'en';
}

// ========================================
// API RESPONSE WRAPPER
// ========================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ========================================
// ERROR TYPES
// ========================================

export interface HeaderError {
  code: string;
  message: string;
  details?: any;
}