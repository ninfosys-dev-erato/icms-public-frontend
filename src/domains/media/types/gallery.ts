import { z } from "zod"

// Gallery Photo Schema (matches backend API response)
export const GalleryPhotoSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  originalName: z.string(),
  url: z.string().optional(), // API response has this field
  presignedUrl: z.string(),
  fileId: z.string().optional(), // API response has this field
  size: z.number(),
  contentType: z.string(),
  uploadedBy: z.string().optional(), // API response has this field
  folder: z.string(),
  category: z.string(),
  altText: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublic: z.boolean(), // API response has this field
  isActive: z.boolean(), // API response has this field
  metadata: z.object({
    depth: z.string().optional(),
    space: z.string().optional(),
    
    width: z.number().optional(),
    format: z.string().optional(),
    height: z.number().optional(),
    density: z.number().optional(),
    channels: z.number().optional(),
    hasAlpha: z.boolean().optional(),
    hasProfile: z.boolean().optional(),
  }).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
}).transform((data) => {
  console.log('🔍 GalleryPhotoSchema: Validating photo data:', data);
  return data;
});

// Gallery Query Schema
export const GalleryQuerySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(10),
  folder: z.string().optional(),
  category: z.string().optional()
})

// Gallery API Response Schema
export const GalleryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(GalleryPhotoSchema),
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
export type GalleryPhoto = z.infer<typeof GalleryPhotoSchema>
export type GalleryQuery = z.infer<typeof GalleryQuerySchema>
export type GalleryResponse = z.infer<typeof GalleryResponseSchema>
