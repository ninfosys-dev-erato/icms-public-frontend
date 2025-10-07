import { z } from "zod";
import { ContentAttachmentSchema, MediaSchema } from "./shared";

export const Service = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  title_en: z.string().optional(),
  description: z.string(),
  description_en: z.string().optional(),
  summary: z.string().optional(),
  summary_en: z.string().optional(),
  lang: z.enum(["ne", "en"]).default("ne"),
  category: z.string(),
  subcategory: z.string().optional(),
  officeId: z.string(),
  serviceCode: z.string().optional(),
  isOnline: z.boolean().default(false),
  isFree: z.boolean().default(true),
  fee: z.number().nonnegative().optional(),
  feeCurrency: z.string().default("NPR"),
  processingTime: z.string().optional(), // e.g., "3-5 working days"
  processingTimeEn: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  requirements_en: z.array(z.string()).default([]),
  process: z.array(z.string()).default([]),
  process_en: z.array(z.string()).default([]),
  documents: z.array(z.string()).default([]),
  documents_en: z.array(z.string()).default([]),
  contact: z.object({
    person: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    counter: z.string().optional(),
  }).optional(),
  onlineUrl: z.string().url().optional(),
  downloadUrl: z.string().url().optional(),
  attachments: z.array(ContentAttachmentSchema).default([]),
  featuredImage: MediaSchema.optional(),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).default(0),
  viewCount: z.number().int().nonnegative().default(0),
  usageCount: z.number().int().nonnegative().default(0),
  rating: z.number().min(0).max(5).optional(),
  ratingCount: z.number().int().nonnegative().default(0),
  publishedAt: z.string(),
  updatedAt: z.string(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }).optional(),
});

export const ServiceFilter = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  office: z.string().optional(),
  isOnline: z.boolean().optional(),
  isFree: z.boolean().optional(),
  feeMin: z.number().nonnegative().optional(),
  feeMax: z.number().nonnegative().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["title", "priority", "viewCount", "usageCount", "rating", "updatedAt"]).default("priority"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const ServiceListResponse = z.object({
  items: z.array(Service),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const ServiceCategory = z.object({
  id: z.string(),
  name: z.string(),
  name_en: z.string().optional(),
  description: z.string().optional(),
  description_en: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
  serviceCount: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).default(0),
});

export const ServiceStats = z.object({
  totalServices: z.number().int().nonnegative(),
  onlineServices: z.number().int().nonnegative(),
  freeServices: z.number().int().nonnegative(),
  servicesByCategory: z.record(z.string(), z.number().int().nonnegative()),
  servicesByOffice: z.record(z.string(), z.number().int().nonnegative()),
  totalViews: z.number().int().nonnegative(),
  totalUsage: z.number().int().nonnegative(),
  averageRating: z.number().min(0).max(5).optional(),
});

export type Service = z.infer<typeof Service>;
export type ServiceFilter = z.infer<typeof ServiceFilter>;
export type ServiceListResponse = z.infer<typeof ServiceListResponse>;
export type ServiceCategory = z.infer<typeof ServiceCategory>;
export type ServiceStats = z.infer<typeof ServiceStats>;