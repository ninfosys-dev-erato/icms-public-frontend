import { z } from "zod";
import { Attachment } from "../../../models/shared";

export const Notice = z.object({
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
  attachments: z.array(Attachment).default([]),
  permalink: z.string().url(),
  isActive: z.boolean().default(true),
  viewCount: z.number().int().nonnegative().default(0),
  downloadCount: z.number().int().nonnegative().default(0),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).default([]),
  }).optional(),
});

export const NoticeFilter = z.object({
  q: z.string().optional(),
  type: z.enum(["notice", "circular", "tender", "vacancy", "result"]).optional(),
  priority: z.enum(["normal", "high", "urgent"]).optional(),
  office: z.string().optional(),
  category: z.string().optional(),
  yearBS: z.string().optional(),
  monthBS: z.string().optional(),
  dateFrom: z.string().optional(), // ISO date
  dateTo: z.string().optional(), // ISO date
  dateFromBS: z.string().optional(), // BS date
  dateToBS: z.string().optional(), // BS date
  hasAttachment: z.boolean().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["publishedAt", "title", "viewCount", "downloadCount"]).default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const NoticeListResponse = z.object({
  items: z.array(Notice),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const NoticeStats = z.object({
  totalNotices: z.number().int().nonnegative(),
  activeNotices: z.number().int().nonnegative(),
  expiredNotices: z.number().int().nonnegative(),
  noticesByType: z.record(z.string(), z.number().int().nonnegative()),
  noticesByOffice: z.record(z.string(), z.number().int().nonnegative()),
  recentViews: z.number().int().nonnegative(),
  recentDownloads: z.number().int().nonnegative(),
});

export type Notice = z.infer<typeof Notice>;
export type NoticeFilter = z.infer<typeof NoticeFilter>;
export type NoticeListResponse = z.infer<typeof NoticeListResponse>;
export type NoticeStats = z.infer<typeof NoticeStats>;