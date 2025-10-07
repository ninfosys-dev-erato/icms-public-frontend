import { z } from "zod"
import { 
  TranslatableEntitySchema,
  OfficeDescriptionTypeSchema,
  BaseQuerySchema,
  PaginationSchema
} from "./shared"

// Office Settings Response Schema (matches backend OfficeSettingsResponseDto)
export const OfficeSettingsResponseSchema = z.object({
  id: z.string(),
  directorate: TranslatableEntitySchema,
  officeName: TranslatableEntitySchema,
  officeAddress: TranslatableEntitySchema,
  backgroundPhoto: z.string().optional(),
  email: z.string(),
  phoneNumber: TranslatableEntitySchema,
  xLink: z.string().optional(),
  mapIframe: z.string().optional(),
  website: z.string().optional(),
  youtube: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Office Description Response Schema (matches backend OfficeDescriptionResponseDto)
export const OfficeDescriptionResponseSchema = z.object({
  id: z.string(),
  officeDescriptionType: OfficeDescriptionTypeSchema,
  content: TranslatableEntitySchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Department Response Schema (from HR module)
export const DepartmentResponseSchema = z.object({
  id: z.string(),
  name: TranslatableEntitySchema,
  description: TranslatableEntitySchema.optional(),
  parentId: z.string().optional(),
  level: z.number(),
  order: z.number().default(0),
  headId: z.string().optional(),
  isActive: z.boolean().default(true),
  children: z.array(z.lazy(() => DepartmentResponseSchema)).optional(),
  employeeCount: z.number().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Employee Response Schema (from HR module)
export const EmployeeResponseSchema = z.object({
  id: z.string(),
  name: TranslatableEntitySchema,
  position: TranslatableEntitySchema,
  departmentId: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  extension: z.string().optional(),
  photo: z.string().optional(), // URL to photo
  bio: TranslatableEntitySchema.optional(),
  qualifications: z.array(z.string()).default([]),
  workingHours: z.string().optional(),
  isActive: z.boolean().default(true),
  joinDate: z.string().datetime().optional(),
  order: z.number().default(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Department Query Schema
export const DepartmentQuerySchema = BaseQuerySchema.extend({
  parentId: z.string().optional(),
  includeChildren: z.boolean().default(false),
  level: z.number().optional()
});

// Employee Query Schema
export const EmployeeQuerySchema = BaseQuerySchema.extend({
  departmentId: z.string().optional(),
  position: z.string().optional(),
  joinDateFrom: z.string().datetime().optional(),
  joinDateTo: z.string().datetime().optional()
});

// API Response Schemas
export const OfficeSettingsApiResponseSchema = z.object({
  success: z.boolean(),
  data: OfficeSettingsResponseSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

export const OfficeDescriptionListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(OfficeDescriptionResponseSchema),
  message: z.string().optional(),
  error: z.string().optional()
});

export const OfficeDescriptionSingleResponseSchema = z.object({
  success: z.boolean(),
  data: OfficeDescriptionResponseSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

export const DepartmentListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(DepartmentResponseSchema),
  message: z.string().optional(),
  error: z.string().optional()
});

export const EmployeeListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(EmployeeResponseSchema),
  pagination: PaginationSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

// Type exports
export type OfficeSettingsResponse = z.infer<typeof OfficeSettingsResponseSchema>;
export type OfficeDescriptionResponse = z.infer<typeof OfficeDescriptionResponseSchema>;
export type DepartmentResponse = z.infer<typeof DepartmentResponseSchema>;
export type EmployeeResponse = z.infer<typeof EmployeeResponseSchema>;
export type DepartmentQuery = z.infer<typeof DepartmentQuerySchema>;
export type EmployeeQuery = z.infer<typeof EmployeeQuerySchema>;

export type OfficeSettingsApiResponse = z.infer<typeof OfficeSettingsApiResponseSchema>;
export type OfficeDescriptionListResponse = z.infer<typeof OfficeDescriptionListResponseSchema>;
export type OfficeDescriptionSingleResponse = z.infer<typeof OfficeDescriptionSingleResponseSchema>;
export type DepartmentListResponse = z.infer<typeof DepartmentListResponseSchema>;
export type EmployeeListResponse = z.infer<typeof EmployeeListResponseSchema>;

// Legacy aliases for backward compatibility
export type OfficeSettings = OfficeSettingsResponse;
export type OfficeDescription = OfficeDescriptionResponse;
export type Department = DepartmentResponse;
export type Employee = EmployeeResponse;
export type DepartmentFilter = DepartmentQuery;
export type EmployeeFilter = EmployeeQuery;
export type DepartmentHierarchyResponse = DepartmentListResponse;