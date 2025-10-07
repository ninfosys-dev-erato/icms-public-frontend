import { z } from "zod"
import { 
  TranslatableEntitySchema,
  TypographySettingsSchema,
  HeaderAlignmentSchema,
  BaseQuerySchema,
  PaginationSchema
} from "./shared"

// Slider Response Schema (matches backend SliderResponseDto)
export const SliderResponseSchema = z.object({
  id: z.string(),
  title: TranslatableEntitySchema.optional(),
  position: z.number(),
  displayTime: z.number(),
  isActive: z.boolean(),
  media: z.any(), // Media object from backend
  clickCount: z.number(),
  viewCount: z.number(),
  clickThroughRate: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Header Config Schema (matches backend HeaderConfigResponseDto)
export const HeaderConfigResponseSchema = z.object({
  id: z.string(),
  name: TranslatableEntitySchema,
  order: z.number(),
  isActive: z.boolean(),
  isPublished: z.boolean(),
  typography: TypographySettingsSchema,
  alignment: HeaderAlignmentSchema,
  logo: z.any().optional(), // LogoConfigurationResponseDto
  layout: z.any().optional(), // LayoutConfigurationDto
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.any().optional(),
  updatedBy: z.any().optional()
});

// Important Link Response Schema (matches backend ImportantLinkResponseDto)
export const ImportantLinkResponseSchema = z.object({
  id: z.string(),
  linkTitle: TranslatableEntitySchema,
  linkUrl: z.string(),
  order: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Footer Links Schema (matches backend FooterLinksDto)
export const FooterLinksSchema = z.object({
  quickLinks: z.array(ImportantLinkResponseSchema),
  governmentLinks: z.array(ImportantLinkResponseSchema),
  socialMediaLinks: z.array(ImportantLinkResponseSchema),
  contactLinks: z.array(ImportantLinkResponseSchema)
});

// Query Schemas
export const SliderQuerySchema = BaseQuerySchema.extend({
  position: z.number().optional(),
  displayTime: z.number().optional(),
  hasMedia: z.boolean().optional()
});

export const ImportantLinkQuerySchema = BaseQuerySchema.extend({
  linkType: z.string().optional(),
  category: z.string().optional()
});

// API Response Schemas
export const SliderListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SliderResponseSchema),
  message: z.string().optional(),
  error: z.string().optional()
});

export const HeaderConfigApiResponseSchema = z.object({
  success: z.boolean(),
  data: HeaderConfigResponseSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

export const ImportantLinkListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ImportantLinkResponseSchema),
  pagination: PaginationSchema.optional(),
  message: z.string().optional(),
  error: z.string().optional()
});

export const FooterLinksResponseSchema = z.object({
  success: z.boolean(),
  data: FooterLinksSchema,
  message: z.string().optional(),
  error: z.string().optional()
});

// Slider Interaction Tracking
export const SliderInteractionSchema = z.object({
  sliderId: z.string(),
  type: z.enum(["view", "click"]),
  timestamp: z.string().datetime(),
  userAgent: z.string().optional(),
  referrer: z.string().optional()
});

// Type exports
export type SliderResponse = z.infer<typeof SliderResponseSchema>;
export type HeaderConfigResponse = z.infer<typeof HeaderConfigResponseSchema>;
export type ImportantLinkResponse = z.infer<typeof ImportantLinkResponseSchema>;
export type FooterLinks = z.infer<typeof FooterLinksSchema>;
export type SliderQuery = z.infer<typeof SliderQuerySchema>;
export type ImportantLinkQuery = z.infer<typeof ImportantLinkQuerySchema>;

export type SliderListResponse = z.infer<typeof SliderListResponseSchema>;
export type HeaderConfigApiResponse = z.infer<typeof HeaderConfigApiResponseSchema>;
export type ImportantLinkListResponse = z.infer<typeof ImportantLinkListResponseSchema>;
export type FooterLinksResponse = z.infer<typeof FooterLinksResponseSchema>;
export type SliderInteraction = z.infer<typeof SliderInteractionSchema>;

// Legacy aliases for backward compatibility
export type Slider = SliderResponse;
export type HeaderConfig = HeaderConfigResponse;
export type ImportantLink = ImportantLinkResponse;
export type SliderFilter = SliderQuery;
export type ImportantLinkFilter = ImportantLinkQuery;