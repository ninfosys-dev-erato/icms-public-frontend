import { publicApiClient } from '@/repositories/http/PublicApiClient';
import type { ContentResponse, Category } from '@/domains/content-management/types/content';

export type ContentResolution = 
  | {
      type: 'single-content';
      content: ContentResponse;
      category: Category;
      categoryPath: Category[];
      breadcrumbs: BreadcrumbItem[];
    }
  | {
      type: 'category-listing';
      category: Category;
      categoryPath: Category[];
      contents: ContentResponse[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
      breadcrumbs: BreadcrumbItem[];
    }
  | null;

export interface BreadcrumbItem {
  title: string;
  href?: string;
  isActive?: boolean;
}

// API Response types based on backend DTOs
interface CategoryApiResponse {
  success: boolean;
  data: ContentResponse[]; // Array of content items, each with their own category
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
  error?: string;
}

interface ContentApiResponse {
  success: boolean;
  data: ContentResponse;
  message?: string;
  error?: string;
}

/**
 * Resolves content from URL path using your backend's navigation API endpoints
 * URL patterns: /content/[categorySlug] OR /content/[categorySlug]/[contentSlug]
 */
export async function resolveContentFromSlug(
  slugArray: string[],
  locale: string,
  searchParams: any = {}
): Promise<ContentResolution> {
  const currentLang = locale as 'en' | 'ne';
  
  console.log('🚀 ContentResolver called with:', {
    slugArray,
    locale,
    currentLang,
    searchParams,
    slugArrayLength: slugArray?.length,
    slugArrayType: typeof slugArray,
    isArray: Array.isArray(slugArray)
  });
  
  if (!slugArray || slugArray.length === 0) {
    console.log('❌ No slug array provided or empty');
    return null;
  }

  console.log('✅ Resolving content for slugs:', slugArray, 'with params:', searchParams);
  console.log('🔍 Slug array details:', {
    length: slugArray.length,
    items: slugArray.map((slug, index) => ({ index, slug, type: typeof slug }))
  });

  try {
    if (slugArray.length === 1) {
      // Single slug: /content/[categorySlug] 
      const categorySlug = slugArray[0];
      
      try {
        // Map URL search params to API query shape
        const apiQuery: any = {
          page: parseInt(searchParams.page || '1'),
          limit: parseInt(searchParams.limit || '12'),
        };

        // Accept both 'q' and 'search' as query keys
        if (searchParams.q) apiQuery.search = searchParams.q;
        if (searchParams.search) apiQuery.search = searchParams.search;
        if (searchParams.dateFrom) apiQuery.dateFrom = searchParams.dateFrom;
        if (searchParams.dateTo) apiQuery.dateTo = searchParams.dateTo;
        if (searchParams.type) apiQuery.type = searchParams.type;
        if (searchParams.lang) apiQuery.lang = searchParams.lang;

        // Use your backend's category endpoint: GET /content/category/:slug
        const categoryResponse = await publicApiClient.get<CategoryApiResponse>(`/content/category/${categorySlug}`, apiQuery);
        
        if (categoryResponse.success && categoryResponse.data !== undefined && Array.isArray(categoryResponse.data)) {
          // Check if we have content items to extract category from
          if (categoryResponse.data.length > 0) {
            // Extract category from the first content item (they all have the same category)
            const firstContent = categoryResponse.data[0];
            const category = firstContent.category;
            
            if (!category) {
              console.error('❌ Category not found in content items');
              return null;
            }
            
            const breadcrumbs = buildCategoryBreadcrumbs(category, currentLang);
            
            console.log('✅ Category resolved:', category.name, 'with', categoryResponse.data.length, 'contents');
            
            return {
              type: 'category-listing',
              category,
              categoryPath: [category],
              contents: categoryResponse.data,
              pagination: categoryResponse.pagination,
              breadcrumbs,
            };
          } else {
            // Empty category - check if we have pagination info that might include category info
            console.log('📝 Empty category detected, checking if category exists');
            
            // For empty categories, we'll create a mock category based on the slug
            // This is a fallback when the category exists but has no content
            const mockCategory: Category = {
              id: categorySlug,
              name: { 
                en: categorySlug === 'notices' ? 'Notices' : categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
                ne: categorySlug === 'notices' ? 'सूचनाहरू' : categorySlug
              },
              slug: categorySlug,
              description: {
                en: `Browse ${categorySlug}`,
                ne: `${categorySlug} ब्राउज गर्नुहोस्`
              },
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            const breadcrumbs = buildCategoryBreadcrumbs(mockCategory, currentLang);
            
            console.log('✅ Empty category resolved with mock data:', mockCategory.name, 'with 0 contents');
            
            return {
              type: 'category-listing',
              category: mockCategory,
              categoryPath: [mockCategory],
              contents: [], // Empty array
              pagination: categoryResponse.pagination || {
                page: 1,
                limit: parseInt(searchParams.limit || '12'),
                total: 0,
                totalPages: 1,
                hasNext: false,
                hasPrev: false
              },
              breadcrumbs,
            };
          }
        }
      } catch (error) {
        console.error('Category not found:', error);
        
        // Try as direct content slug fallback
        try {
          const contentResponse = await publicApiClient.get<ContentApiResponse>(`/content/${categorySlug}`);
          
          if (contentResponse.success && contentResponse.data) {
            const content = contentResponse.data;
            const category = content.category;
            
            console.log('🔍 Direct content data received:', content);
            console.log('🔍 Direct category from content:', category);
            
            // Check if category exists before building breadcrumbs
            if (!category) {
              console.error('❌ Content found but category is undefined:', content);
              return null;
            }
            
            // Validate category structure
            if (!category.name || !category.slug) {
              console.error('❌ Category is missing required fields:', category);
              return null;
            }
            
            const breadcrumbs = buildContentBreadcrumbs(category, content, currentLang);
            
            console.log('✅ Direct content resolved:', content.title);
            
            return {
              type: 'single-content',
              content,
              category,
              categoryPath: [category],
              breadcrumbs,
            };
          }
        } catch (contentError) {
          console.error('Content not found either:', contentError);
        }
      }
    }

    if (slugArray.length === 2) {
      // Two slugs: /content/[categorySlug]/[contentSlug]
      const [categorySlug, contentSlug] = slugArray;
      
      console.log('🎯 Processing 2-slug case:', { categorySlug, contentSlug });
      
      try {
        // First try to get content by slug only (this is the correct approach)
        console.log('🔍 Attempting to fetch content by slug:', contentSlug);
        console.log('🌐 API URL will be:', `/content/${contentSlug}`);
        
        const contentResponse = await publicApiClient.get<ContentApiResponse>(`/content/${contentSlug}`);
        
        console.log('✅ Content response received:', contentResponse);
        console.log('🔍 Response structure:', {
          success: contentResponse.success,
          hasData: !!contentResponse.data,
          dataType: typeof contentResponse.data,
          dataKeys: contentResponse.data ? Object.keys(contentResponse.data) : 'no data'
        });
        
        if (contentResponse.success && contentResponse.data) {
          const content = contentResponse.data;
          const category = content.category;
          
          console.log('🔍 Content data received:', content);
          console.log('🔍 Category from content:', category);
          console.log('🔍 Category type:', typeof category);
          console.log('🔍 Category keys:', category ? Object.keys(category) : 'no category');
          
          // Check if category exists before building breadcrumbs
          if (!category) {
            console.error('❌ Content found but category is undefined:', content);
            return null;
          }
          
          // Validate category structure
          if (!category.name || !category.slug) {
            console.error('❌ Category is missing required fields:', category);
            return null;
          }
          
          const breadcrumbs = buildContentBreadcrumbs(category, content, currentLang);
          
          console.log('✅ Content resolved by slug:', content.title, 'in category:', category.name);
          
          return {
            type: 'single-content',
            content,
            category,
            categoryPath: [category],
            breadcrumbs,
          };
        }
      } catch (error) {
        console.error('Failed to fetch content by slug:', error);
        
        // Fallback: try to get content by category and slug combination
        try {
          console.log('🔄 Fallback: attempting to fetch content by category and slug:', categorySlug, contentSlug);
          console.log('🌐 API URL will be:', `/content/${categorySlug}/${contentSlug}`);
          
          const response = await publicApiClient.get<ContentApiResponse>(`/content/${categorySlug}/${contentSlug}`);
          
          if (response.success && response.data) {
            const content = response.data;
            const category = content.category;
            
            console.log('🔍 Fallback content data received:', content);
            console.log('🔍 Fallback category from content:', category);
            
            // Check if category exists before building breadcrumbs
            if (!category) {
              console.error('❌ Content found but category is undefined:', content);
              return null;
            }
            
            // Validate category structure
            if (!category.name || !category.slug) {
              console.error('❌ Category is missing required fields:', category);
              return null;
            }
            
            const breadcrumbs = buildContentBreadcrumbs(category, content, currentLang);
            
            console.log('✅ Content resolved by category and slug fallback:', content.title);
            
            return {
              type: 'single-content',
              content,
              category,
              categoryPath: [category],
              breadcrumbs,
            };
          }
        } catch (fallbackError) {
          console.error('Failed to fetch content by category and slug fallback:', fallbackError);
        }
      }
    }

    console.log('No content resolution found for:', slugArray);
    return null;

  } catch (error) {
    console.error('Error resolving content from slug:', error);
    return null;
  }
}

function buildCategoryBreadcrumbs(category: Category, currentLang: 'en' | 'ne'): BreadcrumbItem[] {
  // Safety check for category
  if (!category) {
    console.error('buildCategoryBreadcrumbs: category is undefined');
    return [
      { title: currentLang === 'ne' ? 'मुख्य पृष्ठ' : 'Home', href: '/' }
    ];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: currentLang === 'ne' ? 'मुख्य पृष्ठ' : 'Home', href: '/' }
  ];

  breadcrumbs.push({
    title: (category.name as Record<string, string>)[currentLang] || (category.name as Record<string, string>).en,
    isActive: true,
  });

  return breadcrumbs;
}

function buildContentBreadcrumbs(category: Category, content: ContentResponse, currentLang: 'en' | 'ne'): BreadcrumbItem[] {
  // Safety check for category and content
  if (!category || !content) {
    console.error('buildContentBreadcrumbs: category or content is undefined', { category, content });
    return [
      { title: currentLang === 'ne' ? 'मुख्य पृष्ठ' : 'Home', href: '/' }
    ];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: currentLang === 'ne' ? 'मुख्य पृष्ठ' : 'Home', href: '/' }
  ];

  // Add category breadcrumb
  breadcrumbs.push({
    title: (category.name as Record<string, string>)[currentLang] || (category.name as Record<string, string>).en,
    href: `/content/${category.slug}`,
    isActive: false,
  });

  // Add content breadcrumb
  breadcrumbs.push({
    title: (content.title as Record<string, string>)[currentLang] || (content.title as Record<string, string>).en,
    isActive: true,
  });

  return breadcrumbs;
}