/**
 * Common types used across the application
 */

export interface TranslatableEntity {
  en: string;  // English text
  ne: string;  // Nepali text (नेपाली पाठ)
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
  pagination?: PaginationInfo;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ApiMeta {
  timestamp: string;
  version: string;
  requestId?: string;
  processingTime?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
