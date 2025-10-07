export interface NewsItem {
  id: string;
  title: {
    en: string;
    ne: string;
  };
  content: {
    en: string;
    ne: string;
  };
  excerpt: {
    en: string;
    ne: string;
  };
  slug: string;
  categoryId: string;
  status: string;
  publishedAt: string | null;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: {
      en: string;
      ne: string;
    };
    description: string | null;
    slug: string;
    parentId: string | null;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    children: any[];
    contentCount: number;
  };
  attachments: any[];
  createdBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  updatedBy: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta: {
    timestamp: string;
    version: string;
  };
}