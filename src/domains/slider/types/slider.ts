// Base types for internationalization
export interface TranslatableEntity {
  ne: string;
  en: string;
}

// Media response type for sliders
export interface SliderMedia {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  fileId: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  folder: string;
  category: string;
  altText: string;
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  isActive: boolean;
  metadata: {
    depth: string;
    space: string;
    width: number;
    format: string;
    height: number;
    density: number;
    channels: number;
    hasAlpha: boolean;
    hasProfile: boolean;
  };
  createdAt: string;
  updatedAt: string;
  presignedUrl: string;
}

// Backend DTOs
export interface SliderQuery {
  page?: number;
  limit?: number;
  search?: string;
  position?: number;
  isActive?: boolean;
}

// Raw API response from backend
export interface SliderApiResponse {
  id: string;
  title: TranslatableEntity;
  position: number;
  displayTime: number;
  isActive: boolean;
  media: SliderMedia;
  clickCount: number;
  viewCount: number;
  clickThroughRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface SliderResponse {
  id: string;
  title: TranslatableEntity;
  position: number;
  displayTime: number; // Milliseconds
  isActive: boolean;
  media: SliderMedia;
  clickCount: number;
  viewCount: number;
  clickThroughRate: number;
  createdAt: string;
  updatedAt: string;
}

// Frontend-specific types
export interface SliderData {
  sliders: SliderResponse[];
  currentIndex: number;
  isPlaying: boolean;
  isTransitioning: boolean;
}

// Slider state types
export interface SliderState {
  data: SliderData | null;
  isLoading: boolean;
  error: string | null;
  locale: 'ne' | 'en';
}

// Component props types
export interface SliderProps {
  locale: 'ne' | 'en';
  className?: string;
  autoPlay?: boolean;
  showNavigation?: boolean;
  showIndicators?: boolean;
  showTitle?: boolean;
  height?: string;
  width?: string;
}

export interface SliderItemProps {
  slider: SliderResponse;
  locale: 'ne' | 'en';
  isActive: boolean;
  isTransitioning: boolean;
  onClick?: () => void;
}

export interface SliderNavigationProps {
  totalSlides: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
  className?: string;
}

export interface SliderIndicatorsProps {
  totalSlides: number;
  currentIndex: number;
  onNavigate: (index: number) => void;
  className?: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error types
export interface SliderError {
  code: string;
  message: string;
  details?: any;
}

// Analytics tracking
export interface SliderAnalytics {
  sliderId: string;
  action: 'view' | 'click';
  timestamp: Date;
}
