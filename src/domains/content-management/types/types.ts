export interface ContentEntity {
  id: string;
  title: Record<string, string>;
  slug: string;
  content: Record<string, string>;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categories: string[];
  featuredImage?: string;
  metadata: Record<string, unknown>;
}

export interface NewsArticle extends ContentEntity {
  type: 'news';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
}

export interface Document extends ContentEntity {
  type: 'document';
  fileUrl: string;
  fileType: string;
  fileSize: number;
  version: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

export interface Service extends ContentEntity {
  type: 'service';
  applicationForm?: string;
  requirements: Record<string, string[]>;
  processingTime: string;
  fees: Record<string, number>;
  deliveryMethod: 'online' | 'offline' | 'both';
}