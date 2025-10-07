import { z } from 'zod';
import { BaseRepository } from './base-repository';
import type { NewsArticle, Document, Service } from '@/domains/content-management/types';

const ContentEntitySchema = z.object({
  id: z.string(),
  title: z.record(z.string()),
  slug: z.string(),
  content: z.record(z.string()),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.string().datetime().optional().transform(date => date ? new Date(date) : undefined),
  createdAt: z.string().datetime().transform(date => new Date(date)),
  updatedAt: z.string().datetime().transform(date => new Date(date)),
  authorId: z.string(),
  categories: z.array(z.string()),
  featuredImage: z.string().optional(),
  metadata: z.record(z.unknown()),
});

const NewsArticleSchema = ContentEntitySchema.extend({
  type: z.literal('news'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  department: z.string(),
});

const DocumentSchema = ContentEntitySchema.extend({
  type: z.literal('document'),
  fileUrl: z.string(),
  fileType: z.string(),
  fileSize: z.number(),
  version: z.string(),
  approvalStatus: z.enum(['pending', 'approved', 'rejected']),
  approvedBy: z.string().optional(),
});

const ServiceSchema = ContentEntitySchema.extend({
  type: z.literal('service'),
  applicationForm: z.string().optional(),
  requirements: z.record(z.array(z.string())),
  processingTime: z.string(),
  fees: z.record(z.number()),
  deliveryMethod: z.enum(['online', 'offline', 'both']),
});

export class NewsRepository extends BaseRepository<NewsArticle> {
  protected entitySchema = NewsArticleSchema;
  protected endpoint = '/content/news';

  async findByPriority(priority: NewsArticle['priority']): Promise<NewsArticle[]> {
    return this.findMany({ priority });
  }

  async findByDepartment(department: string): Promise<NewsArticle[]> {
    return this.findMany({ department });
  }

  async findFeatured(limit: number = 5): Promise<NewsArticle[]> {
    return this.findMany({ featured: true, limit });
  }

  async findPublished(options?: { 
    limit?: number; 
    offset?: number; 
    department?: string;
  }): Promise<NewsArticle[]> {
    return this.findMany({ 
      status: 'published',
      ...options 
    });
  }
}

export class DocumentRepository extends BaseRepository<Document> {
  protected entitySchema = DocumentSchema;
  protected endpoint = '/content/documents';

  async findByApprovalStatus(status: Document['approvalStatus']): Promise<Document[]> {
    return this.findMany({ approvalStatus: status });
  }

  async findByFileType(fileType: string): Promise<Document[]> {
    return this.findMany({ fileType });
  }

  async findByVersion(version: string): Promise<Document[]> {
    return this.findMany({ version });
  }

  async findApproved(): Promise<Document[]> {
    return this.findMany({ approvalStatus: 'approved' });
  }

  async downloadDocument(id: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${this.endpoint}/${id}/download`);
    
    if (!response.ok) {
      throw new Error(`Failed to download document: ${response.statusText}`);
    }
    
    return response.blob();
  }
}

export class ServiceRepository extends BaseRepository<Service> {
  protected entitySchema = ServiceSchema;
  protected endpoint = '/content/services';

  async findByDeliveryMethod(method: Service['deliveryMethod']): Promise<Service[]> {
    return this.findMany({ deliveryMethod: method });
  }

  async findOnlineServices(): Promise<Service[]> {
    return this.findMany({ 
      deliveryMethod: ['online', 'both'] 
    });
  }

  async findByFeeRange(minFee: number, maxFee: number): Promise<Service[]> {
    return this.findMany({ 
      minFee, 
      maxFee 
    });
  }

  async findPopular(limit: number = 10): Promise<Service[]> {
    return this.findMany({ 
      popular: true, 
      limit 
    });
  }
}

export const newsRepository = new NewsRepository();
export const documentRepository = new DocumentRepository();
export const serviceRepository = new ServiceRepository();