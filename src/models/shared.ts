import { z } from "zod";

// Translatable Entity Schema (used throughout backend)
export const TranslatableEntitySchema = z.object({
  ne: z.string(),
  en: z.string()
});

// Common Enums
export const ContentStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
export const DocumentTypeSchema = z.enum(['PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT', 'PPTX', 'TXT', 'RTF', 'CSV', 'ZIP', 'RAR', 'OTHER']);
export const DocumentCategorySchema = z.enum(['OFFICIAL', 'REPORT', 'FORM', 'POLICY', 'PROCEDURE', 'GUIDELINE', 'NOTICE', 'CIRCULAR', 'OTHER']);
export const MediaCategorySchema = z.enum(['image', 'document', 'video', 'audio', 'other']);
export const MediaFolderSchema = z.enum(['sliders', 'office-settings', 'users', 'content', 'documents', 'reports', 'videos', 'audio', 'general']);

// API Response Wrapper Schema
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
    error: z.string().optional()
  });

// Pagination Schema (backend format)
export const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
});

export const PaginatedApiResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    message: z.string().optional(),
    error: z.string().optional(),
    pagination: PaginationSchema
  });

// Media Schema (backend format)
export const MediaSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  originalName: z.string(),
  url: z.string(),
  presignedUrl: z.string().optional(),
  fileId: z.string(),
  size: z.number(),
  contentType: z.string(),
  uploadedBy: z.string(),
  folder: z.string(),
  category: MediaCategorySchema,
  altText: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean(),
  isActive: z.boolean(),
  metadata: z.any().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Content Attachment Schema (backend format)
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

// Attachment Schema (for notices and other content types)
export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  uploadedAt: z.string().datetime().optional(),
  downloadCount: z.number().int().nonnegative().default(0)
});

// Category Schema (backend format)
export const CategorySchema = z.object({
  id: z.string(),
  name: TranslatableEntitySchema,
  slug: z.string(),
  description: TranslatableEntitySchema.optional(),
  parentId: z.string().optional(),
  level: z.number(),
  order: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  children: z.array(z.lazy(() => CategorySchema)).optional()
});

// Typography Settings Schema
export const TypographySettingsSchema = z.object({
  fontFamily: z.string(),
  fontSize: z.number(),
  fontWeight: z.union([
    z.enum(['normal', 'bold', 'lighter', 'bolder']),
    z.number()
  ]),
  color: z.string(),
  lineHeight: z.number(),
  letterSpacing: z.number()
});

// Header Alignment Schema
export const HeaderAlignmentSchema = z.enum(['LEFT', 'CENTER', 'RIGHT', 'JUSTIFY']);

// Office Description Type Schema
export const OfficeDescriptionTypeSchema = z.enum([
  'INTRODUCTION',
  'OBJECTIVE', 
  'WORK_DETAILS',
  'ORGANIZATIONAL_STRUCTURE',
  'DIGITAL_CHARTER',
  'EMPLOYEE_SANCTIONS'
]);

// Query Base Schema
export const BaseQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  isActive: z.boolean().optional(),
  lang: z.enum(['ne', 'en']).optional()
});

// Type exports
export type TranslatableEntity = z.infer<typeof TranslatableEntitySchema>;
export type ContentStatus = z.infer<typeof ContentStatusSchema>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type DocumentCategory = z.infer<typeof DocumentCategorySchema>;
export type MediaCategory = z.infer<typeof MediaCategorySchema>;
export type MediaFolder = z.infer<typeof MediaFolderSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type ContentAttachment = z.infer<typeof ContentAttachmentSchema>;
export type Attachment = z.infer<typeof AttachmentSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type TypographySettings = z.infer<typeof TypographySettingsSchema>;
export type HeaderAlignment = z.infer<typeof HeaderAlignmentSchema>;
export type OfficeDescriptionType = z.infer<typeof OfficeDescriptionTypeSchema>;
export type BaseQuery = z.infer<typeof BaseQuerySchema>;

// API Response Types
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export type PaginatedApiResponse<T> = {
  success: boolean;
  data: T[];
  message?: string;
  error?: string;
  pagination: Pagination;
}