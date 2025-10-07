import { z } from "zod"

// Notice Schema (matches backend API response)
export const NoticeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  title_en: z.string().optional(),
  summary: z.string().optional(),
  summary_en: z.string().optional(),
  content: z.string().optional(),
  content_en: z.string().optional(),
  lang: z.enum(["ne", "en"]).default("ne"),
  referenceNo: z.string().optional(),
  type: z.enum(["notice", "circular", "tender", "vacancy", "result"]).default("notice"),
  priority: z.enum(["normal", "high", "urgent"]).default("normal"),
  officeId: z.string(),
  adDate: z.string(), // ISO date string
  bsDate: z.string(), // BS date in format: 2082-04-01
  expiryDate: z.string().optional(), // ISO date string
  expiryDateBS: z.string().optional(), // BS date
  publishedAt: z.string(),
  updatedAt: z.string(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  attachments: z.array(z.any()).default([]), // AttachmentSchema from shared
  permalink: z.string().url(),
  isActive: z.boolean().default(true),
  viewCount: z.number().int().nonnegative().default(0),
  downloadCount: z.number().int().nonnegative().default(0),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }).optional(),
}).transform((data) => {
  console.log('🔍 NoticeSchema: Validating notice data:', data);
  return data;
});

// Notice Query Schema
export const NoticeQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  category: z.string().optional(),
  type: z.string().optional(),
  priority: z.string().optional(),
  search: z.string().optional()
})

// Notice API Response Schema
export const NoticeResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(NoticeSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean()
  }),
  message: z.string().optional(),
  error: z.string().optional()
})

// Type exports
export type Notice = z.infer<typeof NoticeSchema>
export type NoticeQuery = z.infer<typeof NoticeQuerySchema>
export type NoticeResponse = z.infer<typeof NoticeResponseSchema>
