import { z } from "zod"
import { TranslatableEntitySchema } from "./shared"

// Navigation models (frontend-generated for now since backend doesn't have navigation module)
// These will be used to build navigation from content structure

// Menu Location Enum
export const MenuLocationSchema = z.enum(["header", "footer", "sidebar", "mobile"]);

// Menu Item Type Enum
export const MenuItemTypeSchema = z.enum([
  "link", 
  "content", 
  "document", 
  "external", 
  "category",
  "office-info",
  "static-page"
]);

// Menu Item Schema
export const MenuItemSchema = z.object({
  id: z.string(),
  title: TranslatableEntitySchema,
  url: z.string(),
  type: MenuItemTypeSchema,
  target: z.enum(["_self", "_blank"]).default("_self"),
  iconClass: z.string().optional(),
  description: TranslatableEntitySchema.optional(),
  parentId: z.string().optional(),
  level: z.number().min(0),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  isExternal: z.boolean().default(false),
  requiresAuth: z.boolean().default(false),
  children: z.array(z.lazy(() => MenuItemSchema)).optional(),
  metadata: z.record(z.any()).optional()
});

// Menu Schema
export const MenuSchema = z.object({
  id: z.string(),
  name: TranslatableEntitySchema,
  location: MenuLocationSchema,
  description: TranslatableEntitySchema.optional(),
  isActive: z.boolean().default(true),
  order: z.number().default(0),
  items: z.array(MenuItemSchema).default([]),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Breadcrumb Schema
export const BreadcrumbItemSchema = z.object({
  title: TranslatableEntitySchema,
  url: z.string(),
  isActive: z.boolean().default(false),
  isExternal: z.boolean().default(false)
});

export const BreadcrumbSchema = z.array(BreadcrumbItemSchema);

// Navigation Query Schema
export const NavigationQuerySchema = z.object({
  location: MenuLocationSchema.optional(),
  isActive: z.boolean().optional(),
  includeChildren: z.boolean().default(true),
  maxDepth: z.number().min(1).max(5).optional(),
  lang: z.enum(['ne', 'en']).optional()
});

// Static navigation structure (can be used for initial setup)
export const StaticNavigationSchema = z.object({
  header: MenuSchema.optional(),
  footer: MenuSchema.optional(),
  sidebar: MenuSchema.optional(),
  mobile: MenuSchema.optional()
});

// API Response Schemas (for when backend navigation is implemented)
export const MenuListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(MenuSchema),
  message: z.string().optional(),
  error: z.string().optional()
});

export const NavigationResponseSchema = z.object({
  success: z.boolean(),
  data: StaticNavigationSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

// Type exports
export type MenuLocation = z.infer<typeof MenuLocationSchema>;
export type MenuItemType = z.infer<typeof MenuItemTypeSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Menu = z.infer<typeof MenuSchema>;
export type BreadcrumbItem = z.infer<typeof BreadcrumbItemSchema>;
export type Breadcrumb = z.infer<typeof BreadcrumbSchema>;
export type NavigationQuery = z.infer<typeof NavigationQuerySchema>;
export type StaticNavigation = z.infer<typeof StaticNavigationSchema>;

export type MenuListResponse = z.infer<typeof MenuListResponseSchema>;
export type NavigationResponse = z.infer<typeof NavigationResponseSchema>;

// Legacy aliases for backward compatibility
export type MenuFilter = NavigationQuery;
export type MenuTreeResponse = Menu;
export type MenuItemListResponse = MenuItem[];