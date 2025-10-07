import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ContentPageContainer } from '@/domains/content-management/components/ContentPageContainer';
import { resolveContentFromSlug } from '@/domains/content-management/services/ContentResolver';
import type { ContentResolution } from '@/domains/content-management/services/ContentResolver';

interface ContentPageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    limit?: string;
    [key: string]: string | string[] | undefined;
  }>;
}

export async function generateMetadata(
  { params, searchParams }: ContentPageProps
): Promise<Metadata> {
  const { locale, slug } = await params;
  const searchParamsResolved = await searchParams;
  
  try {
    const slugArray = slug.filter(Boolean);
    const contentData = await resolveContentFromSlug(slugArray, locale, searchParamsResolved);
    
    if (!contentData) {
      return {
        title: 'Content Not Found',
        description: 'The requested content could not be found.',
      };
    }

    if (contentData.type === 'single-content') {
      const { content } = contentData;
      const title = (content.title as Record<string, string>)[locale] || 
                   (content.title as Record<string, string>).en || 'Content';
      const description = content.excerpt ? 
                        (content.excerpt as Record<string, string>)[locale] || 
                        (content.excerpt as Record<string, string>).en || '' : '';
      
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'article',
          publishedTime: content.publishedAt || content.createdAt,
          modifiedTime: content.updatedAt,
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
        }
      };
    }
    
    if (contentData.type === 'category-listing') {
      const { category } = contentData;
      const categoryName = (category.name as Record<string, string>)[locale] || 
                          (category.name as Record<string, string>).en || 'Category';
      const categoryDescription = category.description ? 
                                (category.description as Record<string, string>)[locale] || 
                                (category.description as Record<string, string>).en || '' : '';
      const title = `${categoryName}`;
      
      return {
        title,
        description: categoryDescription,
        openGraph: {
          title,
          description: categoryDescription,
          type: 'website',
        },
        twitter: {
          card: 'summary',
          title,
          description: categoryDescription,
        }
      };
    }

    return {
      title: 'Content',
      description: 'Browse our content and resources',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Content Not Found',
      description: 'The requested content could not be found.',
    };
  }
}

export default async function ContentPage({ params, searchParams }: ContentPageProps) {
  const { locale, slug } = await params;
  const searchParamsResolved = await searchParams;
  
  try {
    console.log('🚀 ContentPage params received:', { locale, slug, searchParams: searchParamsResolved });
    console.log('🔍 Slug type:', typeof slug, 'Slug value:', slug);
    
    const slugArray = slug.filter(Boolean);
    
    console.log('🚀 ContentPage accessed:', { locale, slug, slugArray, searchParams: searchParamsResolved });
    
    const contentData = await resolveContentFromSlug(slugArray, locale, searchParamsResolved);
    
    if (!contentData) {
      console.log('❌ No content data resolved, showing 404');
      notFound();
    }

    console.log('✅ Content data resolved successfully:', {
      type: contentData.type,
      category: contentData.type === 'category-listing' ? contentData.category.name : 
                contentData.type === 'single-content' ? contentData.category.name : null,
      contentTitle: contentData.type === 'single-content' ? contentData.content.title : null,
      contentsCount: contentData.type === 'category-listing' ? contentData.contents.length : null
    });

    return (
      <ContentPageContainer
        contentData={contentData}
        locale={locale as 'en' | 'ne'}
        searchParams={searchParams}
      />
    );
  } catch (error) {
    console.error('❌ Error loading content:', error);
    
    // Check if it's a Next.js HTTP error with fallback code
    if (error instanceof Error && error.message.startsWith('NEXT_HTTP_ERROR_FALLBACK;')) {
      const [, code] = error.message.split(';');
      if (code === '404') {
        notFound();
      }
      
      // For other HTTP errors, render a client-side fallback
      const ClientFallback = dynamic(() => import('./client-fallback'), {
        loading: () => <div>Loading content...</div>
      });
      
      return (
        <ClientFallback 
          slug={slug} 
          locale={locale as 'en' | 'ne'}
          searchParams={searchParamsResolved}
        />
      );
    }
    
    // Use Next.js notFound() for other errors
    notFound();
  }
}
