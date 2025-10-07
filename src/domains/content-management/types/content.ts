import { z } from "zod"

// Translatable Entity Schema (matches backend TranslatableEntity)
export const TranslatableEntitySchema = z.object({
  en: z.string(),
  ne: z.string()
});

// Content Status Schema (matches backend ContentStatus)
export const ContentStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

// Category Schema (matches backend CategoryResponseDto)
export const CategorySchema: z.ZodType<any> = z.object({
  id: z.string(),
  name: TranslatableEntitySchema,
  description: TranslatableEntitySchema.optional(),
  slug: z.string(),
  parentId: z.string().optional(),
  order: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  children: z.array(z.lazy(() => CategorySchema)).optional(),
  contentCount: z.number()
});

// Content Attachment Schema (matches backend ContentAttachmentResponseDto)
export const ContentAttachmentSchema = z.object({
  id: z.string(),
  contentId: z.string(),
  fileName: z.string(),
  filePath: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
  order: z.number(),
  createdAt: z.string().datetime(),
  downloadUrl: z.string(),
  presignedUrl: z.string().optional().nullable()
});

// Base Query Schema (matches backend BaseQuery)
export const BaseQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  isActive: z.boolean().optional(),
  lang: z.enum(['ne', 'en']).optional()
});

// Pagination Schema (matches backend pagination structure)
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
});

// Content Response Schema (matches backend ContentResponseDto)
export const ContentResponseSchema = z.object({
  id: z.string(),
  title: TranslatableEntitySchema,
  content: TranslatableEntitySchema,
  excerpt: TranslatableEntitySchema.optional(),
  slug: z.string(),
  categoryId: z.string(),
  status: ContentStatusSchema,
  publishedAt: z.string().datetime().optional(),
  featured: z.boolean(),
  order: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  category: CategorySchema,
  attachments: z.array(ContentAttachmentSchema),
  createdBy: z.any().optional(),
  updatedBy: z.any().optional()
});

// Content Query Schema (matches backend ContentQueryDto)
export const ContentQuerySchema = BaseQuerySchema.extend({
  category: z.string().optional(),
  status: ContentStatusSchema.optional(),
  featured: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
});

// FAQ Response Schema (matches backend FAQResponseDto)
export const FAQResponseSchema = z.object({
  id: z.string(),
  question: TranslatableEntitySchema,
  answer: TranslatableEntitySchema,
  order: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// FAQ Query Schema (matches backend FAQQueryDto)
export const FAQQuerySchema = z.object({
  isActive: z.boolean().optional(),
  lang: z.string().optional(),
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(10)
});

// API Response Schemas
export const ContentListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ContentResponseSchema),
  pagination: PaginationSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

export const ContentSingleResponseSchema = z.object({
  success: z.boolean(),
  data: ContentResponseSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

export const CategoryTreeResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CategorySchema),
  message: z.string().optional(),
  error: z.string().optional()
});

export const FAQListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(FAQResponseSchema),
  pagination: PaginationSchema.optional(),
  message: z.string().optional(),
  error: z.string().optional()
});

// Type exports
export type ContentResponse = z.infer<typeof ContentResponseSchema>;
export type ContentQuery = z.infer<typeof ContentQuerySchema>;
export type FAQResponse = z.infer<typeof FAQResponseSchema>;
export type FAQQuery = z.infer<typeof FAQQuerySchema>;
export type ContentListResponse = z.infer<typeof ContentListResponseSchema>;
export type ContentSingleResponse = z.infer<typeof ContentSingleResponseSchema>;
export type CategoryTreeResponse = z.infer<typeof CategoryTreeResponseSchema>;
export type FAQListResponse = z.infer<typeof FAQListResponseSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type ContentAttachment = z.infer<typeof ContentAttachmentSchema>;
export type TranslatableEntity = z.infer<typeof TranslatableEntitySchema>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;

// Legacy aliases for backward compatibility
export type Content = ContentResponse;
export type FAQ = FAQResponse;
export type ContentFilter = ContentQuery;