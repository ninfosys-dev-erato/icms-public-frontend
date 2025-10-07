import { z } from "zod";
import { ContentAttachmentSchema, MediaSchema } from "./shared";

export const Document = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  title_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  content: z.string().optional(),
  content_en: z.string().optional(),
  lang: z.enum(["ne", "en"]).default("ne"),
  type: z.enum(["act", "rule", "regulation", "policy", "guideline", "form", "manual", "report"]),
  category: z.string(),
  subcategory: z.string().optional(),
  officeId: z.string(),
  documentNumber: z.string().optional(),
  version: z.string().default("1.0"),
  effectiveDate: z.string().optional(), // ISO date
  effectiveDateBS: z.string().optional(), // BS date
  expiryDate: z.string().optional(), // ISO date
  expiryDateBS: z.string().optional(), // BS date
  approvalDate: z.string().optional(), // ISO date
  approvalDateBS: z.string().optional(), // BS date
  approvedBy: z.string().optional(),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  language: z.enum(["ne", "en", "both"]).default("ne"),
  format: z.enum(["pdf", "doc", "docx", "html", "txt"]).optional(),
  fileSize: z.number().int().nonnegative().optional(),
  downloadUrl: z.string().url().optional(),
  viewUrl: z.string().url().optional(),
  attachments: z.array(ContentAttachmentSchema).default([]),
  featuredImage: MediaSchema.optional(),
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  keywords_en: z.array(z.string()).default([]),
  relatedDocuments: z.array(z.string()).default([]),
  supersedes: z.string().optional(), // ID of document this replaces
  supersededBy: z.string().optional(), // ID of document that replaces this
  viewCount: z.number().int().nonnegative().default(0),
  downloadCount: z.number().int().nonnegative().default(0),
  publishedAt: z.string(),
  updatedAt: z.string(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }).optional(),
});

export const DocumentFilter = z.object({
  q: z.string().optional(),
  type: z.enum(["act", "rule", "regulation", "policy", "guideline", "form", "manual", "report"]).optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  office: z.string().optional(),
  language: z.enum(["ne", "en", "both"]).optional(),
  format: z.enum(["pdf", "doc", "docx", "html", "txt"]).optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  dateFrom: z.string().optional(), // ISO date
  dateTo: z.string().optional(), // ISO date
  dateFromBS: z.string().optional(), // BS date
  dateToBS: z.string().optional(), // BS date
  yearBS: z.string().optional(),
  hasAttachment: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["title", "publishedAt", "updatedAt", "viewCount", "downloadCount", "effectiveDate"]).default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const DocumentListResponse = z.object({
  items: z.array(Document),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const DocumentCategory = z.object({
  id: z.string(),
  name: z.string(),
  name_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  documentCount: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).default(0),
});

export const DocumentStats = z.object({
  totalDocuments: z.number().int().nonnegative(),
  activeDocuments: z.number().int().nonnegative(),
  publicDocuments: z.number().int().nonnegative(),
  documentsByType: z.record(z.string(), z.number().int().nonnegative()),
  documentsByCategory: z.record(z.string(), z.number().int().nonnegative()),
  documentsByLanguage: z.record(z.string(), z.number().int().nonnegative()),
  totalViews: z.number().int().nonnegative(),
  totalDownloads: z.number().int().nonnegative(),
});

export type Document = z.infer<typeof Document>;
export type DocumentFilter = z.infer<typeof DocumentFilter>;
export type DocumentListResponse = z.infer<typeof DocumentListResponse>;
export type DocumentCategory = z.infer<typeof DocumentCategory>;
export type DocumentStats = z.infer<typeof DocumentStats>;