import { z } from "zod";
import { Office, Person, LocalLevel } from "./shared";

export const DirectoryFilter = z.object({
  q: z.string().optional(),
  officeType: z.enum(["federal", "provincial", "local"]).optional(),
  officeLevel: z.number().int().min(1).max(3).optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  localLevel: z.string().optional(),
  position: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["name", "position", "office", "createdAt"]).default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const DirectoryListResponse = z.object({
  items: z.array(z.union([Office, Person, LocalLevel])),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const OfficeHierarchy = z.object({
  office: Office,
  children: z.array(z.lazy(() => OfficeHierarchy)).default([]),
  people: z.array(Person).default([]),
});

export const DirectoryStats = z.object({
  totalOffices: z.number().int().nonnegative(),
  totalPeople: z.number().int().nonnegative(),
  totalLocalLevels: z.number().int().nonnegative(),
  officesByType: z.record(z.string(), z.number().int().nonnegative()),
  officesByLevel: z.record(z.string(), z.number().int().nonnegative()),
  peopleByPosition: z.record(z.string(), z.number().int().nonnegative()),
  activeCount: z.number().int().nonnegative(),
  inactiveCount: z.number().int().nonnegative(),
});

export const Contact = z.object({
  id: z.string(),
  name: z.string(),
  name_en: z.string().optional(),
  position: z.string(),
  position_en: z.string().optional(),
  department: z.string().optional(),
  department_en: z.string().optional(),
  officeId: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  extension: z.string().optional(),
  fax: z.string().optional(),
  photo: z.string().url().optional(),
  bio: z.string().optional(),
  bio_en: z.string().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
  }).optional(),
  workingHours: z.object({
    start: z.string().optional(), // HH:mm format
    end: z.string().optional(),
    days: z.array(z.enum(["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"])).default([]),
  }).optional(),
  isPublic: z.boolean().default(true),
  isActive: z.boolean().default(true),
  priority: z.number().int().min(0).default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type DirectoryFilter = z.infer<typeof DirectoryFilter>;
export type DirectoryListResponse = z.infer<typeof DirectoryListResponse>;
export type OfficeHierarchy = z.infer<typeof OfficeHierarchy>;
export type DirectoryStats = z.infer<typeof DirectoryStats>;
export type Contact = z.infer<typeof Contact>;