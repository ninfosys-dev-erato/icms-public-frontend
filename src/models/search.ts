import { z } from "zod"
import { BaseQuerySchema, PaginationSchema } from "./shared"

// Content Type Enum (from backend SearchIndex)
export const ContentTypeSchema = z.enum([
  'CONTENT',
  'DOCUMENT', 
  'FAQ',
  'NOTICE',
  'DEPARTMENT',
  'EMPLOYEE',
  'SLIDER'
]);

// Search Index Schema (matches backend SearchIndex entity)
export const SearchIndexSchema = z.object({
  id: z.string(),
  contentId: z.string(),
  contentType: ContentTypeSchema,
  title: z.any(), // JsonValue in backend
  content: z.any(), // JsonValue in backend
  description: z.any().optional(),
  tags: z.array(z.string()),
  language: z.string(),
  isPublished: z.boolean(),
  isActive: z.boolean(),
  searchScore: z.number(),
  lastIndexedAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Search Query Schema (matches backend SearchQueryDto)
export const SearchQuerySchema = BaseQuerySchema.extend({
  q: z.string(),
  contentType: ContentTypeSchema.optional(),
  language: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minScore: z.number().optional(),
  includeInactive: z.boolean().default(false)
});

// Search Result Schema  
export const SearchResultSchema = z.object({
  id: z.string(),
  title: z.any(), // Can be string or TranslatableEntity
  content: z.any().optional(),
  excerpt: z.string().optional(),
  url: z.string(),
  contentType: ContentTypeSchema,
  language: z.string(),
  tags: z.array(z.string()),
  publishedAt: z.string().datetime().optional(),
  relevanceScore: z.number(),
  highlightedText: z.string().optional()
});

// Search Suggestion Schema (from backend SearchSuggestion entity)
export const SearchSuggestionSchema = z.object({
  id: z.string(),
  query: z.string(),
  frequency: z.number(),
  resultCount: z.number(),
  language: z.string(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Advanced Search Query Schema
export const AdvancedSearchQuerySchema = z.object({
  query: z.string(),
  title: z.string().optional(),
  content: z.string().optional(),
  contentTypes: z.array(ContentTypeSchema).optional(),
  tags: z.array(z.string()).optional(),
  language: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  minScore: z.number().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.enum(['relevance', 'date', 'title']).default('relevance'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// API Response Schemas
export const SearchResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    results: z.array(SearchResultSchema),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
    processingTime: z.number().optional(),
    facets: z.object({
      contentTypes: z.record(z.number()).optional(),
      languages: z.record(z.number()).optional(),
      tags: z.record(z.number()).optional(),
      years: z.record(z.number()).optional()
    }).optional()
  }),
  message: z.string().optional(),
  error: z.string().optional()
});

export const SearchSuggestionsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SearchSuggestionSchema),
  message: z.string().optional(),
  error: z.string().optional()
});

export const PopularSearchesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({
    query: z.string(),
    frequency: z.number(),
    trend: z.enum(['up', 'down', 'stable']).optional()
  })),
  message: z.string().optional(),
  error: z.string().optional()
});

// Type exports
export type ContentType = z.infer<typeof ContentTypeSchema>;
export type SearchIndex = z.infer<typeof SearchIndexSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchSuggestion = z.infer<typeof SearchSuggestionSchema>;
export type AdvancedSearchQuery = z.infer<typeof AdvancedSearchQuerySchema>;

export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type SearchSuggestionsResponse = z.infer<typeof SearchSuggestionsResponseSchema>;
export type PopularSearchesResponse = z.infer<typeof PopularSearchesResponseSchema>;

// Search history for client-side tracking
export const SearchHistoryItemSchema = z.object({
  query: z.string(),
  timestamp: z.string().datetime(),
  resultCount: z.number(),
  contentType: ContentTypeSchema.optional()
});

export type SearchHistoryItem = z.infer<typeof SearchHistoryItemSchema>;
export type SearchHistoryResponse = SearchHistoryItem[];